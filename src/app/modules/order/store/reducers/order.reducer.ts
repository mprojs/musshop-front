import {Action, createReducer, on} from "@ngrx/store";
import * as OrderActions from "../actions/order.actions";
import * as fromRoot from "../../../../core/store/reducers/core.reducers";
import {IOrder} from "./order.types";
import {cloneObject} from "../../../../core/utils/objects-utils";

export interface AppStateWithOrder extends fromRoot.AppState {
  'order': IOrderState
}

export interface IOrderState{
  orders: Array<IOrder>;
  createdOrder: {orderId: number};
}

export function reducer(state: IOrderState | undefined, action: Action) {
  return orderReducer(state, action);
}

export const initialState: IOrderState = {
  orders: [],
  createdOrder: null,
};

const orderReducer = createReducer(
  initialState,
  on(OrderActions.getOrdersSuccess, (state,payload) => (
    {...state, orders: payload.orders}
  )),
  on(OrderActions.createOrder, (state) => (
    {...state, createdOrder: null}
  )),
  on(OrderActions.createOrderSuccess, (state,payload) => (
    {...state, createdOrder: payload.order}
  )),
  on(OrderActions.clearCreatedOrder, (state) => (
    {...state, createdOrder: null}
  )),
  on(OrderActions.cancelOrderSuccess, (state, payload) => (
    {
      ...state,
      orders: getOrdersAfterStatusChanged(state.orders, payload)
    }
  )),
  on(OrderActions.renewOrderSuccess, (state, payload) => (
    {
      ...state,
      orders: getOrdersAfterStatusChanged(state.orders, payload)
    }
  ))
);

const getOrdersAfterStatusChanged = (orders, payload) => {
  return orders.map(order => {
    let orderClone = cloneObject(order);
    if (order.orderId === payload.orderId){
      orderClone.status = payload.status;
    }
    return orderClone;
  })
}

