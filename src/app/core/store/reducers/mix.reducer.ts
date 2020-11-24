import {Action, createReducer, on} from "@ngrx/store";
import * as MixActions from '../actions/mix.actions';
import {ISearchProductResult} from "../../../modules/shop/store/reducers/shop.types";
import * as ShopActions from "../../../modules/shop/store/actions/shop.actions";

export interface IMixState {
  storeInitialized: boolean;
  isMobile: boolean;
  progressEnabled: boolean;
  apiError: {
    error: any,
    message: string,
    addlMessage: string,
  };
  cartProcessing: boolean;
  searchResult: Array<ISearchProductResult>;
}

export function reducer(state: IMixState | undefined, action: Action) {
  return shopReducer(state, action);
}

export const initialState: IMixState = {
  storeInitialized: false,
  isMobile: false,
  progressEnabled: false,
  apiError: null,
  cartProcessing: false,
  searchResult: [],
};

const shopReducer = createReducer(
  initialState,
  on(MixActions.setStoreInitialized, (state, payload) => (
    {...state, storeInitialized: true})),
  on(MixActions.setIsMobile, (state, payload) => (
    {...state, isMobile: payload.isMobile})),
  on(MixActions.setProgressOn, (state) => (
    {...state, progressEnabled: true})),
  on(MixActions.setProgressOff, (state) => (
    {...state, progressEnabled: false})),
  on(MixActions.apiError, (state, payload) => (
    {
      ...state,
      apiError: {
        error: payload.error,
        message: payload.message,
        addlMessage: payload.addlMessage
      }
    }
  )),
  on(MixActions.setCartProcessingOn, (state) => ({...state, cartProcessing: true})),
  on(MixActions.setCartProcessingOff, (state) => ({...state, cartProcessing: false})),
  on(MixActions.searchProductsSuccess, (state, payload) => {
    console.log(payload);
    return {
      ...state,
      searchResult: payload.searchResults
    }
  }),
  on(MixActions.cleanSearchResult, (state) => ({
    ...state,
    searchResult: []
  }))
);
