import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { THEME_TOKEN } from 'budgetkey-ng2-components';
import { StoreService, BudgetKeyItemService } from 'src/app/services';
import { QuestionsManager } from '../questions-manager';

@Component({
  selector: 'budgetkey-item-data-table',
  templateUrl: './item-data-table.component.html',
  styleUrls: ['./item-data-table.component.less'],
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
  graphAvailable = true;
  graphSelected = true;
  graphLayout: any;
  graphData: any;

  constructor(
    private store: StoreService, private itemService: BudgetKeyItemService,
    @Inject(THEME_TOKEN) private ngComponentsTheme: any
  ) {
  }

  ngOnInit() {
    this.eventSubscriptions = [
      this.manager.dataQueryChange.subscribe(() => this.onDataLoading()),
      this.manager.dataReady.subscribe((ev) => this.onDataReady(ev)),
    ];
  }

  ngOnDestroy() {
    this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.eventSubscriptions = [];
  }

  toggleTable() {
    this.tableState = this.tableState === 'visible' ? 'hidden' : 'visible';
  }

  private onDataLoading() {
    this.headers.length = 0;
    this.data.length = 0;
  }

  private onDataReady(ev) {
    const {headers, data, err, total, graphData, graphLayout} = ev;
    this.headers = headers;
    this.data = data;
    this.err = err;
    this.total = total;
    this.graphData = graphData;
    this.graphLayout = graphLayout;
    if (headers.length) {
      if (!graphLayout) {
        this.graphAvailable = false;
        this.graphSelected = false;  
      } else {
        this.graphAvailable = true;
        this.graphSelected = true; 
      }
    }
  }
}
