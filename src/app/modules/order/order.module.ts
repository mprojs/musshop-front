import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderComponent } from './components/order/order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {fromOrder} from "./store";
import {OrderEffects} from "./store/effects/order.effects";
import {OrderRoutingModule} from "./order-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialAllModule} from "../../material-all.module";



@NgModule({
  declarations: [OrdersComponent, OrderComponent, CheckoutComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    StoreModule.forFeature('order', fromOrder.reducer),
    EffectsModule.forFeature([OrderEffects]),
    SharedModule,
    ReactiveFormsModule,
    MaterialAllModule,
  ]
})
export class OrderModule { }
