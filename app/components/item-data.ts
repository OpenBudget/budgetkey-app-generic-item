import { Component, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/core';
import * as _ from 'lodash';

import { BudgetKeyItemService, StoreService, EventsService } from '../services';
import { PreparedQuestion, PreparedQuestions } from '../model';

@Component({
  selector: 'item-questions-parameter',
  template: `
    <div class="item-questions-parameter">
      <span class="value" (click)="toggleDropdown()">{{ value }}</span>
      <ul class="values" *ngIf="isDropDownVisible">
        <li *ngFor="let item of values" (click)="setValue(item)"
          [ngClass]="{selected: item === value}">{{ item }}</li>
      </ul>
    </div>
  `,
  styles: [`
    .item-questions-parameter {
      position: relative;      
    }
    
    .item-questions-parameter .value {
      cursor: pointer;
    }
  `]
})
export class ItemQuestionParameterComponent implements OnDestroy {
  private eventSubscriptions: any[] = [];

  @Input() public value: any;
  @Input() public values: any[];
  @Output() public change = new EventEmitter<any>();

  private isDropDownVisible: boolean = false;

  constructor(private events: EventsService) {
    this.eventSubscriptions = [
      this.events.dropdownActivate.subscribe(
        (dropdown: any) => {
          if (dropdown !== this) {
            this.isDropDownVisible = false;
          }
        }
      ),
    ];
  }

  toggleDropdown() {
    this.isDropDownVisible = !this.isDropDownVisible;
    if (this.isDropDownVisible) {
      this.events.dropdownActivate.emit(this);
    }
  }

  setValue(value: any) {
    this.value = value;
    this.isDropDownVisible = false;
    this.change.emit(this.value);
  }

  ngOnDestroy() {
    this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.eventSubscriptions = [];
  }

}

@Component({
  selector: 'budgetkey-item-questions',
  template: require('./item-questions.html')
})
export class ItemQuestionsComponent implements OnDestroy {

  private eventSubscriptions: any[] = [];
  private isSearching: boolean;

  preparedQuestions: PreparedQuestions;
  currentQuestion: PreparedQuestion;
  redashUrl: string;
  downloadUrl: string;

  private isDropDownVisible: boolean = false;

  toggleDropDown() {
    this.isDropDownVisible = !this.isDropDownVisible;
    if (this.isDropDownVisible) {
      this.events.dropdownActivate.emit(this);
    }
  }

  selectQuestion(question: PreparedQuestion) {
    this.store.currentQuestion = question;
    this.store.currentParameters = question.defaults;
    this.isDropDownVisible = false;
  }

  private onStoreChanged() {
    this.preparedQuestions = this.store.preparedQuestions;
    this.currentQuestion = this.store.currentQuestion;
    this.redashUrl = this.itemService.getRedashUrl(this.store.dataQuery);
    this.downloadUrl = this.itemService.getDownloadCSVUrl(this.store.dataQuery);
    this.isSearching = true;
  }

  get currentParameters() {
    return this.store.currentParameters;
  }
  setParameter(key: string, value: string) {
    let params = _.clone(this.store.currentParameters);
    params[key] = value;
    this.store.currentParameters = params;
  }

  constructor(
    private itemService: BudgetKeyItemService, private store: StoreService,
    private events: EventsService
  ) {
    this.eventSubscriptions = [
      this.store.itemChange.subscribe(() => this.onStoreChanged()),
      this.store.preparedQuestionsChange.subscribe(() => this.onStoreChanged()),
      this.store.dataQueryChange.subscribe(() => this.onStoreChanged()),
      this.events.dropdownActivate.subscribe(
        (dropdown: any) => {
          if (dropdown !== this) {
            this.isDropDownVisible = false;
          }
        }
      ),
      this.store.onDataReceived.subscribe(() => {this.isSearching = false; })
    ];
    this.onStoreChanged();
  }

  ngOnDestroy() {
    this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.eventSubscriptions = [];
  }

}

@Component({
  selector: 'budgetkey-item-data-table',
  template: require('./item-data-table.html'),
  animations: [
    trigger('showTableAnimation', [
      state('hidden', style({
        height: '50vh'
      })),
      state('visible', style({
        height: '50vh'
      })),
      transition('hidden <=> visible', animate('500ms ease-in')),
    ]),
  ]
})
export class ItemDataTableComponent {

  private tableState = 'hidden';

  private eventSubscriptions: any[] = [];

  private query: string = '';
  private headers: any[] = [];
  private data: any[] = [];
  private err: any;

  toggleTable() {
    this.tableState = this.tableState === 'visible' ? 'hidden' : 'visible';
  }

  private onStoreChanged() {
    let query = this.store.dataQuery;
    let headers = this.store.currentQuestion.headers;
    if (query !== this.query) {
      this.query = query;
      this.headers = headers;
      this.itemService.getItemData(this.query,this.headers)
        .then((data: any) => {
          if (data.query === this.query) {
            //this.headers = data.headers;
            this.data = data.items;
          }
        })
        .catch((err) => {
          this.headers.length = 0;
          this.data.length = 0;
          this.err = err;
        })
        .done(() => {
          this.store.onDataReceived.emit();
        });

      this.itemService.getItemData(this.query,this.headers).then((data: any) => {
        if (data.query === this.query) {
          this.data = data.items;
        }
      });
    }
  }

  constructor(private store: StoreService, private itemService: BudgetKeyItemService) {
    this.eventSubscriptions = [
      this.store.dataQueryChange.subscribe(() => this.onStoreChanged()),
    ];
    this.onStoreChanged();
  }

  ngOnDestroy() {
    this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.eventSubscriptions = [];
  }

}
