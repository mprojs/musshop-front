import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, Params} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {Store} from "@ngrx/store";
import {of, ReplaySubject} from "rxjs";
import {ActivatedRouteStub} from "../mock-data/mock-route";

import {SearchComponent} from './search.component';

class StoreMock {
  // How we did it before
  select = jasmine.createSpy().and.returnValue(of([]));
  dispatch = jasmine.createSpy();
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: new ActivatedRouteStub()},
        {provide: Store, useClass: StoreMock,}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
