import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductListComponent} from './product-list/product-list.component';
import {FiltersComponent} from './filters/filters.component';
import {SearchComponent} from './search/search.component';
import {CategoriesComponent} from './categories/categories.component';
import {ShopRoutingModule} from "./shop-routing.module";
import {ShopComponent} from './shop/shop.component';
import {SharedModule} from "../../shared/shared.module";
import { StoreModule } from '@ngrx/store';
import {ShopService} from "./shop.service";
import {EffectsModule} from "@ngrx/effects";
import {ProductsEffects} from "./store/effects/products.effects";
import {NgxPaginationModule} from "ngx-pagination";
import {FormsModule} from "@angular/forms";
import {fromShop} from "./store";
import {MaterialAllModule} from "../../material-all.module";


@NgModule({
  declarations: [
    ProductListComponent,
    FiltersComponent,
    SearchComponent,
    CategoriesComponent,
    ShopComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule,
    MaterialAllModule,
    FormsModule,
    StoreModule.forFeature('shop', fromShop.reducer),
    EffectsModule.forFeature([ProductsEffects]),
    NgxPaginationModule,
  ],
  exports: [

  ],
  providers: [
    ShopService,
  ]
})
export class ShopModule {
}
