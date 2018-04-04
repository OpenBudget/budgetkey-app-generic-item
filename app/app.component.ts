import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BudgetKeyItemService, StoreService } from './services';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as _ from 'lodash';

const gtag: any = window['gtag'];


@Component({
  selector: 'budgetkey-app-generic-item',
  template: `
    <budgetkey-container [showHeader]="true" [showSearchBar]="true">
      <div #container class="budgetkey-item-wrapper container-fluid" [ngClass]="'style-' + style">
        <budgetkey-item-container *ngIf="loaded && style" [style]="style">
        </budgetkey-item-container>

        <div #questionsPanel class="sticky questions-panel" (click)="scrollToTable()">
          <budgetkey-item-questions *ngIf="loaded"></budgetkey-item-questions>
        </div>
        <div #dataTable class="data-table">
          <budgetkey-item-data-table *ngIf="loaded"></budgetkey-item-data-table>
        </div>
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
  style: string;

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
    private location: Location
  ) {
    this.loaded = false;
  }

  handleItem(item: any): void {
    console.log(this);
    this.store.item = item;
    this.itemService.getItemDescriptor(item.doc_id)
      .then(descriptor => {
        this.store.descriptor = descriptor;
        this.style = descriptor.style;
        this.loaded = true;
      });
  }

  ngOnInit(): void {
    this.loaded = false;
    let itemId = this.location.path().replace(/^\//, '').replace(/\/$/, '');
    let searchResultsLocation = window.location.search;
    if (searchResultsLocation) {
      let li = /li=(\d+)/;
      let match = li.exec(searchResultsLocation);
      if (match && match.length > 1) {
        let position = parseInt(match[1], 10);
        if (gtag) {
          gtag('event', 'view_item', {
            'event_label': itemId,
            'value': position
          });
        }
      }
    }
    console.log(window['prefetchedItem']);
    if (window['prefetchedItem']) {
      this.handleItem(window['prefetchedItem']);
    } else {
      let thiz = this;
      this.itemService.getItem(itemId)
        .then(item => { thiz.handleItem(item); });
    }

  }
}
