import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../reducers/core.reducers";
import {act, Actions, createEffect, ofType} from "@ngrx/effects";
import {CartService} from "../../../modules/cart/cart.service";
import {AuthSelectors, CartActions, MixActions} from "../index";
import {catchError, debounceTime, map, mergeMap, switchMap, take, tap, withLatestFrom} from "rxjs/operators";
import {of} from "rxjs";
import {ICart} from "../types/cart.types";
import {BroadcastService} from "../../services/broadcast.service";

@Injectable()
export class CartEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private cartService: CartService,
    private broadcastService: BroadcastService
  ) { }

  $loadCartItems = createEffect(() => (
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap((action) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.cartService.loadCart().pipe(
          map((cart: any) => {
            this.store.dispatch(MixActions.setProgressOff());
            return CartActions.loadCartSuccess(cart);
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError({error, message:'Cannot load cart items'}))
          })
        )
      })
    )
  ));

  $addToCart = createEffect(() => (
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      mergeMap((action) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.cartService.addToCart(action).pipe(
          map((data: ICart) => {
            this.store.dispatch(MixActions.setProgressOff());
            // this.broadcastService.post(CartActions.addToCartSuccess(data));
            return CartActions.addToCartSuccess(data);
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            console.error(error);
            if (error.message.toString().indexOf('Please check input') >= 0) {
              return of(MixActions.apiError({
                error,
                message: 'Cannot add to cart, this item is out of stock',
                addlMessage: 'Please, contact our managers to order'
              }));
            } else {
              return of(MixActions.apiError({error, message: 'Cannot add to cart'}));
            }
          })
        )
      })
    )
  ))

  $deleteItem = createEffect(() => (
    this.actions$.pipe(
      ofType(CartActions.deleteItem),
      mergeMap((action) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.cartService.deleteItem(action).pipe(
          map((data: ICart) => {
            this.store.dispatch(MixActions.setProgressOff());
            return CartActions.deleteItemSuccess(data);
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError({error, message: 'Cannot remove from cart'}));
          })
        )
      })
    )
  ));

  $changeCartSuccess = createEffect(() => (
    this.actions$.pipe(
      ofType(
        CartActions.addToCartSuccess,
        CartActions.deleteItemSuccess,
        CartActions.loadCartSuccess
      ),
      map(action => {
        this.broadcastService.post({
          ...action,
          type: CartActions.changeCartSuccess.type
        });
        return CartActions.changeCart();
      })
    )
  ))
}
