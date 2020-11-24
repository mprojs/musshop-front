import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy, RouterModule} from "@angular/router";
import {ServiceWorkerModule} from '@angular/service-worker';
import {EffectsModule} from "@ngrx/effects";
import {Store, StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {CookieModule} from 'ngx-cookie';
import {ToastrModule} from "ngx-toastr";
import {environment} from '../environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";
import {LoggerService} from "./core/services/logger.service";
import {MixSelectors} from "./core/store";
import {AuthEffects} from "./core/store/effects/auth.effects";
import {CartEffects} from "./core/store/effects/cart.effects";
import {InitEffects} from "./core/store/effects/init.effects";
import {ProductEffects} from "./core/store/effects/product.effects";
import {WishEffects} from "./core/store/effects/wish.effects";
import {AppState, metaReducers, reducers} from "./core/store/reducers/core.reducers";
import {GlobalErrorHandler} from "./core/utils/globalErrorHandler";
import {GraphQLModule} from './graphql.module';
import {MaterialAllModule} from "./material-all.module";
import {CustomReuseStrategy} from "./shared/route/custom-reuse-strategy";
import {SharedModule} from "./shared/shared.module";

const initApp = (store: Store<AppState>, gq, loggerService: LoggerService) => {
  return () => {
    return new Promise((resolve, reject) => {
      loggerService.init();
      store.select(MixSelectors.selectStoreInitialized).subscribe((init) => {
        if (init) {
          resolve();
        }
      });
    });
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserTransferStateModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    CookieModule.forRoot(),

    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    // StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    EffectsModule.forRoot([
      InitEffects,
      ProductEffects,
      AuthEffects,
      CartEffects,
      WishEffects,
    ]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    GraphQLModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    MaterialAllModule,
    FormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [Store, GraphQLModule, LoggerService]
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: APIInterceptor,
    //   multi: true,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ApiAuthInterceptor,
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
