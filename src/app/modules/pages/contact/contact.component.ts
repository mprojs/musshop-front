import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AppState} from "../../../core/store/reducers/core.reducers";
import {Store} from "@ngrx/store";
import {MixActions, MixSelectors} from "../../../core/store";
import {Observable} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {MessagesService} from "../../../core/services/messages.service";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  public message: any;
  sending: boolean;
  result: string;
  private apiUrl: string;
  private captchaResponse: string;
  private headers: any;
  prod: boolean;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router,
    private messagesService: MessagesService
  ) {
    this.apiUrl = environment.apiUrl;
    this.prod = environment.production;
    this.headers = new HttpHeaders()
    // this.headers.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    this.headers.append('Cotent-Type', 'application/json');
  }

  ngOnInit(): void {
    console.log('CONTACT INIT!!!!!');
    this.messagesService.getNavigationEndEvent()
      .pipe(filter((e: NavigationEnd) => e.urlAfterRedirects === '/pages/contact'))
      .subscribe(() => {
        // page restored from cache
        this.message = '';
        this.result = null;
      })
  }

  public onSendClick() {
    let body = {
      'g-recaptcha-response': this.captchaResponse,
      'message': this.message
    }
    this.store.dispatch(MixActions.setProgressOn());
    this.sending = true;
    this.http.post(this.apiUrl + '/send-message.php', body)
      .subscribe(data => {
        this.store.dispatch(MixActions.setProgressOff());
        this.sending = false;
        this.result = 'Message sent successfully.';
        this.message = '';
      }, err => {
        this.store.dispatch(MixActions.setProgressOff());
        this.sending = false;
        this.result = 'Cannot send message, please try again later.';
        console.log(err);
      })
  }

  public captchaResolved($event: string) {
    console.log($event);
    this.captchaResponse = $event;
  }

  public ngOnDestroy(): void {
    console.log('CONTACT DESTROY!!!!!');
  }
}
