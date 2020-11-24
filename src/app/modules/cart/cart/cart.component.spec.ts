import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CartComponent} from './cart.component';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MemoizedSelector} from "@ngrx/store";
import {AppState} from "../../../core/store/reducers/core.reducers";
import {CartSelectors, MixSelectors} from "../../../core/store";
import {TEST_DATA} from "../../../shared/mock-data/cart";
import {ICart} from "../../../core/store/types/cart.types";
import {CartService} from "../cart.service";
import {CartTotalComponent} from "../../../shared/cart-total/cart-total.component";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

class MockCartService {
  setQuantity(item, quantity) {
    console.log('Mock cart servise, setQuantity');
  }
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockStore: MockStore;
  let mockCartSelector: MemoizedSelector<AppState, ICart>;
  let mockCartSelectorOutOfStock: MemoizedSelector<AppState, any>;
  let mockApiErrorSelector: MemoizedSelector<AppState, any>;
  let mockIsMobileSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {
          provide: CartService,
          useValue: MockCartService
          // useValue: jasmine.createSpyObj('CartService', ['setQuantity'])
        }
      ],
      imports: [
        RouterTestingModule,
        MatIconModule,
        FormsModule,
      ],
      declarations: [
        CartTotalComponent,
        CartComponent,

      ],
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockCartSelector = mockStore.overrideSelector(
      CartSelectors.selectCart,
      TEST_DATA.cart
    );
    mockCartSelectorOutOfStock = mockStore.overrideSelector(
      CartSelectors.selectOutOfStockErrors,
      null
    );
    mockIsMobileSelector = mockStore.overrideSelector(
      MixSelectors.selectIsMobile,
      false
    );
    mockApiErrorSelector = mockStore.overrideSelector(
      MixSelectors.selectApiError,
      null,
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should equal total price', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.total-price > span:nth-child(2)').textContent)
      .toEqual('$18,500.00');
  });

  it('should has product name of second item', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.cart-row:nth-child(3) .product-name span:first-child').textContent)
      .toEqual('YAMAHA BABY GRAND');
  });

  it('should call addQuantity method on click', async(() => {
    spyOn(component, 'addQuantity');

    let button = fixture.debugElement.nativeElement.querySelector('.plus');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.addQuantity).toHaveBeenCalled();
    });
  }));
});
