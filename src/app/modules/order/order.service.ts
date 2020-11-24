import { Injectable } from '@angular/core';
import gql from "graphql-tag";
import {Apollo} from "apollo-angular";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private apollo: Apollo
  ) { }

  orderQuery() {
    return `
      orderId
      orderKey
      orderNumber
      total
      status
      date
      lineItems {
        nodes {
          product {
            name
            productId
            ... on SimpleProduct {
              price
            }
          }
          quantity
        }
      }
    `;
  }

  getOrders() {
    const query = gql`
      query GetCustomerOrders {
        customer {
          orders {
            nodes {
              ${this.orderQuery()}
            }
          }
        }
      }
    `;
    return this.apollo.watchQuery({query}).valueChanges.pipe(
      map((data:any) => {
        console.log(data);
        // console.log(data.data.customer.orders.nodes);
        return data.data.customer.orders.nodes;
      })
    )
  }

  createOrder() {
    const mutation = gql`
      mutation {
        checkout(input:{
          clientMutationId:"checkoutMutationId"
          isPaid:false
          paymentMethod:"cod"
        }){
          order {
            orderId
          }
        }
      }    
    `;
    return this.apollo.mutate({mutation}).pipe(
      map((data: any) => {
        console.log(data);
        return data.data.checkout.order;
      })
    )
  }

  cancelOrder(orderId: number) {
    return this.setOrderStatus(orderId, 'cancelled');
  }

  renewOrder(orderId: number) {
    return this.setOrderStatus(orderId, 'processing');
  }

  setOrderStatus(orderId: number, status: string) {
    const mutation = gql`
      mutation {
        cancelOrder(input:{
          clientMutationId:"cancelOrderMutationId"
          orderId:${orderId}
          status:"${status}"
        })
        {
          result
        }
      }   
    `;
    return this.apollo.mutate({mutation}).pipe(
      map((data: any) => {
        console.log(data);
        return data.data;
      })
    )
  }
}
