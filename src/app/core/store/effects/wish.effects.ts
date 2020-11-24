import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../reducers/core.reducers";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {CartService} from "../../../modules/cart/cart.service";
import {CartActions, MixActions, WishActions, WishSelectors} from "../index";
import {catchError, first, map, switchMap, withLatestFrom} from "rxjs/operators";
import {of} from "rxjs";
import {IProduct} from "../../../shared/types/IProduct";
import {IWishProducts} from "../types/IWishProducts";

@Injectable()
export class WishEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private cartService: CartService
  ) {
  }

  addToWishlist$ = createEffect(() => (
    this.actions$.pipe(
      ofType(WishActions.addToWishlist),
      withLatestFrom(this.store.select(WishSelectors.selectProducts)),
      switchMap(([action, products]) => {
        console.log(products, action);
        let productIds = Object.keys(products).map(id => +id);
        this.store.dispatch(MixActions.setProgressOn());
        return this.cartService.addToWishlist(action.product.productId).pipe(
          map(() => {
            this.store.dispatch(MixActions.setProgressOff());
            return WishActions.addToWishlistSuccess();
          }),
          catchError(error => {
            console.log(error);
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError({error, message: 'Cannot add to wishlist'}))
          })
        )
      })
    )
  ));

  removeFromWishlist$ = createEffect(() => (
    this.actions$.pipe(
      ofType(WishActions.removeFromWishlist),
      withLatestFrom(this.store.select(WishSelectors.selectProducts)),
      switchMap(([action, products]) => {
        console.log(action, products);
        this.store.dispatch(MixActions.setProgressOn());
        let wishlistIds = Object.keys(products).map(id => +id);
        return this.cartService.removeFromWishlist(action.product, wishlistIds).pipe(
          map(() => {
            this.store.dispatch(MixActions.setProgressOff());
            return WishActions.removeFromWishlistSuccess();
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError({error, message: 'Cannot add to wishlist'}))
          })
        )
      })
    )
  ));

  loadWishlist$ = createEffect(() => (
    this.actions$.pipe(
      ofType(WishActions.loadWishlist),
      switchMap((action) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.cartService.loadWishlist().pipe(
          first(),
          map((data: IWishProducts) => {
            // console.log(data);
            this.store.dispatch(MixActions.setProgressOff());
            return WishActions.loadWishlistSuccess({products: data});
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError({error, message: 'Cannot load wishlist'}))
          })
        )
      })
    )
  ));


}
