import { Component, OnDestroy } from '@angular/core';
import * as _ from 'lodash';

import { BudgetKeyItemService, StoreService } from '../services';
import { PreparedQuestion, PreparedQuestions } from '../model';

@Component({
  selector: 'budgetkey-item-data',
  template: `
    <div class="row">
      <div class="col-xs-1"></div>
      <div class="col-xs-10">
        <budgetkey-item-questions></budgetkey-item-questions>
        <budgetkey-item-data-table></budgetkey-item-data-table>
      </div>
      <div class="col-xs-1"></div>
    </div>
  `
})
export class ItemDataComponent {
}

@Component({
  selector: 'budgetkey-item-questions',
  template: `
    <div>
      <ng-container *ngFor="let fragment of currentQuestion.parsed">
        <span *ngIf="fragment.isText">{{ fragment.value }}</span>
        <select *ngIf="fragment.isParameter" 
          [value]="currentParameters[fragment.name]" 
          (change)="setParameter(fragment.name, $event.target.value)"
        >
          <option *ngFor="let pair of fragment.values | pairs" [value]="pair[0]">{{ pair[0] }}</option>
        </select>
      </ng-container>
    </div>
    <div>
      <div *ngFor="let question of preparedQuestions">
        <ng-container *ngFor="let fragment of question.parsed">
          <span *ngIf="fragment.isText">{{ fragment.value }}</span>
          <strong *ngIf="fragment.isParameter">{{ fragment.value }}</strong>
        </ng-container>
      </div>
    </div>
  `
})
export class ItemQuestionsComponent implements OnDestroy {

  private eventSubscriptions: any[] = [];

  preparedQuestions: PreparedQuestions;
  currentQuestion: PreparedQuestion;

  private onStoreChanged() {
    this.preparedQuestions = this.store.preparedQuestions;
    this.currentQuestion = this.store.currentQuestion;
  }

  get currentParameters() {
    return this.store.currentParameters;
  }
  setParameter(key: string, value: string) {
    let params = _.clone(this.store.currentParameters);
    params[key] = value;
    this.store.currentParameters = params;
  }

  constructor(private store: StoreService) {
    this.eventSubscriptions = [
      this.store.itemChange.subscribe(() => this.onStoreChanged()),
      this.store.preparedQuestionsChange.subscribe(() => this.onStoreChanged()),
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
  template: `
    <div>
      <table class="table">
        <tr *ngFor="let row of data">
          <td *ngFor="let value of row">{{ value }}</td>
        </tr>
      </table>
    </div>
  `
})
export class ItemDataTableComponent {

  private eventSubscriptions: any[] = [];

  private query: string = '';
  private data: any = [];

  private onStoreChanged() {
    let query = this.store.dataQuery;
    if (query !== this.query) {
      this.query = query;
      this.itemService.getItemData(this.query).then((data: any) => {
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
