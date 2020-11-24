import {AppState} from "../reducers/core.reducers";
import {createSelector} from "@ngrx/store";
import {IWishState} from "../reducers/wish.reducer";

const selectWishState = (state: AppState) => state.wish;

export const selectProducts = createSelector(selectWishState,
  (state: IWishState) => state.products);

export const selectIds = createSelector(selectWishState,
  (state: IWishState) => state.ids);


