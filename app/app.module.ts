import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
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
    Title,
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
