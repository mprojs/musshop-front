import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Observable, Subject} from "rxjs";
import {cloneObject, isObjectsEqual} from "../../../core/utils/objects-utils";
import {applyFilterToQueryParams} from "../../../core/utils/router-utils";
import {IBreadcrumb} from "../../../shared/types/breadcrumb";
import {IProductCategory, ISearchProductResult} from "../store/reducers/shop.types";
import {Store} from "@ngrx/store";
import {ShopActions, ShopSelectors} from "../store";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {MixSelectors} from "../../../core/store";
import {MessagesService} from "../../../core/services/messages.service";
import {AppStateWithShop} from "../store/reducers/shop.reducer";


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  categories$: Observable<(Array<IProductCategory>)>;
  isMobile$: Observable<any>;
  showMobileFilters: any;
  prevQueryParams: any;
  itemsPerPage = 12;

  constructor(
    private store: Store<AppStateWithShop>,
    private router: Router,
    private route: ActivatedRoute,
    private messagesService: MessagesService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      if (!params.count) {
        applyFilterToQueryParams(this.router, {count: this.itemsPerPage});
        return;
      }
      // if (Object.keys(params).length < 1) {
      //   console.log('Skip empty params');
      //   return;
      // }
      if (this.prevQueryParams && isObjectsEqual(this.prevQueryParams, params)) {
        console.log('Params not changed, skip loadProducts');
      } else {
        this.prevQueryParams = params;
        console.log(`With this query params dispatch LoadProducts`, params);
        this.store.dispatch(ShopActions.loadProducts({filters: params}));

        let breadcrumbs: IBreadcrumb[] = [{label: 'Products', url: '/shop'}];
        this.messagesService.updateBreadcrumbs(breadcrumbs);
      }
    })

    this.categories$ = this.store.select(ShopSelectors.selectProductCategories);

    this.isMobile$ = this.store.select(MixSelectors.selectIsMobile);
    this.store.dispatch(ShopActions.loadProductCategories());



    this.messagesService.getToggleFiltersEvents().subscribe(() => {
      this.showMobileFilters = !this.showMobileFilters;
      // console.log(this.showMobileFilters);
    });
  }



}
