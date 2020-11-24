import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../../core/store/reducers/core.reducers";
import {AuthActions, AuthSelectors} from "../../../core/store";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {convertGraphqlError} from "../../../core/utils/convert-messages-utils";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public error: any;
  signupForm: FormGroup;
  returnUrl: any;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      username: new FormControl('', {
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/shop';
    this.store.select(AuthSelectors.selectIsAuth).subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate([this.returnUrl]);
      }
    })

    this.store.select(AuthSelectors.selectRegisterError)
      .subscribe(error => this.error = convertGraphqlError(error));
  }

  get f() {
    return this.signupForm.controls;
  }

  public onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }
    this.store.dispatch(AuthActions.registerUser({
      username: this.f.username.value,
      password: this.f.password.value,
      email: this.f.email.value
    }));
  }
}
