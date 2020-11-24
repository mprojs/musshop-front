import { createAction, props } from '@ngrx/store';
import {IProduct} from "../../../shared/types/IProduct";
import {IAddToCartPayload, ICart, ICartItem} from "../types/cart.types";

export const addToCart = createAction('[Cart] Add to cart',
  props<IAddToCartPayload>());

export const addToCartSuccess = createAction('[Cart] Add to cart success',
  props<ICart>());

export const outOfStockError = createAction('[Cart] Out of stock error',
  props<{ products: Array<IProduct> }>());

export const outOfStockErrorClear = createAction('[Cart] Out of stock error clear');

export const deleteItem = createAction('[Cart] Delete item',
  props<{item: ICartItem}>());

export const deleteItemSuccess = createAction('[Cart] Delete item success',
  props<ICart>());

export const loadCart = createAction('[Cart] Load cart');

export const loadCartSuccess = createAction('[Cart] Load cart success',
  props<ICart>());

export const changeCart = createAction('[Cart] Change cart');

export const changeCartSuccess = createAction('[Cart] Change cart success',
  props<ICart>());



