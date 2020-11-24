import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {WishActions, WishSelectors} from "../../../core/store";
import {applyFilterToQueryParams} from "../../../core/utils/router-utils";
import {IProduct} from "../../../shared/types/IProduct";
import {ShopSelectors} from "../store";
import {AppStateWithShop} from "../store/reducers/shop.reducer";
import {IProductsPageInfo} from "../store/reducers/shop.types";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  page: number = 1;
  products: Array<IProduct>;
  pageInfo: IProductsPageInfo;
  // itemsPerPage = 12;
  wishlistIds: number[];

  constructor(
    private router: Router,
    private store: Store<AppStateWithShop>,
  ) {
  }

  ngOnInit(): void {
    // applyFilterToQueryParams(this.router, {count: this.itemsPerPage});
    // this.store.dispatch(ShopActions.loadProducts({filters: {count: this.itemsPerPage}}));
    this.store.select(ShopSelectors.selectProducts).subscribe(products => {
      this.products = products;
    })
    this.store.select(WishSelectors.selectIds).subscribe(ids => {
      this.wishlistIds = ids;
    })
    this.store.select(ShopSelectors.selectProductsPageInfo)
      .subscribe((info: IProductsPageInfo) => {
        // console.log('Page info changed');
        // console.log('SC: ',this.pageInfo?.startCursor, '->', info.startCursor);
        // console.log('EC: ',this.pageInfo?.endCursor, '->', info.endCursor);
        this.pageInfo = info;
      })

    // this.shopMessagesService.getSelectProdTypeEvent().subscribe(prodCat => {
    //   // this.currentLoadProductsPayload = {
    //   //   // count: this.itemsPerPage,
    //   //   categories: [prodCat]
    //   // }
    //   this.store.dispatch(ShopActions.loadProducts(
    //     {
    //       filters: {}
    //     }
    //   ));
    // })
  }

  prevClick() {
    applyFilterToQueryParams(this.router, {
      before: this.pageInfo.startCursor,
      after: '',
    });
  }

  nextClick() {
    applyFilterToQueryParams(this.router, {
      after: this.pageInfo.endCursor,
      before: '',
    });
  }

  public onUnwish(product: IProduct) {
    this.store.dispatch(WishActions.removeFromWishlist({product}));
  }
}
