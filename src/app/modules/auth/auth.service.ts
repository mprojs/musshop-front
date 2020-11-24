import {isPlatformServer} from "@angular/common";
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {map, tap} from "rxjs/operators";
import {ILoginSuccessPayload, IUserProfile} from "../../shared/types/auth.types";
import {Store} from "@ngrx/store";
import {AppState} from "../../core/store/reducers/core.reducers";
import {AuthActions, AuthSelectors, MixSelectors} from "../../core/store";
import {IRegisterUserPayload} from "../../core/store/types/auth.types";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {CookieService} from "ngx-cookie";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private tokenTTL = 300 - 120;
  private tokenData = {
    customerId: null,
    userId: null,
    authToken: null,
    refreshToken: null,
    tokenExpiration: null,
  };

  storage = {
    getItem: (key) => this.cookieService.get(key),
    setItem: (key, val) => this.cookieService.put(key, val),
    removeItem: (key) => this.cookieService.remove(key),
  }

  constructor(
    private apollo: Apollo,
    private store: Store<AppState>,
    private router: Router,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.store.select(MixSelectors.selectStoreInitialized).subscribe((init) => {
      if (init) {
        this.autoLogin();
      }
    });
    this.store.select(AuthSelectors.selectTokenData).subscribe(data => this.tokenData = data);
    this.store.select(AuthSelectors.selectIsAuth).subscribe(isAuth => {
      if (isAuth) {
        this.store.dispatch(AuthActions.loadProfile());
      }
    });
  }

  getTokenData() {
    return this.tokenData;
  }

  sendRefreshedToken(token) {
    let tokenExpiration = ((new Date()).getTime() + ((this.tokenTTL) * 1000));
    this.store.dispatch(AuthActions.refreshTokenSuccess({
      authToken: token,
      tokenExpiration: tokenExpiration
    }));
    this.storage.setItem('tokenExpiration', tokenExpiration.toString());
    this.storage.setItem('authToken', token);
    console.log('Refresh token, new Expiration time: ', tokenExpiration);
  }

  sendLogoutEvent() {
    this.store.dispatch(AuthActions.logoutUser());
  }

  logoutUser() {
    this.storage.removeItem('user');
    this.storage.removeItem('authToken')
    this.storage.removeItem('refreshToken')
    this.storage.removeItem('tokenExpiration');
    this.router.navigate(['/shop']);
  }

  loginUser(payload: any) {
    // console.log(payload);
    const mutation = gql`
      mutation LoginUser {
        login( input: {
          clientMutationId: "loginUserMutationID",
          username: "${payload.username}",
          password: "${payload.password}"
        } ) {
          authToken
          refreshToken
          user {
            username
          }
          customer {
            id
            customerId
          }
        }
      }    
    `;
    return this.apollo.use('basic').mutate({mutation}).pipe(
      // return this.apollo.mutate({mutation}).pipe(
      map((data: any) => {
        // console.log(data);
        let tokenExpiration = ((new Date()).getTime() + (this.tokenTTL * 1000));
        const login = data.data.login;
        return {
          ...login,
          tokenExpiration,
          user: {
            username: login.user.username,
            userId: login.customer?.id,
            customerId: login.customer?.customerId
          }
        };
      }),
      tap((tokens: ILoginSuccessPayload) => {
        // console.log(tokens);
        this.storage.setItem('user', JSON.stringify(tokens.user));
        this.storage.setItem('authToken', (tokens.authToken));
        this.storage.setItem('refreshToken', (tokens.refreshToken));
        this.storage.setItem('tokenExpiration', (tokens.tokenExpiration.toString()));
      })
    )
  }

  registerUser(payload: IRegisterUserPayload) {
    const mutation = gql`
      mutation RegisterUser {
        registerUser(input: {
          clientMutationId:"registerUserClientMutationId"
          username:"${payload.username}",
          password:"${payload.password}"
          email: "${payload.email}"
        }) {
          user {
            name
          }
        }
      }    
    `;
    return this.apollo.use('basic').mutate({mutation});
    // return this.apollo.mutate({mutation});
  }

  loadProfile() {
    const query = gql`
      query GetCustomer {
        customer(customerId:${this.tokenData?.customerId}) {
          username
          email
          firstName
          lastName
          metaData {
            key
            value
          }
        }
      }
    `;
    return this.apollo.watchQuery({query}).valueChanges.pipe(
      map((data: any) => {
        // console.log(data);
        return data?.data?.customer;
      })
    )
  }

  updateProfile(profile: IUserProfile): Observable<IUserProfile> {
    // return new Observable(subscriber => {
    //   this.store.select(AuthSelectors.selectUserId).pipe(
    //     take(1)).subscribe(id => {
    //     this.http.put('customers/' + id, profile).pipe(
    //       map(data => {
    //         console.log(data);
    //         return data as IUserProfile;
    //       })
    //     ).subscribe(profile => {
    //       subscriber.next(profile);
    //       subscriber.complete();
    //     }, error => subscriber.error(error))
    //   });
    // })
    console.log(profile);
    const mutation = gql`
mutation {
 updateCustomer(input:{
    clientMutationId:"asdfuiuooo"
    firstName:"${profile.firstName}"
    lastName:"${profile.lastName}"
    id:"${this.tokenData.userId}"
  }) {
    clientMutationId
    customer {
      lastName
      firstName
      username
      email
    }
  }
}    
    `;
    return this.apollo.mutate({mutation}).pipe(
      map((data: any) => {
        console.log(data);
        return data.data.updateCustomer.customer as IUserProfile;
      })
    )
  }

  autoLogin() {
    let userStr = this.storage.getItem('user');
    let authTokenStr = this.storage.getItem('authToken');
    let refreshTokenStr = this.storage.getItem('refreshToken');
    let tokenExpiration = this.storage.getItem('tokenExpiration');

    console.log(`AutoLogin on ${isPlatformServer(this.platformId) ? 'server' : 'client'}`,userStr, authTokenStr);
    if (authTokenStr && refreshTokenStr && tokenExpiration && userStr) {
      let user;
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.log('Cannot parse JSON in', userStr);
      }
      if (!user) {
        return;
      }
      this.store.dispatch(AuthActions.loginUserSuccess({
        user,
        authToken: (authTokenStr),
        refreshToken: (refreshTokenStr),
        tokenExpiration: +tokenExpiration,
      }));
    }
  }
}
