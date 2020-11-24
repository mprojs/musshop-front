import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {SigninComponent} from "./signin/signin.component";
import {SignupComponent} from "./signup/signup.component";
import {ProfileComponent} from "./profile/profile.component";
import {AuthGuard} from "../../core/guards/auth-guard";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: SigninComponent,
    data: {
      bc: 'login'
    }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      bc: 'register'
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
  constructor() {
  }
}
