import {isPlatformServer} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  loggerUrl: string;
  private sessionId: string;
  private origConsoleLog;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    this.loggerUrl = environment.loggerUrl;
    this.origConsoleLog = console.log;
  }

  init() {
    if (isPlatformServer(this.platformId)) {
      console.log = this.log.bind(this);
      console.error = this.error.bind(this);
    }
  }

  log(...args) {
    // console.dir(this);
    let {message, meta} = this.convertArgs(...args);
    this.sendMessage(message, meta);
    // this.origConsoleLog(...args)
  }

  error(...args) {
    let {message, meta} = this.convertArgs(args);
    this.sendMessage(message, meta, 'error');
  }

  convertArgs(...args) {
    let message, meta;
    if (args.length < 1) {
      return;
    }
    if (typeof args[0] === 'string') {
      message = args[0];
      meta = (args.length > 1) ? args.slice(1) : null;
    } else {
      message = null;
      meta = args;
    }
    return {message, meta};
  }

  sendMessage(message, meta, level = null) {
    this.http.post(this.loggerUrl + '/log', {
      sessionId: this.sessionId || null,
      level,
      message,
      meta: meta, //JSON.stringify(meta)
    }).subscribe((data: any) => {
      if (!this.sessionId && data.sessionId) {
        this.sessionId = data.sessionId;
      }
    }, err => {
      if (!environment.production) {
        console.info(err);
      }
    });
  }
}
