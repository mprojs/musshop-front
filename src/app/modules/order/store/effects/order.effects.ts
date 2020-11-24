import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, switchMap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppStateWithShop} from "../../../shop/store/reducers/shop.reducer";
import {OrderActions} from "../index";
import {OrderService} from "../../order.service";
import {CartActions, MixActions} from "../../../../core/store";
import {of} from "rxjs";
import {CartService} from "../../../cart/cart.service";

@Injectable()
export class OrderEffects {

  constructor(
    private store: Store<AppStateWithShop>,
    private actions$: Actions,
    private orderService: OrderService,
    private cartService: CartService
  ) {
  }

  $getOrders = createEffect(() => (
    this.actions$.pipe(
      ofType(OrderActions.getOrders),
      switchMap((action: any) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.orderService.getOrders().pipe(
          map((orders:any) => {
            console.log(orders);
            this.store.dispatch(MixActions.setProgressOff());
            return OrderActions.getOrdersSuccess({orders});
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError({error, message:'Cannot get orders'}));
          })
        )
      })
    )
  ));

  $createOrder = createEffect(() => (
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      switchMap((action: any) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.orderService.createOrder().pipe(
          map((order:any) => {
            this.store.dispatch(MixActions.setProgressOff());
            this.store.dispatch(CartActions.loadCart());
            return OrderActions.createOrderSuccess({order});
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError({error, message:'Cannot create order'}));
          })
        )
      })
    )
  ));

  $createOrderSuccess = createEffect(() => (
    this.actions$.pipe(
      ofType(OrderActions.createOrderSuccess),
      switchMap((action: any) => {
        return of(OrderActions.getOrders());
      })
    )
  ));

  $cancelOrder = createEffect(() => (
    this.actions$.pipe(
      ofType(OrderActions.cancelOrder),
      switchMap((action: any) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.orderService.cancelOrder(action.orderId).pipe(
          map((data:any) => {
            this.store.dispatch(MixActions.setProgressOff());
            return OrderActions.cancelOrderSuccess({orderId:action.orderId, status: 'CANCELLED'});
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError({error, message:'Cannot create order'}));
          })
        )
      })
    )
  ));

  $renewOrder = createEffect(() => (
    this.actions$.pipe(
      ofType(OrderActions.renewOrder),
      switchMap((action: any) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.orderService.renewOrder(action.orderId).pipe(
          map((data:any) => {
            this.store.dispatch(MixActions.setProgressOff());
            return OrderActions.cancelOrderSuccess({orderId:action.orderId, status: 'PROCESSING'});
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError({error, message:'Cannot renew order'}));
          })
        )
      })
    )
  ));
}
