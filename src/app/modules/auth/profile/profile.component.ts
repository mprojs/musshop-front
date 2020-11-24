import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../../core/store/reducers/core.reducers";
import {AuthActions, AuthSelectors} from "../../../core/store";
import {filter, first, skip, take} from "rxjs/operators";
import {IUserProfile} from "../../../shared/types/auth.types";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {cloneObject} from "../../../core/utils/objects-utils";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: IUserProfile;
  form: FormGroup;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.store.select(AuthSelectors.selectUserProfile).pipe(first())
      .subscribe(profile => {
        if (profile) {
          this.profile = profile;
        } else {
          this.store.dispatch(AuthActions.loadProfile());
        }
      });
    this.form = new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.minLength(1)]
      }),
      lastName: new FormControl('', {
        validators: [Validators.minLength(1)]
      }),
    })

    this.subscribeToProfileChange();
  }

  subscribeToProfileChange(skipLen = 0) {
    this.store.select(AuthSelectors.selectUserProfile).pipe(
      filter(data => data != null),
      skip(skipLen),
      take(1)
    ).subscribe(data => {
      this.profile = cloneObject(data);
      this.form.markAsUntouched();
      if (this.profile.firstName) {
        this.form.controls['firstName'].setValue(this.profile.firstName);
      }
      if (this.profile.lastName) {
        this.form.controls['lastName'].setValue(this.profile.lastName);
      }
    });
  }

  public updateProfileClick() {
    console.log(this.form.controls.firstName.value);
    console.log(this.form.controls.lastName.value);
    this.subscribeToProfileChange(1);
    this.store.dispatch(AuthActions.updateProfile({
      username: this.profile.username,
      email: this.profile.email,
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value
    }));
  }
}
