import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BudgetKeyItemService, StoreService } from './services';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';

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
        <div class='desktop-notification'>
          <img src='assets/img/desktop.svg' title='Computer by Juan Manuel Corredor from the Noun Project'/>
          <span>
              מידע ונתונים נוספים זמינים בגרסת הדסקטופ
          </span>
          <a class="btn btn-primary btn-lg"
             [href]="mailto()" target='_blank'>
             <i class='glyphicon glyphicon-share-alt'></i>&nbsp;
             שלחו לעצמכם תזכורת או שתפו
          </a>
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

    .desktop-notification img {
      width: 90px;
    }

    .desktop-notification span {
      display: inline-block;
      padding: 10px 0;
    }

    .desktop-notification a {
      background-color: #734DE5;
    }

    .desktop-notification a i {
      transform: scaleX(-1);
    }
  
  `],
  providers: [
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
})
export class AppComponent implements AfterViewInit  {
  loaded: boolean = true;
  style: string;

  @ViewChild('questionsPanel') questionsPanel: ElementRef;
  @ViewChild('dataTable') dataTable: ElementRef;

  scrollToTable() {
    if (_.isObject(window) && _.isFunction(window.scrollTo)) {
      let questionsPanelBounds = this.questionsPanel.nativeElement.getBoundingClientRect();
      if (questionsPanelBounds.bottom === window.innerHeight) {
        let dataTableBounds = this.dataTable.nativeElement.getBoundingClientRect();
        let questionsPanelHeight = questionsPanelBounds.bottom - questionsPanelBounds.top;
        window.scrollTo({left: 0, top: window.scrollY + dataTableBounds.top - questionsPanelHeight, behavior: 'smooth'});
      }
    }
  }

  constructor(
    private itemService: BudgetKeyItemService, 
    private store: StoreService,
    private location: Location
  ) {
    if (window['prefetchedItem']) {
      console.log(window['prefetchedItem']);
      this.handleItem(window['prefetchedItem']);
      this.loaded = true;
    } else {
      this.loaded = false;
    }
  }

  handleItem(item: any): void {
    this.store.item = item;
    this.itemService.getItemDescriptor(item.doc_id)
      .then(descriptor => {
        this.store.descriptor = descriptor;
        this.style = descriptor.style;
        this.loaded = true;
      });
  }

  ngOnInit(): void {
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
    if (!window['prefetchedItem']) {
      this.itemService.getItem(itemId)
        .then(item => { this.handleItem(item); });
    }
    moment.locale('he');
  }

  ngAfterViewInit() {
    if (window.location.hash === '#questions') {
      window.setTimeout(() => {
        this.scrollToTable();
      }, 3000);
    }
  }

  mailto() {
    const subject = 'קישור למידע מאתר "המפה החברתית"';
    const body = `שלום.

העמוד ״${document.title}״ נשלח אליכם ממכשיר נייד.
לחצו כאן לצפייה בעמוד: ${window.location.href}`;
    return 'mailto:?' +
      'subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body)
    ;
  }

}
