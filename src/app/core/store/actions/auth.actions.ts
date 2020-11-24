import { createAction, props } from '@ngrx/store';
import {IProduct} from "../../../shared/types/IProduct";
import {ILoginSuccessPayload, IUserProfile} from "../../../shared/types/auth.types";
import {IRegisterUserPayload} from "../types/auth.types";

export const setIsAuth = createAction('[Auth] Set isAuth',
  props<{isAuth: boolean}>());

export const loginUser = createAction('[Auth] Login user',
  props<{username: string, password: string}>());

export const loginUserSuccess = createAction('[Auth] Login user success',
  props<ILoginSuccessPayload>());

export const loginUserError = createAction('[Auth] Login user error',
  props<{error: string}>());

export const registerUser = createAction('[Auth] Register user',
  props<IRegisterUserPayload>());

export const registerUserSuccess = createAction('[Auth] Register user success');

export const registerUserError = createAction('[Auth] Register user error',
  props<{error: any}>());

export const loadProfile = createAction('[Auth] Load profile');

export const loadProfileSuccess = createAction('[Auth] Load profile success',
  props<{ userProfile: IUserProfile }>());

export const updateProfile = createAction('[Auth] Update profile',
  props<IUserProfile>());

export const updateProfileSuccess = createAction('[Auth] Update profile success',
  props<{ userProfile: IUserProfile }>());

export const logoutUser = createAction('[Auth] Logout user');

export const logoutUserSuccess = createAction('[Auth] Logout user success');

export const refreshTokenSuccess = createAction('[Auth] Refresh token success',
  props<{ authToken: string, tokenExpiration: number}>());




