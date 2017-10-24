import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BudgetKeyItemService, StoreService } from './services';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'budgetkey-app-generic-item',
  template: `
    <budgetkey-container>
      <div #container class="budgetkey-item-wrapper container-fluid">
        <budgetkey-page-header></budgetkey-page-header>
        <div *ngIf="!loaded"></div>
        <!--<budgetkey-breadcrumbs *ngIf="loaded"></budgetkey-breadcrumbs>-->
        <budgetkey-item-info *ngIf="loaded"></budgetkey-item-info>
        <budgetkey-item-visualizations *ngIf="loaded"></budgetkey-item-visualizations>

        <div #questionsPanel class="sticky" (click)="scrollToTable()">
          <budgetkey-item-questions *ngIf="loaded"></budgetkey-item-questions>
        </div>
        <div #dataTable><budgetkey-item-data-table *ngIf="loaded"></budgetkey-item-data-table></div>
      </div>  
    </budgetkey-container>
  `,
  styles: [`
    .sticky {
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      bottom: 0;
      z-index: 9000;
    }
  `],
  providers: [
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
})
export class AppComponent implements OnInit {
  loaded: boolean;

  @ViewChild('questionsPanel') questionsPanel: ElementRef;
  @ViewChild('dataTable') dataTable: ElementRef;

  scrollToTable() {
    if (_.isObject(window) && _.isFunction(window.scrollTo)) {
      let questionsPanelBounds = this.questionsPanel.nativeElement.getBoundingClientRect();
      if (questionsPanelBounds.bottom === window.innerHeight) {
        let dataTableBounds = this.dataTable.nativeElement.getBoundingClientRect();
        let questionsPanelHeight = questionsPanelBounds.bottom - questionsPanelBounds.top;
        window.scrollTo(0, window.scrollY + dataTableBounds.top - questionsPanelHeight);
      }
    }
  }

  constructor(
    private itemService: BudgetKeyItemService, private store: StoreService,
    private location: Location, private title: Title
  ) {
    this.loaded = false;
  }

  ngOnInit(): void {
    this.loaded = false;
    let itemId = this.location.path().replace(/^\//, '').replace(/\/$/, '');
    this.itemService.getItem(itemId)
      .then(item => {
        this.store.item = item;
        this.title.setTitle(item.name);
        return this.itemService.getItemDescriptor(itemId);
      })
      .then(descriptor => {
        this.store.descriptor = descriptor;
        this.loaded = true;
      });
  }
}
