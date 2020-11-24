import {Action, createReducer, on} from "@ngrx/store";
import {IProduct} from "../../../shared/types/IProduct";
import * as CartActions from "../actions/cart.actions";
import {ICartItem} from "../types/cart.types";

export interface ICartState {
  items: Array<ICartItem>;
  total: string;
  subtotal: string;
  discountTotal: string;
  shippingTotal: string;
  outOfStockErrors: Array<IProduct>;
}

export function reducer(state: ICartState | undefined, action: Action) {
  return cartReducer(state, action);
}

export const initialState: ICartState = {
  items: [],
  total: '',
  subtotal: '',
  discountTotal: '',
  shippingTotal: '',
  outOfStockErrors: null,
};

const cartReducer = createReducer(
  initialState,
  on(CartActions.addToCartSuccess, (state, payload) => (
    {...state, ...payload}
  )),
  on(CartActions.loadCartSuccess, (state, payload) => (
    {...state, ...payload}
  )),
  on(CartActions.deleteItemSuccess, (state, payload) => (
    {...state, ...payload}
  )),
  on(CartActions.changeCartSuccess, (state, payload) => (
    {...state, ...payload}
  )),
  on(CartActions.outOfStockError, (state, payload) => (
    {...state, outOfStockErrors: payload.products}
  )),
  on(CartActions.outOfStockErrorClear, (state, payload) => (
    {...state, outOfStockErrors: null}
  )),
);
