import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {fromEvent, Observable} from "rxjs";
import {LoggerService} from "../../../core/services/logger.service";
import {applyFilterToQueryParams} from "../../../core/utils/router-utils";
import {IProductCategory} from "../store/reducers/shop.types";
import {debounceTime, map} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {ShopActions, ShopSelectors} from "../store";
import {MessagesService} from "../../../core/services/messages.service";
import {AppStateWithShop, initialState as shopInitialState} from "../store/reducers/shop.reducer";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, AfterViewInit {
  @Input() categories$: Observable<Array<IProductCategory>>;
  @Input() mobile: boolean;
  @ViewChild('priceFrom') priceFrom: ElementRef;
  @ViewChild('priceTo') priceTo: ElementRef;
  @ViewChild('onlyInStock') onlyInStockElRef: ElementRef;

  activeCategoryId$: Observable<number>;
  onlyInStockState$: Observable<boolean>;
  minPriceState$: Observable<number>;
  maxPriceState$: Observable<number>;
  foundedProductsCount$: Observable<number>;

  constructor(
    private router: Router,
    private store: Store<AppStateWithShop>,
    private messagesService: MessagesService,
    private loggerService: LoggerService
  ) {
  }

  ngOnInit(): void {
    this.activeCategoryId$ = this.store.select(ShopSelectors.selectLoadProductsFilters)
      .pipe(map(filters => filters.categories[0]));
    this.onlyInStockState$ = this.store.select(ShopSelectors.selectLoadProductsFilters)
      .pipe(map(filters => filters.onlyInStock));
    this.minPriceState$ = this.store.select(ShopSelectors.selectLoadProductsFilters)
      .pipe(map(filters => filters.minPrice));
    this.maxPriceState$ = this.store.select(ShopSelectors.selectLoadProductsFilters)
      .pipe(map(filters => filters.maxPrice));
    this.foundedProductsCount$ = this.store.select(ShopSelectors.selectProducts)
      .pipe(map(p => p.length));
  }

  ngAfterViewInit(): void {
      this.addPriceChangeEvent(this.priceFrom, 'minPrice');
      this.addPriceChangeEvent(this.priceTo, 'maxPrice');
  }

  addPriceChangeEvent(el, filterPropName) {
    fromEvent(el.nativeElement, 'keyup')
      .pipe(debounceTime(600))
      .subscribe((event: any) => {
        let filters = {};
        filters[filterPropName] = event.target.value;
        applyFilterToQueryParams(this.router, filters);
        // this.store.dispatch(ShopActions.loadProducts({
        //   filters
        // }))
      });
  }

  selectProdType(prodCatId: number) {
    applyFilterToQueryParams(this.router,{categories: [prodCatId]})
    // this.store.dispatch(ShopActions.loadProducts({
    //   filters: {
    //     categories: [prodCatId]
    //   }
    // }))
  }

  onOnlyInStockChange(event) {
    applyFilterToQueryParams(this.router, {onlyInStock: event.checked})

    // this.store.dispatch(ShopActions.loadProducts({
    //   filters: {
    //     onlyInStock: event.checked
    //   }}))
  }

  onClearFilters() {
    applyFilterToQueryParams(this.router,shopInitialState.loadProductsFilters);
    // this.applyFilter({
    //   categories: [0],
    //   minPrice: null,
    //   maxPrice: null,
    //   onlyInStock: false,
    // });
    // this.store.dispatch(ShopActions.loadProducts({
    //   filters: {
    //     categories: [0],
    //     minPrice: null,
    //     maxPrice: null,
    //     onlyInStock: false,
    //   }
    // }));
  }

  onApplyFiltersClick() {
    this.messagesService.sendToggleFiltersEvents();
  }

  onCloseClick() {
    this.messagesService.sendToggleFiltersEvents();
  }
}
