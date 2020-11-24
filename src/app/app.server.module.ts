import {APP_INITIALIZER, NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {CookieBackendModule} from "ngx-cookie-backend";
import {LoggerService} from "./core/services/logger.service";


@NgModule({
  imports: [
    AppModule,
    ServerTransferStateModule,
    ServerModule,
    CookieBackendModule.forRoot()
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
  constructor(
    // private loggerService: LoggerService
  ) {
    // this.initLogger();
  }

  // initLogger() {
  //   console.log = this.loggerService.log;
  //   console.error = this.loggerService.error;
  // }

  // logger() {
  //   let debugMode = true;
  //   if (!debugMode) {
  //     return;
  //   }
  //   ['log', 'warn', 'error'].forEach((methodName) => {
  //     const originalMethod = console[methodName];
  //     console[methodName] = (...args) => {
  //       let initiator = 'unknown place';
  //       try {
  //         throw new Error();
  //       } catch (e) {
  //         if (typeof e.stack === 'string') {
  //           let isFirst = true;
  //           for (const line of e.stack.split('\n')) {
  //             const matches = line.match(/^\s+at\s+(.*)/);
  //             // console.log(matches);
  //             if (matches) {
  //               if (!isFirst) { // first line - current function
  //                 // second line - caller (what we are looking for)
  //                 initiator = matches[1];
  //                 break;
  //               }
  //               isFirst = false;
  //             }
  //           }
  //         }
  //       }
  //       originalMethod.apply(console, [...args]);
  //       originalMethod.apply(console, ["\x1b[33m", `    at ${initiator}`, "\x1b[0m"]);
  //     };
  //   });
  // };
}
