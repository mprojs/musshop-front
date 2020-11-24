import {createAction, props} from '@ngrx/store';
import {
  ILoadProductsFilters,
  IProductCategory,
  IProductsPageInfo, ISearchProductResult
} from "../reducers/shop.types";
import {IProduct} from "../../../../shared/types/IProduct";

export const loadProducts = createAction('[Shop] Load Products',
  props<{ filters: ILoadProductsFilters }>());

export const loadProductsSuccess = createAction('[Shop] Load Products Success',
  props<{
    products: Array<IProduct>,
    pageInfo: IProductsPageInfo
  }>());

// export const loadProductsError = createAction('[Shop] Load Products Error');

export const loadProductCategories = createAction('[Shop] Load Product Categories');

export const loadProductCategoriesSuccess = createAction(
  '[Shop] Load Product Categories Success',
  props<{
    categories: Array<IProductCategory>
  }>());







