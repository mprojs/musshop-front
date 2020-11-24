import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import { ProductComponent } from './product/product.component';
import {ProductRoutingModule} from "./product-routing.module";
import {MaterialAllModule} from "../../material-all.module";



@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    MaterialAllModule,
    SharedModule,
  ]
})
export class ProductModule { }
