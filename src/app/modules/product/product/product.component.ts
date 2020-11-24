import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {filter, first} from "rxjs/operators";
import {MessagesService} from "../../../core/services/messages.service";
import {CartActions, CartSelectors, ProductActions, ProductSelectors} from "../../../core/store";
import {AppState} from "../../../core/store/reducers/core.reducers";
import {ICartItem} from "../../../core/store/types/cart.types";
import {IBreadcrumb} from "../../../shared/types/breadcrumb";
import {IProductFull} from "../../../shared/types/IProductFull";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  product: IProductFull;
  inCart: number;
  private subscriptions = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private messagesService: MessagesService
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.queryParams.pipe(first())
        .subscribe((params: any) => {
          this.store.dispatch(ProductActions.loadProduct({id: +params.id}));
        }));

    this.subscriptions.push(this.store.select(ProductSelectors.selectProduct)
      .pipe(filter(p => p != null))
      .subscribe(product => {
        this.product = product;
        this.subscriptions.push(this.store.select(CartSelectors.selectItems).subscribe((items: ICartItem[]) => {
          let inCart = items.filter((item: ICartItem) => item.product && this.product && item.product.productId === this.product.productId);
          this.inCart = (inCart.length) ? inCart[0].quantity : 0;
          // console.log('Check items - ', this.inCart);
        }));

        let breadcrumbs: IBreadcrumb[] = [{label: 'Products', url: '/shop'}];
        let productCategory = this.product.productCategories.nodes.filter(cat => cat.description === 'instrumentType')[0];
        if (productCategory) {
        }
        breadcrumbs.push({
          label: productCategory.name,
          url: '/shop',
          queryParams: {categories: productCategory.productCategoryId}
        })
        this.messagesService.updateBreadcrumbs(breadcrumbs);
      }));

  }

  public onAddToCartClick() {
    this.store.dispatch(CartActions.addToCart({productId: this.product.productId, quantity: 1}));
  }

  public onBuyNowClick() {

  }

  public onContShoppingClick() {
    this.router.navigate(['/shop']);
  }

  public onCheckoutClick() {
    this.router.navigate(['/checkout']);
  }

  pluralize(count: number) {
    return (count && count > 1) ? 's' : '';
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
