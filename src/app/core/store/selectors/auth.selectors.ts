import {AppState} from "../reducers/core.reducers";
import {createSelector} from "@ngrx/store";
import {IAuthState} from "../reducers/auth.reducer";

const selectAuthState = (state: AppState) => state.auth;

export const selectIsAuth = createSelector(selectAuthState,
  (state: IAuthState) => state.isAuth);

export const selectUsername = createSelector(selectAuthState,
  (state: IAuthState) => state.username);

export const selectUserId = createSelector(selectAuthState,
  (state: IAuthState) => state.userId);

export const selectLoginError = createSelector(selectAuthState,
  (state: IAuthState) => state.loginError);

export const selectRegisterError = createSelector(selectAuthState,
  (state: IAuthState) => state.registerError);

export const selectUserProfile = createSelector(selectAuthState,
  (state: IAuthState) => state.userProfile);

export const selectTokenData = createSelector(selectAuthState,
  (state: IAuthState) => (
    {
      customerId: state.customerId,
      userId: state.userId,
      authToken: state.authToken,
      refreshToken: state.refreshToken,
      tokenExpiration: state.tokenExpiration
    }
  ));

