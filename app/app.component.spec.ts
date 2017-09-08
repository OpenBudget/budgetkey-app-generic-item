import 'karma-test-shim';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetKeyCommonModule } from 'budgetkey-ng2-components';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { BudgetKeyItemHeader } from './budgetkey-item-header.component';

describe('AppComponent', function () {
  let de: DebugElement;
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        BudgetKeyCommonModule,
        HttpModule
      ],
      declarations: [
        AppComponent,
        BudgetKeyItemHeader
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h1'));
  });

  it('should create component', () => expect(comp).toBeDefined() );
});
