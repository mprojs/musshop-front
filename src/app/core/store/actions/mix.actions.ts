import { createAction, props } from '@ngrx/store';
import {ISearchProductResult} from "../../../modules/shop/store/reducers/shop.types";

export const setStoreInitialized = createAction('[Mix] Set store initialized');

export const setIsMobile = createAction('[Mix] Set IsMobile',
  props<{isMobile: boolean}>());

export const setProgressOn = createAction('[Mix] Set Progress ON');
export const setProgressOff = createAction('[Mix] Set Progress OFF');

export const setCartProcessingOn = createAction('[Mix] Set Cart Processing ON');
export const setCartProcessingOff = createAction('[Mix] Set Cart Processing OFF');

export const apiError = createAction('[Mix] Api Error',
  props<{error: any, message: string, addlMessage?: string}>());

export const searchProducts = createAction('[Mix] Search products',
  props<{
    searchQuery: string
  }>());
export const searchProductsSuccess = createAction('[Mix] Search Products Success',
  props<{
    searchResults: Array<ISearchProductResult>
  }>());
export const cleanSearchResult = createAction('[Mix] Clean Search Products Result');
