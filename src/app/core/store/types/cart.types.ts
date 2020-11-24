import {IProduct} from "../../../shared/types/IProduct";

export interface ICartItem {
  product: IProduct;
  key: string;
  quantity: number;
  subtotal?: string;
}

export interface ICart {
  items: Array<ICartItem>;
  total: string;
  subtotal: string;
  discountTotal: string;
  shippingTotal: string
}

export interface IAddToCartPayload {
  productId: number,
  quantity: number
}

