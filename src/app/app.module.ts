// import './rxjs-extensions';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { getAuthServiceConfigProvider } from 'budgetkey-ng2-auth';

import { BudgetKeyCommonModule, THEME_ID_TOKEN, THEME_TOKEN, LANG_TOKEN } from 'budgetkey-ng2-components';
import { MushonkeyModule } from 'mushonkey';
import { AdamkeyModule } from 'adamkey';

import { RenderTemplatePipe, PairsPipe, KeysPipe } from './pipes';

import { BudgetKeyItemService, QuestionsService, StoreService, EventsService } from './services';

import {
  BeadcrumbsComponent,

  QuestionsPanelComponent,
  ItemQuestionsComponent,
  ItemQuestionParameterComponent,
  ItemDataTableComponent,
  ItemContainerComponent,
  ItemDirective,

  ChartRouterComponent,
  VerticalLayoutComponent,
  HorizontallLayoutComponent,

  MushonKeyChartComponent,
  PlotlyChartComponent,
  HorizontalBarchartChartComponent,
  TemplateChartComponent,
  PointatronChartComponent,
  ComparatronChartComponent,
  SpendomatChartComponent,
  SpendomatChartRowComponent,
  AdamKeyChartWrapperComponent,
  ContractPaymentsChartComponent,

  SimpleItemInfoComponent,
  SimpleItemVisualizationsComponent,
  SimpleItemComponent,

  ReportItemComponent,
  ReportItemInfoComponent,

  OrgItemComponent,
  OrgItemInfoComponent,

  TenderItemInfoComponent,
  ContractItemInfoComponent,
  ProcureItemComponent,
  CallForBidsItemInfoComponent,
  SupportCriteriaItemInfoComponent,

  GovUnitItemComponent,
  GovUnitItemInfoComponent,
  SocialServiceItemComponent,
  SoProcDatatableComponent,

  TimelinePartComponent,

  PeopleItemComponent,

  SafeHtmlPipe,
} from './components';


declare let BUDGETKEY_NG2_COMPONENTS_THEME: any;
declare const BUDGETKEY_THEME_ID: any;
declare const BUDGETKEY_LANG: any;

export const LANG = typeof(BUDGETKEY_LANG) === 'undefined' ? 'he' : BUDGETKEY_LANG;

const providers: any[] = [
  BudgetKeyItemService,
  QuestionsService,
  StoreService,
  EventsService,
  {provide: THEME_ID_TOKEN, useValue: typeof(BUDGETKEY_THEME_ID) === 'undefined' ? null : BUDGETKEY_THEME_ID},
  {provide: LANG_TOKEN, useValue: LANG},
  getAuthServiceConfigProvider('https://next.obudget.org')
];
if (typeof(BUDGETKEY_NG2_COMPONENTS_THEME) !== 'undefined') {
  BUDGETKEY_NG2_COMPONENTS_THEME = Object.assign({}, BUDGETKEY_NG2_COMPONENTS_THEME);
  providers.push({provide: THEME_TOKEN,
                  useValue: BUDGETKEY_NG2_COMPONENTS_THEME});
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BudgetKeyCommonModule,
    MushonkeyModule,
    AdamkeyModule
  ],
  declarations: [
    RenderTemplatePipe,
    PairsPipe,
    KeysPipe,
    AppComponent,
    BeadcrumbsComponent,
    QuestionsPanelComponent,
    ItemQuestionsComponent,
    ItemQuestionParameterComponent,
    ItemDataTableComponent,
    ItemContainerComponent,
    ItemDirective,
    SafeHtmlPipe,

    ChartRouterComponent,
    VerticalLayoutComponent,
    HorizontallLayoutComponent,

    MushonKeyChartComponent,
    PlotlyChartComponent,
    HorizontalBarchartChartComponent,
    TemplateChartComponent,
    PointatronChartComponent,
    ComparatronChartComponent,
    SpendomatChartComponent,
    SpendomatChartRowComponent,
    AdamKeyChartWrapperComponent,
    ContractPaymentsChartComponent,

    SimpleItemInfoComponent,
    SimpleItemVisualizationsComponent,
    SimpleItemComponent,

    ReportItemComponent,
    ReportItemInfoComponent,

    OrgItemComponent,
    OrgItemInfoComponent,

    TenderItemInfoComponent,
    ContractItemInfoComponent,
    ProcureItemComponent,
    CallForBidsItemInfoComponent,
    SupportCriteriaItemInfoComponent,

    GovUnitItemComponent,
    GovUnitItemInfoComponent,
    SocialServiceItemComponent,
    SoProcDatatableComponent,
    
    TimelinePartComponent,

    PeopleItemComponent,
],
  entryComponents: [
    SimpleItemComponent, ReportItemComponent, OrgItemComponent, ProcureItemComponent, PeopleItemComponent, GovUnitItemComponent, SocialServiceItemComponent
  ],
  providers: providers,
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
