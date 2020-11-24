import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import {Store} from "@ngrx/store";
import {AppState} from "../store/reducers/core.reducers";
import {AuthSelectors} from "../store";
import {first, take} from "rxjs/operators";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isAuth;
    this.store.select(AuthSelectors.selectIsAuth).pipe(first())
      .subscribe(val => isAuth = val)
    if (isAuth) {
      return true;
    }

    this.router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
