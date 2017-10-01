import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';

import { BudgetKeyCommonModule } from 'budgetkey-ng2-components';

import { RenderTemplatePipe, PairsPipe, KeysPipe } from './pipes';

import { BudgetKeyItemService, QuestionsService, StoreService, EventsService } from './services';

import {
  BeadcrumbsComponent,
  HeaderComponent,
  ItemQuestionsComponent,
  ItemQuestionParameterComponent,
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
    KeysPipe,
    AppComponent,
    BeadcrumbsComponent,
    HeaderComponent,
    ItemQuestionsComponent,
    ItemQuestionParameterComponent,
    ItemDataTableComponent,
    ItemInfoComponent,
    ItemVisualizationsComponent
  ],
  providers: [
    BudgetKeyItemService,
    QuestionsService,
    StoreService,
    EventsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
