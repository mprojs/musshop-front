import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IProduct} from "../types/IProduct";
import {Store} from "@ngrx/store";
import {AppStateWithShop} from "../../modules/shop/store/reducers/shop.reducer";
import {AuthSelectors, CartActions, WishActions} from "../../core/store";
import {filter, first} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product: IProduct;
  @Input() inWishList: boolean = false;
  @Output() onUnwish = new EventEmitter();

  constructor(
    private store: Store<AppStateWithShop>,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  public onAddToCart() {
    this.store.dispatch(CartActions.addToCart({productId: this.product.productId, quantity: 1}));
  }

  public onToggleWishlist() {
    if (this.inWishList) {
      this.onUnwish.emit();
    } else {
      // this.store.dispatch(WishActions.addToWishlist({product: this.product}));
      this.dispatchIfAuth(WishActions.addToWishlist({product: this.product}));
    }
  }

  dispatchIfAuth(action: any) {
    this.store.select(AuthSelectors.selectIsAuth).pipe(
      first()
    ).subscribe((isAuth) => {
      if (isAuth) {
        this.store.dispatch(action);
      } else {
        this.router.navigate(['/auth/signin', {
          queryParams: { returnUrl: this.router.url }
        }])
      }
    })
  }
}
