import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';

import { BudgetKeyCommonModule } from 'budgetkey-ng2-components';

import { RenderTemplatePipe, PairsPipe } from './pipes';

import { BudgetKeyItemService, QuestionsService, StoreService } from './services';

import {
  BeadcrumbsComponent,
  HeaderComponent,
  ItemDataComponent,
  ItemQuestionsComponent,
  ItemDataTableComponent,
  ItemInfoComponent,
  ItemVisualizationsComponent
} from './components';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    BudgetKeyCommonModule
  ],
  declarations: [
    RenderTemplatePipe,
    PairsPipe,
    AppComponent,
    BeadcrumbsComponent,
    HeaderComponent,
    ItemDataComponent,
    ItemQuestionsComponent,
    ItemDataTableComponent,
    ItemInfoComponent,
    ItemVisualizationsComponent
  ],
  providers: [
    BudgetKeyItemService,
    QuestionsService,
    StoreService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
