import {Action, createReducer, on} from "@ngrx/store";
import * as fromRoot from "../../../../core/store/reducers/core.reducers";
import {IProduct} from "../../../../shared/types/IProduct";
import * as ShopActions from "../actions/shop.actions";
import {ILoadProductsFilters, IProductCategory, IProductsPageInfo} from "./shop.types";

export interface AppStateWithShop extends fromRoot.AppState {
  'shop': IShopState
}

export interface IShopState {
  products: Array<IProduct>;
  productsPageInfo: IProductsPageInfo;
  categories: Array<IProductCategory>;
  loadProductsFilters: ILoadProductsFilters;
  loadingError: any;
}

export function reducer(state: IShopState | undefined, action: Action) {
  return shopReducer(state, action);
}

export const initialState: IShopState = {
  products: null,
  loadProductsFilters: {
    categories: [0],
    onlyInStock: false,
    minPrice: null,
    maxPrice: null,
  },
  productsPageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    totalProducts: 0,
    startCursor: '',
    endCursor: ''
  },
  categories: (new Array(4)).fill({id: 1, name: '---'}),
  loadingError: null,
};

const shopReducer = createReducer(
  initialState,
  on(ShopActions.loadProducts, (state, payload) => ({
    ...state,
    loadProductsFilters: combineLoadProductsFilters(state.loadProductsFilters, payload.filters)
  })),
  on(ShopActions.loadProductsSuccess, (state, payload) => ({
    ...state,
    products: payload.products,
    productsPageInfo: payload.pageInfo
  })),
  on(ShopActions.loadProductCategoriesSuccess, (state, payload) => ({
    ...state,
    categories: payload.categories
  })),
);

const combineLoadProductsFilters = (currentFilters: ILoadProductsFilters,
                                    payload: ILoadProductsFilters): ILoadProductsFilters => {
  let newFilters = {...currentFilters, ...payload};
  // after or before exists only when next\prev page clicked,
  // if no one of these props sended, we have to remove them
  // if any of them exist
  if (!payload.after && !payload.before) {
    newFilters.after = null;
    newFilters.before = null;
  }
  newFilters = convertParamsToProductFilters(newFilters);
  return newFilters;
}


export const convertParamsToProductFilters = (filters: ILoadProductsFilters) => {
  if (filters.categories) {
    if (Array.isArray(filters.categories)) {
      filters.categories = filters.categories.map(cat => +cat);
    } else {
      filters.categories = [+filters.categories];
    }
  }
  if (filters.onlyInStock) {
    filters.onlyInStock = filters.onlyInStock.toString() !== "false";
  }
  filters.minPrice = +filters.minPrice || null;
  filters.maxPrice = +filters.maxPrice || null;

  return filters;
}
