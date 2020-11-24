import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {OrdersComponent} from "./components/orders/orders.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {AuthGuard} from "../../core/guards/auth-guard";


const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {
  constructor() {
  }
}
