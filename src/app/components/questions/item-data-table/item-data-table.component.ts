import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { THEME_TOKEN } from 'budgetkey-ng2-components';
import { StoreService, BudgetKeyItemService } from 'src/app/services';
import { QuestionsManager } from '../questions-manager';

@Component({
  selector: 'budgetkey-item-data-table',
  templateUrl: './item-data-table.component.html',
})
export class ItemDataTableComponent implements OnInit, OnDestroy {

  @Input() manager: QuestionsManager

  private tableState = 'hidden';

  private eventSubscriptions: any[] = [];

  private query = '';
  headers: any[] = [];
  data: any[] = [];
  total = 0;
  err: any;
  loading = false;

  constructor(
    private store: StoreService, private itemService: BudgetKeyItemService,
    @Inject(THEME_TOKEN) private ngComponentsTheme: any
  ) {
  }

  ngOnInit() {
    this.eventSubscriptions = [
      this.manager.dataQueryChange.subscribe(() => this.onStoreChanged()),
    ];
    this.onStoreChanged();
  }

  ngOnDestroy() {
    this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.eventSubscriptions = [];
  }

  toggleTable() {
    this.tableState = this.tableState === 'visible' ? 'hidden' : 'visible';
  }

  private onStoreChanged() {
    if (!this.manager.currentQuestion) {
      return;
    }
    const query = this.manager.dataQuery(this.store.item);
    if (query === this.query) {
      return;
    }
    this.query = query;
    this.headers.length = 0;
    this.data.length = 0;
    this.total = 0;
    this.loading = true;
    const headersOrder = Array.from(this.manager.currentQuestion.headers);
    const formatters = this.manager.currentQuestion.formatters;
    this.itemService.getItemData(this.query, headersOrder, formatters)
      .subscribe({
        next: (data: any) => {
          if (data && data.query === this.query) {
            this.headers = data.headers;
            this.data = data.items;
            this.total = data.total;
            this.loading = false;
            this.manager.onDataReady.emit();
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

}
