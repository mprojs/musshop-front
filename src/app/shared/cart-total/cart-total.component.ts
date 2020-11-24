import {Component, Input, OnInit} from '@angular/core';
import {ICart} from "../../core/store/types/cart.types";

@Component({
  selector: 'app-cart-total',
  templateUrl: './cart-total.component.html',
  styleUrls: ['./cart-total.component.scss']
})
export class CartTotalComponent implements OnInit {
  @Input() cart: ICart;

  constructor() { }

  ngOnInit(): void {
  }

}
