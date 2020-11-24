import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../reducers/core.reducers";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AuthActions, MixActions, WishActions} from "../index";
import {catchError, map, switchMap} from "rxjs/operators";
import {AuthService} from "../../../modules/auth/auth.service";
import {ILoginSuccessPayload, IUserProfile} from "../../../shared/types/auth.types";
import {of} from "rxjs";
import {IRegisterUserPayload} from "../types/auth.types";

@Injectable()
export class AuthEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private authService: AuthService
  ) {
  }

  $loginUser = createEffect(() => (
    this.actions$.pipe(
      ofType(AuthActions.loginUser),
      switchMap((action: any) => {
        this.store.dispatch(MixActions.setProgressOn());
        // console.log(action);
        return this.authService.loginUser(action).pipe(
          map((tokens: ILoginSuccessPayload) => {
            this.store.dispatch(MixActions.setProgressOff());
            return AuthActions.loginUserSuccess(tokens);
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            if (error.message && error.message.toString().toLowerCase().startsWith('graphql error')) {
              return of(AuthActions.loginUserError({error: 'Invalid username or password'}))
            } else {
              return of(AuthActions.loginUserError({error: 'Authentication error, try again leter'}))
            }
          })
        )
      })
    )
  ));

  $logoutUser = createEffect(() => (
    this.actions$.pipe(
      ofType(AuthActions.logoutUser),
      switchMap(() => {
        this.authService.logoutUser();
        return of(AuthActions.logoutUserSuccess())
      })
    )
  ));

  $registerUser = createEffect(() => (
    this.actions$.pipe(
      ofType(AuthActions.registerUser),
      switchMap((action: IRegisterUserPayload) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.authService.registerUser(action).pipe(
          map((user: any) => {
            this.store.dispatch(MixActions.setProgressOff());
            this.store.dispatch(AuthActions.loginUser(action));
            return AuthActions.registerUserSuccess();
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(AuthActions.registerUserError({error}))
          })
        )
      })
    )
  ));

  $loadProfile = createEffect(() => (
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      switchMap((action: any) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.authService.loadProfile().pipe(
          map((profile: IUserProfile) => {
            this.store.dispatch(MixActions.setProgressOff());
            return AuthActions.loadProfileSuccess({userProfile: profile})
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError(error))
          })
        );
      })
    )
  ));

  $loadProfileSuccess = createEffect(() => (
    this.actions$.pipe(
      ofType(AuthActions.loadProfileSuccess),
      map((action: any) => {
        return WishActions.loadWishlist();
      })
    )
  ));

  $updateProfile = createEffect(() => (
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      switchMap((action: any) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.authService.updateProfile(action).pipe(
          map((profile: IUserProfile) => {
            this.store.dispatch(MixActions.setProgressOff());
            return AuthActions.updateProfileSuccess({userProfile: profile})
          }),
          catchError(error => {
            this.store.dispatch(MixActions.setProgressOff());
            return of(MixActions.apiError(error))
          })
        );
      })
    )
  ));
}
