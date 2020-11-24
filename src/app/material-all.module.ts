import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";

const modules = [
  MatProgressBarModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  bootstrap: [AppComponent],
})
export class MaterialAllModule {}
