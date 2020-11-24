import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../../core/store/reducers/core.reducers";
import {AuthActions, AuthSelectors} from "../../../core/store";
import {Apollo} from "apollo-angular";

import { HttpLink } from 'apollo-angular-link-http';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  public error: string;
  // public onLoadProfileClick() {
  public showDisclamer: any;

  returnUrl: any;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (this.returnUrl) {
      console.log(this.returnUrl);
      this.showDisclamer = true;
    } else {
      this.returnUrl = '/shop';
    }
    this.store.select(AuthSelectors.selectIsAuth).subscribe(isAuth => {
      if (isAuth) {
        this.router.navigateByUrl(this.returnUrl);
      }
    })

    this.store.select(AuthSelectors.selectLoginError)
      .subscribe(error => this.error = error);
  }

  get f() {
    return this.loginForm.controls;
  }
  //   this.store.dispatch(AuthActions.loadProfile({customerId: 4}));
  // }
  //
  // public onReloadApollo() {
  //   this.apollo.getClient().resetStore();
  //   console.log(this.apollo.getClient());
  // }

  public onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.store.dispatch(AuthActions.loginUser({
      username: this.f.username.value,
      password: this.f.password.value
    }));
  }
}
