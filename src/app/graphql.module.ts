import {NgModule} from '@angular/core';
import {makeStateKey, TransferState} from "@angular/platform-browser";
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from "apollo-link";
import {setContext} from "apollo-link-context";
import {onError} from 'apollo-link-error';
import gql from "graphql-tag";
import {Subject} from "rxjs";
import {environment} from "../environments/environment";
import {AuthService} from "./modules/auth/auth.service";

const STATE_KEY = makeStateKey<any>('apollo.state');

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    AuthService
  ],
})
export class GraphQLModule {
  cache: InMemoryCache;
  url: string;
  lastUpdateTokenMutationTime: number;
  pendingUpdateToken: any;

  constructor(
    private readonly apollo: Apollo,
    private readonly httpLink: HttpLink,
    private readonly transferState: TransferState,
    private authService: AuthService
  ) {
    this.url = environment.apiUrl + '/graphql';
    this.cache = new InMemoryCache();
    const http = httpLink.create({
      uri: this.url
    });
    const basicLink = setContext((operation, context) => ({
      headers: {
        Accept: 'charset=utf-8',
      }
    }));

    const errorLink = onError(({graphQLErrors, networkError, response, operation}) => {
      console.log(response);
      console.log(operation);
      if (graphQLErrors)
        graphQLErrors.map((err) => {
          const {message, locations, path} = err;
          console.log(
            `[GraphQL error]: Location:`, locations, `Path:`, path, `Message:`, message
          );
          if (message.toString() === 'Internal server error' && path.toString() === 'refreshJwtAuthToken') {
            console.log('SAVED TOKEN WRONG!!');
            err.message = 'invalid token';
            // wrong saved tokens
            this.authService.sendLogoutEvent();
          }
          if (message.toString() === 'Internal server error' && err['debugMessage']?.toString().startsWith('invalid-secret-key')) {
            console.log('INVALID TOKEN!!');
            err.message = 'invalid token';
            // wrong saved tokens
            this.authService.sendLogoutEvent();
          }
        });

      if (networkError) {
        console.log(`[Network error]`, networkError);
      }
    });

    const authLink = setContext(async (_, {headers}) => {
      const token = await this.getToken();
      let newHeaders = {
        ...headers,
        Accept: 'charset=utf-8',
      }
      if (token) {
        newHeaders['Authorization'] = `Bearer ${(token)}`;
      }
      return {
        headers: newHeaders
      };
    });

    this.apollo.create({
      link: ApolloLink.from([errorLink, basicLink, http]),
      cache: new InMemoryCache()
    }, 'basic');

    this.apollo.create({
      cache: this.cache,
      link: authLink.concat(errorLink.concat(http)),
      ssrForceFetchDelay: 200,
      connectToDevTools: true
    });

    const isBrowser = this.transferState.hasKey<any>(STATE_KEY);

    if (isBrowser) {
      this.onBrowser();
    } else {
      this.onServer();
    }
  }

  onServer() {
    this.transferState.onSerialize(STATE_KEY, () => {
      return this.cache.extract();
    });
  }

  onBrowser() {
    const state = this.transferState.get<any>(STATE_KEY, null);
    this.cache.restore(state);
  }

  getToken() {
    return new Promise((resolve, reject) => {
      const {authToken, tokenExpiration, refreshToken} = this.authService.getTokenData();
      if (!authToken || !tokenExpiration) {
        resolve(null);
        return;
      }
      let now = ((new Date()).getTime());
      if (now < +tokenExpiration) {
        console.log('TNE+++ NOW:', now, 'TOKEN:', +tokenExpiration, 'T-N:', +tokenExpiration - now);
        resolve(authToken);
      } else {
        console.log('+++++++++Token Expired. Time:', new Date(+tokenExpiration));
        // const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('No refresh token found.');
          resolve(null);
          return;
        }
        if (this.pendingUpdateToken) {
          console.log('Pending update token mutations found');
          this.pendingUpdateToken.asObservable().subscribe(token => {
            resolve(token);
          }, err => {
            resolve(null);
          })
          return;
        }
        this.lastUpdateTokenMutationTime = now;
        const mutation = gql`
          mutation RefreshAuthToken {
            refreshJwtAuthToken(
              input: {
                clientMutationId: "refreshJwtAuthTokenMutationId"
                jwtRefreshToken: "${refreshToken}",
            }) {
              authToken
            }
          }        
        `;
        console.log('Refresh token mutation...');
        this.pendingUpdateToken = new Subject();
        this.apollo.use('basic').mutate({mutation}).subscribe((data: any) => {
          // console.log((data));
          let refreshedAuthToken = data.data.refreshJwtAuthToken.authToken;
          if (refreshedAuthToken) {
            // console.log('Refresh token');
            this.authService.sendRefreshedToken(refreshedAuthToken);
            this.pendingUpdateToken.next(refreshedAuthToken);
            this.clearPendingTokenMutation();
            resolve(refreshedAuthToken);
          } else {
            console.error('Cannot refresh token', data);
            this.pendingUpdateToken.next(null);
            this.clearPendingTokenMutation();
            resolve(null);
          }
        }, err => {
          console.error('Cannot refresh token', err);
          this.pendingUpdateToken.next(null);
          this.clearPendingTokenMutation();
          resolve(null);
        })
      }
    });
  }

  clearPendingTokenMutation() {
    setTimeout(() => {
      this.pendingUpdateToken = null;
    }, 3000);
  }
}
