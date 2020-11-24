import { createAction, props } from '@ngrx/store';
import {IProductFull} from "../../../shared/types/IProductFull";

export const loadProduct = createAction('[Product] Load Product',
  props<{id: number}>());

export const loadProductSuccess = createAction('[Product] Load Product Success',
  props<{product: IProductFull}>());


