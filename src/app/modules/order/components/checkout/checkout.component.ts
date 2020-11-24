import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../../../core/store/reducers/core.reducers";
import {OrderActions, OrderSelectors} from "../../store";
import {FormControl, FormGroup} from "@angular/forms";
import {ICart} from "../../../../core/store/types/cart.types";
import {AuthSelectors, CartSelectors, MixActions, MixSelectors} from "../../../../core/store";
import {Observable} from "rxjs";
import {filter, skip} from "rxjs/operators";
import {IUserProfile} from "../../../../shared/types/auth.types";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../../cart/cart.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public billingForm: FormGroup;
  cart: ICart;
  result$: Observable<{ orderId: number }>;
  user: IUserProfile;
  subscriptions = [];
  cartProcessing$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(MixActions.setCartProcessingOff()); //temp
    }, 5000);
    console.log('CHECKOUT INIT. qp',this.route.snapshot.queryParams);
    this.cartProcessing$ = this.store.select(MixSelectors.selectCartProcessing);

    this.billingForm = new FormGroup({
      firstName: new FormControl(this.user && this.user.firstName ? this.user.firstName : ''),
      lastName: new FormControl(''),
      state: new FormControl(''),
      streetAddress: new FormControl(''),
      apt: new FormControl(''),
      city: new FormControl(''),
      zip: new FormControl(''),
      phone: new FormControl(''),
    })
    this.subscriptions.push(
      this.store.select(CartSelectors.selectCart).subscribe(cart => this.cart = cart)
    );
    this.subscriptions.push(
      this.store.select(AuthSelectors.selectUserProfile).subscribe(user => this.user = user)
    );
    this.result$ = this.store.select(OrderSelectors.selectCreatedOrder).pipe(
      skip(1),
      filter(order => order != null)
    );

  }

  public onCreateOrderClick() {
    this.store.dispatch(OrderActions.createOrder());
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.result$) {
      this.store.dispatch(OrderActions.clearCreatedOrder());
    }
  }
}
