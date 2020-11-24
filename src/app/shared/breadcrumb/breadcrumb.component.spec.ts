import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ActivatedRoute} from "@angular/router";
import {MockStore} from "@ngrx/store/testing";
import {ActivatedRouteStub} from "../mock-data/mock-route";

import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadcrumbComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
