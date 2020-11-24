import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {AuthSelectors, MixSelectors} from './core/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {AppState} from './core/store/reducers/core.reducers';
import {MemoizedSelector} from '@ngrx/store';
import {HeaderComponent} from "./shared/header/header.component";
import {FooterComponent} from "./shared/footer/footer.component";
import {MatIconModule} from "@angular/material/icon";

describe('AppComponent', () => {
  let mockStore: MockStore;
  let mockLoadingSelector: MemoizedSelector<AppState, boolean>;
  let mockApiErrorSelector: MemoizedSelector<AppState, any>;
  let mockIsAuthSelector: MemoizedSelector<AppState, boolean>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [
        RouterTestingModule,
        MatIconModule,
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
      ],
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockLoadingSelector = mockStore.overrideSelector(
      MixSelectors.selectProgressEnabled,
      false
    );
    mockIsAuthSelector = mockStore.overrideSelector(
      AuthSelectors.selectIsAuth,
      false
    );
    mockApiErrorSelector = mockStore.overrideSelector(
      MixSelectors.selectApiError,
      null,
    );
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'musshop-front'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('musshop-front');
  });
});
