import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from "@angular/http";

import { AppComponent }  from './app.component';

import { BudgetKeyCommonModule } from 'budgetkey-ng2-components';

@NgModule({
  imports:      [
    BrowserModule,
    HttpModule,
    BudgetKeyCommonModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
