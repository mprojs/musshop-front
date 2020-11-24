import { createAction, props } from '@ngrx/store';
import {IProduct} from "../../../shared/types/IProduct";
import {IWishProducts} from "../types/IWishProducts";

export const addToWishlist = createAction('[Wish] Add to wishlist',
  props<{product: IProduct}>());

export const addToWishlistSuccess = createAction('[Wish] Add to wishlist success');

export const removeFromWishlist = createAction('[Wish] Remove from wishlist',
  props<{product: IProduct}>());

export const removeFromWishlistSuccess = createAction('[Wish] Remove from wishlist success');

export const loadWishlist = createAction('[Wish] Load wishlist');

export const loadWishlistSuccess = createAction('[Wish] Load wishlist success',
  props<{ products: IWishProducts }>());

export const loadProduct = createAction('[Wish] Load product');

export const loadProductSuccess = createAction('[Wish] Load product success',
  props<{ productIds: number[] }>());



