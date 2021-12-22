import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { BudgetKeyItemService, StoreService } from './services';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {THEME_TOKEN} from 'budgetkey-ng2-components';

import * as _ from 'lodash';
import * as moment from 'moment';
import { QuestionsPanelComponent } from './components/questions/questions-panel/questions-panel.component';

const gtag: any = window['gtag'];


@Component({
  selector: 'budgetkey-app-generic-item',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less'],
  providers: [
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
})
export class AppComponent implements AfterViewInit, OnInit  {
  showQuestions = true;
  style: string;

  @ViewChild('questionsPanel') questionsPanel: QuestionsPanelComponent;

  constructor(
    private itemService: BudgetKeyItemService,
    private store: StoreService,
    private location: Location,
  ) {
    console.log(window['prefetchedItem']);
    this.handleItem(window['prefetchedItem']);
  }

  handleItem(item: any): void {
    this.store.item = item;
    const descriptor = this.itemService.getItemDescriptor(item.doc_id);
    this.store.descriptor = descriptor;
    this.style = descriptor.style;
  }

  ngOnInit(): void {
    const itemId = this.location.path().replace(/^\//, '').replace(/\/$/, '');
    const searchResultsLocation = window.location.search;
    if (searchResultsLocation) {
      const li = /li=(\d+)/;
      const match = li.exec(searchResultsLocation);
      if (match && match.length > 1) {
        const position = parseInt(match[1], 10);
        if (gtag) {
          window.setTimeout(
            () => {
              gtag('event', 'view_item', {
                'event_label': itemId,
                'value': position
              });
            }, 5000
          );
        }
      }
    }
    moment.locale('he');
    this.showQuestions = true;
    if (itemId.substr(7, 4) === "0000") this.showQuestions = false; // Remove questions from income items.
  }

  ngAfterViewInit() {
    if (window.location.hash === '#questions') {
      window.setTimeout(() => {
        this.questionsPanel.scrollToTable();
      }, 3000);
    }
  }

}
