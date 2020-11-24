import {Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {LoggerService} from "./core/services/logger.service";
import {AppState} from "./core/store/reducers/core.reducers";
import {Store} from "@ngrx/store";
import {setIsMobile} from "./core/store/actions/mix.actions";
import {Subject} from "rxjs";
import {debounceTime, delay, filter} from "rxjs/operators";
import {MixSelectors} from "./core/store";
import {isPlatformBrowser} from "@angular/common";
import {convertApiError} from "./core/utils/convert-messages-utils";
import {NavigationEnd, Router} from "@angular/router";
import {MessagesService} from "./core/services/messages.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'musshop-front';
  resizeWindowSubject = new Subject<any>();
  loading$: any;
  apiError: any;
  subs = [];
  prevNavigationUrl: string;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    @Inject(PLATFORM_ID) private platformId: Object,
    private messagesService: MessagesService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.subs.push(
        this.resizeWindowSubject.pipe(
          debounceTime(300)
        ).subscribe(() => {
          this.messagesService.updateWindowWidth(window.innerWidth);
          this.store.dispatch(setIsMobile({isMobile: window.innerWidth < 576}));
        })
      );

      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          if (!(event.urlAfterRedirects.startsWith('/shop') && this.prevNavigationUrl && this.prevNavigationUrl.startsWith('/shop'))) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
          this.prevNavigationUrl = event.urlAfterRedirects;
          this.messagesService.sendNavigationEndEvent(event);
        });
    }
    this.resizeWindowSubject.next();
    this.loading$ = this.store.select(MixSelectors.selectProgressEnabled).pipe(delay(0));
    this.subs.push(
      this.store.select(MixSelectors.selectApiError).subscribe(error => {
        if (!this.apiError) {
          this.apiError = convertApiError(error);
        }
      })
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeWindowSubject.next();
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
