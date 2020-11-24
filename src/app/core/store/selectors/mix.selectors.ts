import {AppState} from "../reducers/core.reducers";
import {createSelector} from "@ngrx/store";
import {IMixState} from "../reducers/mix.reducer";
import {IShopState} from "../../../modules/shop/store/reducers/shop.reducer";
import {selectShopState} from "../../../modules/shop/store/selectors/shop.selectors";

const selectMixState = (state: AppState) => state.mix;

export const selectStoreInitialized = createSelector(selectMixState,
  (state: IMixState) => state.storeInitialized);

export const selectIsMobile = createSelector(selectMixState,
  (state: IMixState) => state.isMobile);

export const selectProgressEnabled = createSelector(selectMixState,
  (state: IMixState) => state.progressEnabled);

export const selectApiError = createSelector(selectMixState,
  (state: IMixState) => state.apiError);

export const selectCartProcessing = createSelector(selectMixState,
  (state: IMixState) => state.cartProcessing);

export const selectSearchProductsResult = createSelector(selectMixState,
  (state: IMixState) => state.searchResult);
