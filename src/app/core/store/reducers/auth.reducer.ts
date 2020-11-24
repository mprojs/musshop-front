import {Action, createReducer, on} from "@ngrx/store";
import * as AuthActions from "../actions/auth.actions";
import {IUserProfile} from "../../../shared/types/auth.types";

export interface IAuthState {
  isAuth: boolean;
  customerId: number
  userId: string;
  username: string;
  authToken: string;
  refreshToken: string;
  tokenExpiration: number;
  userProfile: IUserProfile;
  loginError: string;
  registerError: string;
}

export function reducer(state: IAuthState | undefined, action: Action) {
  return authReducer(state, action);
}

export const initialState: IAuthState = {
  isAuth: false,
  customerId: null,
  userId: null,
  username: null,
  authToken: null,
  refreshToken: null,
  tokenExpiration: null,
  userProfile: null,
  loginError: null,
  registerError: null,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.setIsAuth, (state, payload) => (
    {...state, isAuth: payload.isAuth})),
  on(AuthActions.loginUserSuccess, (state, payload) => (
    {
      ...state,
      isAuth: true,
      customerId: payload.user.customerId,
      userId: payload.user.userId,
      username: payload.user.username,
      authToken: payload.authToken,
      refreshToken: payload.refreshToken,
      tokenExpiration: payload.tokenExpiration,
      loginError: null,
    }
  )),
  on(AuthActions.loginUserError, (state, payload) => (
    {
      ...state,
      loginError: payload.error
    }
  )),
  on(AuthActions.registerUserError, (state, payload) => (
    {
      ...state,
      registerError: payload.error
    }
  )),
  on(AuthActions.loadProfileSuccess, (state, payload) => (
    {...state, userProfile: payload.userProfile}
  )),
  on(AuthActions.updateProfile, (state, payload) => {
    console.log(payload);
    return state;
  }),
  on(AuthActions.updateProfileSuccess, (state, payload) => (
    {...state, userProfile: payload.userProfile}
  )),
  on(AuthActions.logoutUserSuccess, (state) => (
    {
      ...state,
      isAuth: false,
      authToken: null,
      refreshToken: null,
      tokenExpiration: null,
      loginError: null,
      username: null,
      userProfile: null,
      userId: null,
      customerId: null,
    }
  )),
  on(AuthActions.refreshTokenSuccess, (state, payload) => (
    {
      ...state,
      authToken: payload.authToken,
      tokenExpiration: payload.tokenExpiration,
    }
  ))
);
