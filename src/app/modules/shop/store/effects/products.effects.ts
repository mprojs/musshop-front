import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, switchMap, withLatestFrom} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {of} from "rxjs";
import {ShopActions} from "../index";
import {ShopService} from "../../shop.service";
import {MixActions} from "../../../../core/store";
import {IProductCategory, ISearchProductResult} from "../reducers/shop.types";
import {AppStateWithShop} from "../reducers/shop.reducer";

@Injectable()
export class ProductsEffects {

  constructor(
    private store: Store<AppStateWithShop>,
    private actions$: Actions,
    private shopService: ShopService
  ) {
  }

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ShopActions.loadProducts
      ),
      withLatestFrom(this.store),
      mergeMap((params: any) => {
          let action = params[0];
          let storeState: AppStateWithShop = params[1];
          // console.log(action, storeState);
          this.store.dispatch(MixActions.setProgressOn());
          return this.shopService
            .loadProducts(action, storeState.shop.loadProductsFilters)
            .pipe(
              map(({products, pageInfo}) => {
                this.store.dispatch(MixActions.setProgressOff());
                // saveDataInCache('products', products);
                // console.log('New page info:');
                // console.log(pageInfo);
                return ShopActions.loadProductsSuccess({products, pageInfo})
              }),
              catchError(error => {
                  this.store.dispatch(MixActions.setProgressOff());
                  return of(MixActions.apiError(error))
                }
              )
            )
        }
      )
    )
  );

  loadProductCategories$ = createEffect(() => (
      this.actions$.pipe(
        ofType(ShopActions.loadProductCategories),
        mergeMap((action: any) => {
          return this.shopService.loadProductCategories().pipe(
            map((cat: Array<IProductCategory>) => {
              return ShopActions
                .loadProductCategoriesSuccess({categories: cat})
            }),
            catchError(error => of(MixActions.apiError(error)))
          )
        })
      )
    )
  );


}
