import { Component, OnInit } from '@angular/core';
import {IProduct} from "../../../shared/types/IProduct";
import {AppState} from "../../../core/store/reducers/core.reducers";
import {Store} from "@ngrx/store";
import {WishActions, WishSelectors} from "../../../core/store";
import {Router} from "@angular/router";
import {Location} from "@angular/common";


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  products: IProduct[];

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.store.select(WishSelectors.selectProducts).subscribe(products => {
      this.products = Object.values(products);
    });
    console.log('LOad wish');
    this.store.dispatch(WishActions.loadWishlist());
  }

  public removeProduct(index: number) {
    let removed = this.products.splice(index, 1);
    this.store.dispatch(WishActions.removeFromWishlist({product: removed[0]}));
  }
}
