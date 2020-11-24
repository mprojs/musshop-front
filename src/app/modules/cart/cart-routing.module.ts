import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {CartComponent} from "./cart/cart.component";
import {WishlistComponent} from "./wishlist/wishlist.component";
import {AuthGuard} from "../../core/guards/auth-guard";


const routes: Routes = [
  {
    path: '',
    component: CartComponent,
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {
  constructor() {
  }
}
