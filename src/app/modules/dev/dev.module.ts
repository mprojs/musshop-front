import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevComponent } from './dev/dev.component';
import {SharedModule} from "../../shared/shared.module";
import {DevRoutingModule} from "./dev-routing.module";



@NgModule({
  declarations: [DevComponent],
  imports: [
    CommonModule,
    SharedModule,
    DevRoutingModule
  ]
})
export class DevModule { }
