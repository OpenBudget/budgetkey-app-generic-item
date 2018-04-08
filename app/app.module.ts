import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';

import { BudgetKeyCommonModule, THEME_TOKEN as NG_COMPONENTS_THEME_TOKEN } from 'budgetkey-ng2-components';
import { MushonkeyModule } from 'mushonkey';

import { RenderTemplatePipe, PairsPipe, KeysPipe } from './pipes';

import { BudgetKeyItemService, QuestionsService, StoreService, EventsService } from './services';

import {
  BeadcrumbsComponent,
  ItemQuestionsComponent,
  ItemQuestionParameterComponent,
  ItemDataTableComponent,
  ItemContainerComponent,
  ItemDirective,

  ChartRouterComponent,
  MushonKeyChartComponent,
  PlotlyChartComponent,
  HorizontalBarchartChartComponent,
  AdamKeyChartComponent,

  SimpleItemInfoComponent,
  SimpleItemVisualizationsComponent,
  SimpleItemComponent,

  ReportItemComponent,
  ReportItemInfoComponent,
} from './components';

import { THEME_TOKEN, defaultTheme } from './config';

declare const BUDGETKEY_NG2_COMPONENTS_THEME: any;
declare const BUDGETKEY_APP_GENERIC_ITEM_THEME: any;

let providers: any[] = [
  Title,
  BudgetKeyItemService,
  QuestionsService,
  StoreService,
  EventsService,
  {
    provide: THEME_TOKEN,
    useValue: typeof(BUDGETKEY_APP_GENERIC_ITEM_THEME) === 'undefined' ? defaultTheme : BUDGETKEY_APP_GENERIC_ITEM_THEME
  }
];
if (typeof(BUDGETKEY_NG2_COMPONENTS_THEME) !== 'undefined') {
  providers.push({provide: NG_COMPONENTS_THEME_TOKEN, useValue: BUDGETKEY_NG2_COMPONENTS_THEME});
}

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    BudgetKeyCommonModule,
    MushonkeyModule
  ],
  declarations: [
    RenderTemplatePipe,
    PairsPipe,
    KeysPipe,
    AppComponent,
    BeadcrumbsComponent,
    ItemQuestionsComponent,
    ItemQuestionParameterComponent,
    ItemDataTableComponent,
    ItemContainerComponent,
    ItemDirective,

    ChartRouterComponent,
    MushonKeyChartComponent,
    PlotlyChartComponent,
    HorizontalBarchartChartComponent,
    AdamKeyChartComponent,

    SimpleItemInfoComponent,
    SimpleItemVisualizationsComponent,
    SimpleItemComponent,

    ReportItemComponent,
    ReportItemInfoComponent,
  ],
  entryComponents: [ SimpleItemComponent, ReportItemComponent ],
  providers: providers,
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
