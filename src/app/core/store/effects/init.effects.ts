import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../reducers/core.reducers";
import {Actions, createEffect, ofType, ROOT_EFFECTS_INIT} from "@ngrx/effects";
import {map, tap} from "rxjs/operators";
import {MixActions} from "../index";

@Injectable()
export class InitEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
  ) {
  }

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map((action) => {
        return (MixActions.setStoreInitialized());
      })
    )
  );
}
