import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {fromEvent, Observable, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";
import {MixActions, MixSelectors} from "../../core/store";
import {AppStateWithShop} from "../../modules/shop/store/reducers/shop.reducer";
import {ISearchProductResult} from "../../modules/shop/store/reducers/shop.types";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild('search') searchElRef: ElementRef;
  searchEventsSubject = new Subject<string>();
  searchResults$: Observable<(Array<ISearchProductResult>)>;
  searchResultsNotEmpty: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppStateWithShop>,
    private router: Router,
  ) {
  }

  @HostListener('document:click', ['$event'])
  clickAnywhere(event) {
    if (this.searchResultsNotEmpty) {
      this.store.dispatch(MixActions.cleanSearchResult());
    }
  }

  ngOnInit(): void {
    this.searchResults$ = this.store.select(MixSelectors.selectSearchProductsResult);
    this.searchEventsSubject.asObservable()
      .subscribe((searchQuery: string) => {
        this.store.dispatch(MixActions.searchProducts({searchQuery}));
      });

    this.searchResults$.subscribe(res => {
      this.searchResultsNotEmpty = !!res.length;
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchElRef.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        filter((event: any) => {
          if (event.key === "Enter") {
            return true;
          }
          return event.target.value.length > 2;
        }),
        map((event: any) => ({text: event.target.value, key: event.key})),
        distinctUntilChanged((prev, cur) => {
          if (cur.key === 'Enter') {
            return false;
          }
          return prev.text === cur.text;
        })
      )
      .subscribe((event: any) => {
        this.searchEventsSubject.next(event.text);
      });
  }

  onSearchClick() {
    let text = this.searchElRef.nativeElement.value;
    if (text.length) {
      this.searchEventsSubject.next(text);
    }
  }

  onSearchSuggestionClick(id: number) {
    console.log(id);
    this.router.navigate(['/product'], {queryParams: {id}});
  }
}

