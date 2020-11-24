import {Action, ActionReducer, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from "../../../../environments/environment";
import {fromAuth, fromCart, fromMix, fromProduct, fromWish} from "../index";


export interface AppState {
  mix: fromMix.IMixState,
  product: fromProduct.IProductState,
  cart: fromCart.ICartState,
  auth: fromAuth.IAuthState,
  wish: fromWish.IWishState,
}

export const reducers: ActionReducerMap<AppState> = {
  mix: fromMix.reducer,
  product: fromProduct.reducer,
  cart: fromCart.reducer,
  auth: fromAuth.reducer,
  wish: fromWish.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : [];

export function logger(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState, Action> {
  return function (state: AppState, action: Action): AppState {
    console.log(`NGRX Action`, `${action.type}`, action, state);
    return reducer(state, action);
  };
}
