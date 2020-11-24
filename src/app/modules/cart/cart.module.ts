import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import {CartRoutingModule} from "./cart-routing.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {MaterialAllModule} from "../../material-all.module";
import { WishlistComponent } from './wishlist/wishlist.component';



@NgModule({
  declarations: [CartComponent, WishlistComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    MaterialAllModule,
    FormsModule,
    SharedModule,
  ]
})
export class CartModule { }
