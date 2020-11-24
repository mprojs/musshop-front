import {Action, createReducer, on} from "@ngrx/store";
import * as ProductActions from "../actions/product.actions";
import {IProductFull} from "../../../shared/types/IProductFull";

export interface IProductState {
  product: IProductFull;
}

export function reducer(state: IProductState | undefined, action: Action) {
  return productReducer(state, action);
}

export const initialState: IProductState = {
  product: null
};

const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProduct, (state, payload) => (
    { ...state, product:null })),
  on(ProductActions.loadProductSuccess, (state, payload) => (
    { ...state, product: payload.product })),

);
