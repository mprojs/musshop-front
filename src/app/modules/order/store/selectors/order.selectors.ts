import {createSelector} from "@ngrx/store";
import {AppStateWithOrder, IOrderState} from "../reducers/order.reducer";

export const selectOrderState = (state: AppStateWithOrder) => state.order;

export const selectOrders = createSelector(selectOrderState, (state: IOrderState) => state.orders);

export const selectCreatedOrder = createSelector(selectOrderState,
  (state: IOrderState) => state.createdOrder);
