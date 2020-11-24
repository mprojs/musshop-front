import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../../core/store/reducers/core.reducers";
import {CartActions, CartSelectors, MixActions, MixSelectors} from "../../../core/store";
import {ICart, ICartItem} from "../../../core/store/types/cart.types";
import {removeHTMLTags} from "../../../core/utils/strings-utils";
import {cloneObject} from "../../../core/utils/objects-utils";
import {Router} from "@angular/router";
import {IProduct} from "../../../shared/types/IProduct";
import {CartService} from "../cart.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  // items: Array<ICartItem>;
  cart: ICart;
  subscriptions = [];
  isMobile$: Observable<boolean>;
  outOfStockErrors$: Observable<Array<IProduct>>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.store.select(CartSelectors.selectCart).subscribe(cart => {
      let items = cart.items.map(item => {
        let itemClone = cloneObject(item);
        let desc = removeHTMLTags(itemClone.product.description);
        if (desc && desc.length > 20) {
          desc = desc.substr(0, 20) + '...';
        }
        itemClone.product.description = desc;
        return itemClone;
      }).sort((a, b) => a.product.name < b.product.name ? -1 : 1);
      this.cart = {
        ...cart,
        items
      }
    }));

    this.isMobile$ = this.store.select(MixSelectors.selectIsMobile);
    this.outOfStockErrors$ = this.store.select(CartSelectors.selectOutOfStockErrors)
  }

  public deleteItemClick(item: ICartItem) {
    this.store.dispatch(CartActions.deleteItem({item}));
  }

  public onCheckoutClick() {
    this.store.dispatch(MixActions.setCartProcessingOn()); //temp
    this.router.navigate(['/orders/checkout']);
    // this.store.select(AuthSelectors.selectIsAuth).subscribe(isAuth => {
    //   if (isAuth) {
    //   } else {
    //     // 1. save cart items in LS
    //     // localStorage.setItem('saved-cart', JSON.stringify(this.cart));
    //     // 2. navigate to checkout and pass param to replace cart items
    //     this.router.navigate(['/orders/checkout'], {queryParams: {loadSavedCart: true}});
    //   }
    // })
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public subQuantity(item: ICartItem) {
    if (item.quantity > 1) {
      this.cartService.setQuantity(item, item.quantity - 1);
    }
  }

  public addQuantity(item: ICartItem) {
    this.cartService.setQuantity(item, item.quantity + 1);
  }

  public changeQuantity(item, event) {
    let quantity = +event.target.value;
    if (isNaN(quantity)) {
      return;
    }
    this.cartService.setQuantity(item, quantity);
  }

  dismissOOSmessage() {
    this.store.dispatch(CartActions.outOfStockErrorClear());
  }
}


