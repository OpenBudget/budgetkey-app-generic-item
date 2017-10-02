import 'karma-test-shim';
import './rxjs-extensions';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetKeyCommonModule } from 'budgetkey-ng2-components';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { APP_BASE_HREF } from '@angular/common';

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

describe('AppComponent', function () {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
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
        {provide: APP_BASE_HREF, useValue: '/'},
        BudgetKeyItemService,
        QuestionsService,
        StoreService,
        EventsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
  });

  it('should create component', () => expect(comp).toBeDefined() );
});
