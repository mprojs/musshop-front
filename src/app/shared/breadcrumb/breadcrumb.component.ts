import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MessagesService} from "../../core/services/messages.service";
import {IBreadcrumb} from "../types/breadcrumb";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  private subs = [];
  public breadcrumbs: IBreadcrumb[] = [];
  static readonly ROUTE_DATA_BREADCRUMB = 'bc';
  // windowWidth: number;
  showSearch = true;
  showCollapseSearch = false;
  showBreadcrumps = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    // private store: Store<AppStateWithShop>,
    // private router: Router,
    private messagesService: MessagesService
  ) {
  }


  ngOnInit(): void {
    this.subs.push(
      this.messagesService.getWindowWidthStream().subscribe(width => {
        this.showSearch = width > 700;
      })
    );
    this.subs.push(
      this.messagesService.getBreadcrumbsStream().subscribe(bc => {
        this.breadcrumbs = bc || [];
      })
    )
  }

  private buildBreadcrumbs(route) {
    let bcList = this.parseBreadcrumbs(route);
    if (!bcList) {
      return [];
    }
    // console.log(bcList);
    let uniqBcList = new Map();
    bcList.forEach(item => {
      uniqBcList.set(item.url, item.label);
    });
    // console.log(uniqBcList);
    return Array.from(uniqBcList, ([url, label]) => ({url, label}));
  }

  private parseBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs = []) {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data[BreadcrumbComponent.ROUTE_DATA_BREADCRUMB];
      // console.log('LABEL', label);
      if (label != null) {
        breadcrumbs.push({label, url});
      } else if (label === null) {
        return null;
      }

      return this.parseBreadcrumbs(child, url, breadcrumbs);
    }
  }

  public ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  showSearchClick() {
    this.showSearch = true;
    this.showCollapseSearch = true;
    this.showBreadcrumps = false;
  }

  collapseSearchClick() {
    this.showCollapseSearch = false;
    this.showSearch = false;
    this.showBreadcrumps = true;
  }
}
