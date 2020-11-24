import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../store/reducers/core.reducers";
import {isPlatformServer} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  private broadcastChannel: BroadcastChannel;
  private isServer = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store<AppState>,
  ) {
    if (isPlatformServer(this.platformId) || !window.BroadcastChannel) {
      this.isServer = true;
      return;
    }

    this.broadcastChannel = new BroadcastChannel('state-broadcast-channel');

    this.broadcastChannel.onmessage = (message) => {
      console.log('Received message', message);
      if (message.data?.type) {
        this.store.dispatch(message.data);
      }
    }
  }

  post(message) {
    if (!this.isServer) {
      this.broadcastChannel.postMessage(message);
    }
  }
}
