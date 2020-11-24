import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PagesRoutingModule} from "./pages-routing.module";
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import {MaterialAllModule} from "../../material-all.module";
import {FormsModule} from "@angular/forms";
import {RecaptchaModule} from "ng-recaptcha";



@NgModule({
  declarations: [AboutComponent, ContactComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialAllModule,
    FormsModule,
    RecaptchaModule
  ]
})
export class PagesModule { }
