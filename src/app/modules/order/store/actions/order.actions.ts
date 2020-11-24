import {createAction, props} from '@ngrx/store';
import {IOrder} from "../reducers/order.types";

export const getOrders = createAction('[Order] Get orders');

export const getOrdersSuccess = createAction('[Order] Get orders success',
  props<{ orders: IOrder[] }>());

export const createOrder = createAction('[Order] Create order');

export const createOrderSuccess = createAction('[Order] Create order success',
  props<{order: {orderId: number}}>());

export const clearCreatedOrder = createAction('[Order] Clear created order');

export const cancelOrder = createAction('[Order] Cancel order',
  props<{orderId: number}>());

export const cancelOrderSuccess = createAction('[Order] Cancel order success',
  props<{orderId: number, status: string}>());

export const renewOrder = createAction('[Order] Renew order',
  props<{orderId: number}>());

export const renewOrderSuccess = createAction('[Order] Renew order success',
  props<{orderId: number, status: string}>());


