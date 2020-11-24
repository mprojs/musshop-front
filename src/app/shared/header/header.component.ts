import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../core/store/reducers/core.reducers";
import {AuthActions, AuthSelectors, CartSelectors, MixSelectors} from "../../core/store";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {MessagesService} from "../../core/services/messages.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobile$: Observable<any>;
  showFiltersBtn: boolean;
  showMobileMenu: boolean;
  links: Array<{name: string; url: string; dropdown?: boolean}>
  profileLinks: Array<{name: string; url: string;}>
  cartItemsCount: number;
  // cartItems$: Observable<Array<ICartItem>>;
  showProfileMenu = false;
  username$: Observable<string>;


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private messagesService: MessagesService
  ) {
    this.links = [
      {name: 'Products', url: '/shop'},
      {name: 'About', url: '/about'},
      {name: 'Contact', url: '/contact'},
      {name: 'Profile', url: '/auth', dropdown: true},
    ];
    this.profileLinks = [
      {name: 'My orders', url: '/orders'},
      {name: 'My wishes', url: '/cart/wishlist'},
      // {name: 'Messages', url: '/auth'},
      // {name: 'Coupons', url: '/auth'}
    ];
  }

  ngOnInit(): void {
    this.isMobile$ = this.store.select(MixSelectors.selectIsMobile);
    this.store.select(CartSelectors.selectItems).subscribe(items => {
      this.cartItemsCount = items.reduce((acc, cur) => acc + cur.quantity, 0);
    })
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showFiltersBtn = e.url.startsWith('/shop');
      });
    this.username$ = this.store.select(AuthSelectors.selectUsername)
  }

  onToggleFilters() {
    this.messagesService.sendToggleFiltersEvents();
  }

  onToggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
  //   console.log(this.store);
  //   let shopState = this.store.select(state => state['shop']);
  //   shopState.subscribe(s => {
  //     console.log(s);
  //   })
  // }

  public onProfileEnter() {
    this.showProfileMenu = true;
  }

  public onProfileLeave() {
    this.showProfileMenu = false;
  }

  public logoutClick() {
    this.store.dispatch(AuthActions.logoutUser());
  }
}
