import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';

import { BudgetKeyCommonModule } from 'budgetkey-ng2-components';

import { BudgetKeyItemHeader } from './budgetkey-item-header.component';

import { BudgetKeyItemBody } from './budgetkey-item-body/budgetkey-item-body';
import { BudgetKeyIntro } from './budgetkey-item-body/introduction';
import { WhereIsTheMoney } from './budgetkey-item-body/where-is-the-money';

@NgModule({
  imports:      [
    BrowserModule,
    HttpModule,
    BudgetKeyCommonModule
  ],
  declarations: [
    AppComponent,
    BudgetKeyItemHeader,
    BudgetKeyItemBody,
    BudgetKeyIntro,
    WhereIsTheMoney
  ],
  providers: [
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {

}
