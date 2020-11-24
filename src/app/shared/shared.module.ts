import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import {PaginationComponent} from "./pagination/pagination.component";
import {NgxPaginationModule} from "ngx-pagination";
import {HeaderComponent} from "./header/header.component";
import {RouterModule} from "@angular/router";
import {ToClassPipe} from "./pipes/toClassPipe";
import { ErrorPaneComponent } from './error-pane/error-pane.component';
import {LimitStringLengthPipe} from "./pipes/limitStringLength";
import { CartTotalComponent } from './cart-total/cart-total.component';
import {MaterialAllModule} from "../material-all.module";
import {ProductCardComponent} from "./product/product-card.component";
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    ToClassPipe,
    LimitStringLengthPipe,
    NavComponent,
    FooterComponent,
    PaginationComponent,
    HeaderComponent,
    ErrorPaneComponent,
    CartTotalComponent,
    ProductCardComponent,
    BreadcrumbComponent,
    SearchComponent,
  ],
  exports: [
    ToClassPipe,
    LimitStringLengthPipe,
    NavComponent,
    FooterComponent,
    PaginationComponent,
    HeaderComponent,
    ErrorPaneComponent,
    CartTotalComponent,
    ProductCardComponent,
    BreadcrumbComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    RouterModule,
    MaterialAllModule,
  ]
})
export class SharedModule { }
