import {AppState} from "../reducers/core.reducers";
import {createSelector} from "@ngrx/store";
import {ICartState} from "../reducers/cart.reducer";

const selectCartState = (state: AppState) => state.cart;

export const selectCart = createSelector(selectCartState,
  (state: ICartState) => state);

export const selectItems = createSelector(selectCartState,
  (state: ICartState) => state.items);

export const selectOutOfStockErrors = createSelector(selectCartState,
  (state: ICartState) => state.outOfStockErrors);

