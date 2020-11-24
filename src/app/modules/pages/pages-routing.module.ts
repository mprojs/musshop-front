import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {AboutComponent} from "./about/about.component";
import {ContactComponent} from "./contact/contact.component";


const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: {bc: 'about'},
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {bc: 'contact', key: 'contact'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
  constructor() {
  }
}
