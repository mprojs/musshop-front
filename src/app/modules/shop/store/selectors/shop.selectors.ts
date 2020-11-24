import {createSelector} from "@ngrx/store";
import {AppStateWithShop, IShopState} from "../reducers/shop.reducer";

export const selectShopState = (state: AppStateWithShop) => state.shop;

export const selectProducts = createSelector(selectShopState,
  (state: IShopState) => state.products);

export const selectProductsPageInfo = createSelector(selectShopState,
  (state: IShopState) => state.productsPageInfo);

export const selectProductCategories = createSelector(selectShopState,
  (state: IShopState) => state.categories);

export const selectLoadProductsFilters = createSelector(selectShopState,
  (state: IShopState) => state.loadProductsFilters);


