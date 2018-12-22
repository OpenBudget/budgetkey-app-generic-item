import {Component, Input, Output, OnDestroy, EventEmitter, Inject} from '@angular/core';
import * as _ from 'lodash';

import { BudgetKeyItemService, StoreService, EventsService } from '../services';
import { PreparedQuestion, PreparedQuestions } from '../model';
import { THEME_TOKEN } from 'budgetkey-ng2-components';

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

  isDropDownVisible = false;

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
  templateUrl: './item-questions.html'
})
export class ItemQuestionsComponent implements OnDestroy {

  private eventSubscriptions: any[] = [];
  isSearching: boolean;

  preparedQuestions: PreparedQuestions;
  currentQuestion: PreparedQuestion;
  redashUrl: string;
  downloadUrl: string;
  downloadUrlXlsx: string;

  isDropDownVisible = false;

  toggleDropDown() {
    this.isDropDownVisible = !this.isDropDownVisible;
    if (this.isDropDownVisible) {
      this.events.dropdownActivate.emit(this);
    }
  }

  selectQuestion(question: PreparedQuestion) {
    if (this.store.currentQuestion !== question) {
      this.store.currentQuestion = question;
      this.store.currentParameters = question.defaults;
    }
    this.isDropDownVisible = false;
  }

  private onStoreChanged() {
    if (!this.store.currentQuestion) {
      this.currentQuestion = undefined;
      this.redashUrl = '';
      this.downloadUrl = '';
      this.downloadUrlXlsx = '';
      this.isDropDownVisible = false;
      return;
    }

    this.preparedQuestions = this.store.preparedQuestions;
    this.currentQuestion = this.store.currentQuestion;
    this.redashUrl = this.itemService.getRedashUrl(this.store.dataQuery);
    this.downloadUrl =
      this.itemService.getDownloadUrl(
          this.store.dataQuery,
          'csv',
          this.store.currentQuestion.originalHeaders
      );
    this.downloadUrlXlsx =
      this.itemService.getDownloadUrl(
          this.store.dataQuery,
          'xlsx',
          this.store.currentQuestion.originalHeaders
      );
    this.isSearching = true;
  }

  get currentParameters() {
    return this.store.currentParameters;
  }
  setParameter(key: string, value: string) {
    const params = _.clone(this.store.currentParameters);
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
      this.store.onDataReady.subscribe(() => {this.isSearching = false; })
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
  templateUrl: './item-data-table.html',
})
export class ItemDataTableComponent implements OnDestroy {

  private tableState = 'hidden';

  private eventSubscriptions: any[] = [];

  private query = '';
  headers: any[] = [];
  data: any[] = [];
  total = 0;
  err: any;
  loading = false;

  toggleTable() {
    this.tableState = this.tableState === 'visible' ? 'hidden' : 'visible';
  }

  private onStoreChanged() {
    if (!this.store.currentQuestion) {
      return;
    }
    const query = this.store.dataQuery;
    if (query === this.query) {
      return;
    }
    this.query = query;
    this.headers.length = 0;
    this.data.length = 0;
    this.total = 0;
    this.loading = true;
    const headersOrder = Array.from(this.store.currentQuestion.headers);
    const formatters = this.store.currentQuestion.formatters;
    this.itemService.getItemData(this.query, headersOrder, formatters)
      .subscribe({
        next: (data: any) => {
          if (data && data.query === this.query) {
            this.headers = data.headers;
            this.data = data.items;
            this.total = data.total;
            this.loading = false;
            this.store.onDataReady.emit();
          }
        },
        error: (err) => {
          console.log('err', err);
          this.headers.length = 0;
          this.data.length = 0;
          this.total = 0;
          this.err = err;
          this.loading = false;
        }
      });
  }

  constructor(private store: StoreService, private itemService: BudgetKeyItemService,
              @Inject(THEME_TOKEN) private ngComponentsTheme: any) {
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
