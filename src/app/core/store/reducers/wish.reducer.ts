import {Action, createReducer, on} from "@ngrx/store";
import * as WishActions from "../actions/wish.actions";
import {IWishProducts} from "../types/IWishProducts";
import {cloneObject} from "../../utils/objects-utils";

export interface IWishState {
  products: IWishProducts;
  ids: number[];
}

export function reducer(state: IWishState | undefined, action: Action) {
  return cartReducer(state, action);
}

export const initialState: IWishState = {
  products: {},
  ids: []
};

const cartReducer = createReducer(
  initialState,
  on(WishActions.loadWishlistSuccess, (state, payload) => (
    {
      ...state,
      products: payload.products,
      ids: Object.keys(payload.products).map(id => +id)
    }
  )),
  on(WishActions.addToWishlist, (state, payload) => addProduct(state, payload.product)),
  on(WishActions.removeFromWishlist, (state, payload) => removeProduct(state, payload.product)),
);

const addProduct = (state: IWishState, product) => {
  let products = cloneObject(state.products);
  products[product.productId] = product;
  let ids = Object.keys(products).map(id => +id);
  console.log('addToWishlist reducer:', products, ids);
  return {
    ...state,
    products,
    ids
  };
};

const removeProduct = (state: IWishState, product) => {
  let products = cloneObject(state.products);
  delete products[product.productId];
  let ids = Object.keys(products).map(id => +id);
  return {
    ...state,
    products,
    ids
  };
};
