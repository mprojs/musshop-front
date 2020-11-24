import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../../../core/store/reducers/core.reducers";
import {OrderActions, OrderSelectors} from "../../store";
import {IOrder} from "../../store/reducers/order.types";
import {cloneObject} from "../../../../core/utils/objects-utils";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  public orders: IOrder[];
  subscriptions = [];
  public showStatusFilter = false;
  statuses: Array<{ status: string, checked: boolean }>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.store.select(OrderSelectors.selectOrders).subscribe((orders: IOrder[]) => {
      this.orders = cloneObject(orders).sort((a, b) => a.date > b.date ? -1 : 1);
      this.statuses = this.getStatuses();
    }));
    this.store.dispatch(OrderActions.getOrders());
  }

  buildProductNameString(order) {
    // console.log(order.lineItems.nodes);
    return order.lineItems.nodes.reduce((acc,cur) => acc + (acc ? ', ' : '') + cur.product.name, '');
  }

  public onCancelClick(order: IOrder) {
    this.store.dispatch(OrderActions.cancelOrder({orderId: order.orderId}));
  }

  public onReorderClick(order: IOrder) {
    this.store.dispatch(OrderActions.renewOrder({orderId: order.orderId}));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public getStatuses() {
    return this.orders.map(order => order.status)
      .filter((status, index, arr) => arr.indexOf(status) === index)
      .map(status => ({status, checked:false}));
  }

  public onStatusFilterChange($event: any, status: any) {
    console.log($event);
    console.log(status);
    status.checked = $event.checked;
    const allUnchecked = this.statuses.every(s => s.checked === false);
    this.orders = this.orders.map(order => {
      order.hidden = allUnchecked ? false : !this.statuses.find(s => s.status === order.status).checked;
      return order;
    });
    console.log(this.orders);
  }

  public getVisibleOrders() {
    return this.orders.filter(o => !o.hidden);
  }
}
