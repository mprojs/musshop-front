import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {Event, NavigationEnd} from "@angular/router";
import {IBreadcrumb} from "../../shared/types/breadcrumb";


@Injectable({
  providedIn: "root"
})
export class MessagesService {
  toggleFilters = new Subject();
  navigationEndEvent = new BehaviorSubject(null);
  breadcrumbs = new BehaviorSubject(null);
  windowWidth = new BehaviorSubject(1200);

  constructor(
  ) { }

  getToggleFiltersEvents() {
    return this.toggleFilters.asObservable();
  }

  sendToggleFiltersEvents() {
    this.toggleFilters.next();
  }

  getNavigationEndEvent(): Observable<Event> {
    return this.navigationEndEvent.asObservable();
  }

  sendNavigationEndEvent(data: Event) {
    this.navigationEndEvent.next(data);
  }

  getBreadcrumbsStream(): Observable<Array<IBreadcrumb>> {
    return this.breadcrumbs.asObservable();
  }

  updateBreadcrumbs(bc: IBreadcrumb[]) {
    this.breadcrumbs.next(bc);
  }

  getWindowWidthStream(): Observable<number> {
    return this.windowWidth.asObservable();
  }

  updateWindowWidth(width: number) {
    this.windowWidth.next(width);
  }
}
