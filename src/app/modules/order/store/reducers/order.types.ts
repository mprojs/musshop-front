export interface IOrder {
  orderId: number;
  orderKey: string;
  orderNumber: string;
  total: string;
  status: string;
  date: any;
  lineItems: any;
  hidden?: boolean;
}
