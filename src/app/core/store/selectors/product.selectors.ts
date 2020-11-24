import {AppState} from "../reducers/core.reducers";
import {createSelector} from "@ngrx/store";
import {IProductState} from "../reducers/product.reducer";

const selectMixState = (state: AppState) => state.product;

export const selectProduct = createSelector(selectMixState,
  (state: IProductState) => state.product);

