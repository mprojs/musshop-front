import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupComponent} from './signup/signup.component';
import {SigninComponent} from './signin/signin.component';
import {AuthRoutingModule} from "./auth-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ProfileComponent} from './profile/profile.component';
import {MaterialAllModule} from "../../material-all.module";


@NgModule({
  declarations: [SignupComponent, SigninComponent, ProfileComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MaterialAllModule
  ],
  providers: []
})
export class AuthModule {
}
