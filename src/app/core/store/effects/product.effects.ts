import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {of} from "rxjs";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {ProductService} from "../../../modules/product/product.service";
import {ISearchProductResult} from "../../../modules/shop/store/reducers/shop.types";
import {IProductFull} from "../../../shared/types/IProductFull";
import {MixActions, ProductActions} from "../index";
import {AppState} from "../reducers/core.reducers";

@Injectable()
export class ProductEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private productService: ProductService
  ) {
  }

  $loadProduct = createEffect(() => (
    this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      switchMap((action: any) => {
        this.store.dispatch(MixActions.setProgressOn());
        return this.productService.loadProduct(action.id).pipe(
          map((product: IProductFull) => {
            this.store.dispatch(MixActions.setProgressOff());
            return ProductActions.loadProductSuccess({product});
          }),
          catchError(error => {
              this.store.dispatch(MixActions.setProgressOff());
              return of(MixActions.apiError({error, message: 'Cannot load products'}))
            }
          )
        )
      })
    )
  ));

  searchProducts$ = createEffect(() => (
    this.actions$.pipe(
      ofType(MixActions.searchProducts),
      switchMap((action: any) => {
        console.log(22222, action);
        return this.productService.searchProducts(action.searchQuery).pipe(
          map((results: Array<ISearchProductResult>) => {
            return MixActions.searchProductsSuccess({searchResults: results});
          }),
          catchError(error => of(MixActions.apiError(error)))
        );
      })
    )
  ));
}
