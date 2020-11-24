import {isPlatformServer} from "@angular/common";
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Store} from "@ngrx/store";
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {ToastrService} from "ngx-toastr";
import {combineLatest, concat, Observable, of} from "rxjs";
import {catchError, first, map, mergeMap, switchMap, toArray, withLatestFrom} from "rxjs/operators";
import {BroadcastService} from "../../core/services/broadcast.service";
import {AuthSelectors, CartActions, CartSelectors, MixActions, WishSelectors} from "../../core/store";
import {AppState} from "../../core/store/reducers/core.reducers";
import {IAddToCartPayload, ICart, ICartItem} from "../../core/store/types/cart.types";
import {cloneObject} from "../../core/utils/objects-utils";
import {parsePrice, toPrice} from "../../core/utils/strings-utils";
import {AuthService} from "../auth/auth.service";
import {ProductService} from "../product/product.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private isAuth: boolean;
  private localCart: ICart;
  private cartLSKey = 'local-cart';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store<AppState>,
    private apollo: Apollo,
    private productService: ProductService,
    private toastr: ToastrService,
    private authService: AuthService,
    private broadcastService: BroadcastService,
  ) {
    this.localCart = this.initLocalCart();
    this.readSavedLocalCart();
    this.store.select(AuthSelectors.selectIsAuth).subscribe(isAuth => {
      this.isAuth = isAuth;
      if (isAuth) {
        this.moveLocalCartToServer();
      } else {
        // move cart from store (is exists) to local cart
        this.store.select(CartSelectors.selectCart).pipe(first()).subscribe(cart => {
          if (cart && cart.items.length) {
            this.localCart = cloneObject(cart);
            this.saveLocalCart();
          }
        })
      }
    });

    this.store.select(CartSelectors.selectCart).subscribe(cart => {
      if (!this.isAuth) {
        this.localCart = cloneObject(cart);
      }
    })
  }

  initLocalCart() {
    return {
      items: [],
      discountTotal: '0',
      shippingTotal: '0',
      subtotal: '0',
      total: '0'
    };
  }

  convertCartResponse(res) {
    return {
      items: res.contents.nodes,
      total: res.total,
      subtotal: res.subtotal,
      discountTotal: res.discountTotal,
      shippingTotal: res.shippingTotal
    }
  }

  loadCart() {
    if (!this.isAuth) {
      return this.loadLocalCart();
    }
    const query = loadCartQuery;
    return this.apollo.watchQuery({query, fetchPolicy: 'network-only'}).valueChanges.pipe(
      map((data: any) => {
        // console.log('LOAD CART ITEMS:', data);
        return this.convertCartResponse(data?.data?.cart);
      })
    )
  }

  addToCart(payload: IAddToCartPayload): Observable<ICart> {
    const mutation = gql`
      mutation {
        addToCart (input:{
          clientMutationId:"addToCartMutationID"
          productId:${payload.productId}
          quantity:${payload.quantity} }){
          ${cartQueryFragment}          
        }
      }    
    `;
    return this.apollo.mutate({mutation}).pipe(
      map((data: any) => {
        // console.log(data);
        let cart = this.convertCartResponse(data?.data?.addToCart?.cart);
        if (this.isAuth) {
          return cart;
        } else {
          return this.addToLocalCart(cart.items);
        }
      })
    )
  }

  deleteItem(payload: any): Observable<ICart> {
    console.log(payload);
    if (!this.isAuth) {
      return of(this.removeFromLocalCart(payload.item));
    }
    const mutation = gql`
      mutation removeItemsFromCart {
        removeItemsFromCart(input: {
          clientMutationId: "removeItemsFromCartMutationID", 
          keys: ["${payload.item.key}"]}) {
          ${cartQueryFragment}
        }
      }
    `;
    return this.apollo.mutate({mutation}).pipe(
      map((data: any) => {
        console.log(data);
        return this.convertCartResponse(data?.data?.removeItemsFromCart?.cart);
      })
    )
  }

  setQuantity(item: ICartItem, quantity: number) {
    console.log('Set quantity of', item.product.name, item.product.productId);
    if (quantity === item.quantity) {
      return;
    } else if (quantity < item.quantity) {
      this.recreateItem(item, quantity);
    } else {
      // check stock quantity
      this.productService.loadProduct(item.product.productId).subscribe(prod => {
        if (prod.stockQuantity == null || prod.stockQuantity >= quantity) {
          // if enough or sell without stock management (stockQuantity = null) - set asked quantity
          this.recreateItem(item, quantity);
        } else {
          // if not enough - set max and show message
          this.recreateItem(item, prod.stockQuantity);
          this.toastr.warning(`Only ${prod.stockQuantity} items available in stock!`);
        }
      })


    }
  }

  recreateItem(item: ICartItem, quantity: number) {
    this.deleteItem({item}).subscribe(() => {
      console.log('Recreate item', item.product.name, quantity);
      this.store.dispatch(CartActions.addToCart({productId: item.product.productId, quantity}));
    }, error => {
      this.store.dispatch(MixActions.apiError({error, message: 'Cannot change item quantity'}));
    })
  }

  emptyCart() {
    const mutation = gql`
      mutation {
        emptyCart(input: { clientMutationId: "asdf" }) {
          cart {
            total
          }
        }
      }    
    `;
    return this.apollo.mutate({mutation});
  }

  loadSavedCart() {
    // console.log('loadsavedCart');
    // let cartStr = localStorage.getItem('saved-cart');
    // if (!cartStr) {
    //   return throwError(new Error('Cannot find saved cart.'));
    //   // return;
    // }
    // let cart: ICart = JSON.parse(cartStr);
    // return this.emptyCart().pipe(
    //   switchMap(() => {
    //     console.log('Bef combineLatest');
    //     return combineLatest(...cart.items.map(item => this.addToCart({
    //       productId: item.product.productId, quantity: item.quantity
    //     })))
    //   }),
    //   tap(() => {
    //     console.log('REMOVE LS SAVED CART');
    //     localStorage.removeItem('saved-cart');
    //   }),
    //   delay(1000), // to prevent immediatelly loading cart, as api can return previous result
    //   map((data: any) => {
    //     console.log(data);
    //     this.store.dispatch(CartActions.loadCartItems());
    //     return true;
    //   })
    // )
  }

  getWishListQuery() {
    return gql`
      query GetCustomer {
      customer(customerId:${this.authService.getTokenData().customerId}) {
        metaData {
          key
          value
        }
      }
    }
    `;
  }

  getWishListIDsFromData(data: any) {
    let metaData = data?.data?.customer.metaData;
    let wishlistValue = metaData?.filter(kv => kv != null).find(md => md.key === 'wishlist')?.value;
    if (wishlistValue) {
      return JSON.parse(wishlistValue);
    } else {
      return [];
    }
  }

  loadWishlist(): Observable<any> {
    return this.apollo.watchQuery({query: this.getWishListQuery()}).valueChanges.pipe(
      first(),
      withLatestFrom(this.store.select(WishSelectors.selectProducts)),
      map(([data, products], index) => {
        let idsToLoad = [];
        let productIds = this.getWishListIDsFromData(data);
        if (productIds.length) {
          // console.log('WishListIds:', productIds);
          idsToLoad = productIds.filter(id => !products[id]);
        }
        return {idsToLoad, products}
      }),
      mergeMap(({idsToLoad, products}) => {
        products = cloneObject(products);
        if (idsToLoad.length) {
          return combineLatest(...idsToLoad.map(id => this.productService.loadProduct(id).pipe(
            first()
          ))).pipe(
            map(loadedProducts => {
              loadedProducts.forEach(p => {
                products[p.productId] = p;
              })
              return products;
            })
          );
        } else {
          return of(products);
        }
      })
    );
  }

  getUpdateWishlistMutation(value: Array<number>) {
    console.log(value);
    console.log(JSON.stringify(value));
    console.log(this.authService.getTokenData().userId);
    return gql`
      mutation {
        updateCustomer(input: {
          clientMutationId:"updateCustomerMutationId"
          id:"${this.authService.getTokenData().userId}"
          metaData: {
            key:"wishlist"
            value:"${JSON.stringify(value)}"
          }
        }) {
          customer {
            metaData {
              key
              value
            }
          }
        }
      }    
    `;
  }

  addToWishlist(productId) {
    return this.apollo.watchQuery({query: this.getWishListQuery()}).valueChanges.pipe(
      first(),
      mergeMap((data: any) => {
        console.log(data);
        let wishlistIds = this.getWishListIDsFromData(data);
        if (!Array.isArray(wishlistIds)) {
          wishlistIds = [wishlistIds];
        }
        console.log(wishlistIds);
        if (wishlistIds.indexOf(productId) < 0) {
          wishlistIds.push(productId);
        }
        return this.apollo.mutate({
          mutation: this.getUpdateWishlistMutation(wishlistIds)
        }).pipe(
          first(),
          map((data: any) => {
            console.log(data);
            return [];
          })
        );
      })
    );
  }

  removeFromWishlist(product, wishlistIds) {
    wishlistIds.splice(wishlistIds.findIndex(id => id === product.productId), 1);
    console.log(wishlistIds);
    console.log(this.getUpdateWishlistMutation(wishlistIds));
    // return of([]);
    return this.apollo.mutate({
      mutation: this.getUpdateWishlistMutation(wishlistIds)
    }).pipe(
      first(),
      map((data: any) => {
        console.log(data);
        return [];
      })
    );
  }

  cartQuery() {
    return cartQueryFragment;
  }

  shareCartBetweenTabs() {

  }

  readSavedLocalCart() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    let savedVal = localStorage.getItem(this.cartLSKey);
    if (savedVal) {
      this.localCart = JSON.parse(savedVal);
      this.store.dispatch(CartActions.loadCartSuccess(cloneObject(this.localCart)));
    }
  }

  saveLocalCart() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    localStorage.setItem(this.cartLSKey, JSON.stringify(this.localCart));
  }

  recalculateLocalCart() {
    let subtotal = 0;
    this.localCart.items.forEach(item => {
      subtotal += parsePrice(item.subtotal);
    })
    let total = subtotal - parsePrice(this.localCart.discountTotal)
      + parsePrice(this.localCart.shippingTotal);
    this.localCart.subtotal = toPrice(subtotal);
    this.localCart.total = toPrice(total);
  }

  addToLocalCart(newItems: ICartItem[]) {
    // console.log('add to local cart', newItems.map(i => ({name: i.product.name, quantity: i.quantity})));
    newItems.forEach(newItem => {
      let index = this.localCart.items
        .findIndex(good => good.product.productId === newItem.product.productId);
      if (index >= 0) {
        let curItem = this.localCart.items[index];
        curItem.quantity = newItem.quantity + curItem.quantity;
        curItem.subtotal
          = toPrice(curItem.quantity * parsePrice(curItem.product.price));
      } else {
        this.localCart.items.push((newItem));
      }
    });
    this.recalculateLocalCart();
    this.saveLocalCart();
    return cloneObject(this.localCart);
  }

  removeFromLocalCart(item) {
    this.localCart.items.splice(this.localCart.items
      .findIndex(i => i.product.productId === item.product.productId), 1);
    this.recalculateLocalCart();
    this.saveLocalCart();
    return cloneObject(this.localCart);
  }

  loadLocalCart(): Observable<ICart> {
    return of(cloneObject(this.localCart));
  }

  emptyLocalCart() {
    this.localCart = this.initLocalCart();
    this.saveLocalCart();
  }

  moveLocalCartToServer() {
    if (this.localCart.items.length === 0) {
      this.store.dispatch(CartActions.loadCart());
      return;
    }
    this.store.dispatch(MixActions.setCartProcessingOn());
    this.emptyCart().pipe(
      switchMap(() => {
        return concat(
          ...this.localCart.items
            .map(item => this.addToCart({
              productId: item.product.productId,
              quantity: item.quantity
            }).pipe(
              catchError(e => of({outOfStock: true, name: item.product}))
            ))
        ).pipe(toArray())
      }),
    ).subscribe((data: Array<any>) => {
      console.log('Move to server finished with data:', data);
      let outOfStock = data.filter(item => item.outOfStock);
      if (outOfStock.length) {
        this.store.dispatch(CartActions.outOfStockError({products: outOfStock.map(item => item.product)}))
      }
      this.store.dispatch(CartActions.loadCart());
      this.store.dispatch(MixActions.setCartProcessingOff());
      this.emptyLocalCart();
    }, error => {
      this.store.dispatch(MixActions.setCartProcessingOff());
      this.store.dispatch(MixActions.apiError({error, message: 'Cannot process cart.'}))
    });
  }
}

export const cartQueryFragment = `
    cart {
      contents {
        nodes {
          key
          product {
            name
            productId
            description
            ... on SimpleProduct {
              price
            }
            image {
              sourceUrl
            }
          }
          quantity
          subtotal
        }
      }
      shippingTotal
      discountTotal
      subtotal
      total 
    }    
    `;

export const loadCartQuery = gql`
      query LoadCartItems {
        ${cartQueryFragment}
      }
    `
