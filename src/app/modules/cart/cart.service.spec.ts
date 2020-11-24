import {TestBed} from '@angular/core/testing';
import {APOLLO_TESTING_CACHE, ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {AuthService} from "../auth/auth.service";
import {cartQueryFragment, CartService, loadCartQuery} from "./cart.service";
import {TEST_DATA} from "../../shared/mock-data/cart";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {MemoizedSelector} from "@ngrx/store";
import {AppState} from "../../core/store/reducers/core.reducers";
import {AuthSelectors, CartSelectors} from "../../core/store";
import {ICart} from "../../core/store/types/cart.types";
import {ToastrModule} from "ngx-toastr";
import {RouterTestingModule} from "@angular/router/testing";
import {InMemoryCache} from "apollo-cache-inmemory";
import {addTypenameToDocument} from 'apollo-utilities';
import gql from "graphql-tag";

describe('CartService', () => {
  let service: CartService;
  let controller: ApolloTestingController;
  let mockStore: MockStore;
  let mockCartSelector: MemoizedSelector<AppState, ICart>;
  let mockIsAuthSelector: MemoizedSelector<AppState, boolean>;
  const mockAuthService = jasmine
    .createSpyObj<AuthService>('AuthService', ['getTokenData']);

  beforeEach(() => {
    const state = {
      auth: {isAuth: true},
      mix: {storeInitialized: true}
    };
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        provideMockStore({initialState: state}),
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({addTypename: true})
        },
        {provide: AuthService, useValue: mockAuthService}
      ],
    });
    mockStore = TestBed.inject(MockStore);
    service = TestBed.inject(CartService);
    controller = TestBed.get(ApolloTestingController);

    mockCartSelector = mockStore.overrideSelector(
      CartSelectors.selectCart,
      null
    );
    mockIsAuthSelector = mockStore.overrideSelector(
      AuthSelectors.selectIsAuth,
      true
    );
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get cart', (done) => {
    service.loadCart().subscribe(result => {
      console.log('get cart get res:', result);
      expect(result).toEqual(TEST_DATA.cart);
      done();
    });
    controller.expectOne(addTypenameToDocument(loadCartQuery)).flush(TEST_DATA.getCartResponse);
  });

  it('should add to cart', (done) => {
    const payload = {productId: TEST_DATA.product1.productId, quantity: 1};
    const mutation = gql`
    mutation {
        addToCart (input:{
          clientMutationId:"addToCartMutationID"
          productId:${payload.productId}
          quantity:${payload.quantity} }){
          ${cartQueryFragment}          
        }
      }    
    `
    service.addToCart(payload)
      .subscribe(result => {
        console.log('add to cart get res:', result);
        expect(result).toEqual(TEST_DATA.cart);
        done();
      });
    controller.expectOne(addTypenameToDocument(mutation)).flush(TEST_DATA.addToCartResponse);
  });
});
