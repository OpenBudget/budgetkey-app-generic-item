import {Component, OnDestroy} from '@angular/core';
import {Item} from '../model/item';
import {StoreService} from '../services/store';


@Component({
  selector: 'budgetkey-item-visualizations',
  template: `
    <div class="budgetkey-item-visualizations-wrapper row" *ngIf="item.charts">
      <div class="col-xs-1"></div>
      <div class="col-xs-10">
        <div class="tabs text-center">
          <a href="javascript:void(0)"
            *ngFor="let tab of tabs" [ngClass]="{active: tab == current}"
            (click)="showTab(tab)">{{ tab }}</a>
        </div>
      </div>
      <div class="col-xs-1"></div>
      <div class="tab-contents col-xs-12">
        <ng-container *ngFor="let tab of tabs">
          <div *ngIf="tab == current">
            <budgetkey-plotly-chart [data]="charts[current].data" [layout]="charts[current].layout"
            ></budgetkey-plotly-chart>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class ItemVisualizationsComponent implements OnDestroy {

  private eventSubscriptions: any[] = [];

  private item: Item;

  private current: string = null;
  private tabs: string[] = [];
  private charts: object = {};

  ngOnInit() {
  }

  showTab(tab: string) {
    this.current = tab;
  }

  constructor(private store: StoreService) {
    this.eventSubscriptions = [
      this.store.itemChange.subscribe(() => this.onStoreChanged()),
    ];
    this.onStoreChanged();
  }

  ngOnDestroy() {
    this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.eventSubscriptions = [];
  }

  private onStoreChanged() {
    this.item = this.store.item;
    this.tabs = [];
    this.charts = {};
    this.current = null;
    if (this.item.charts) {
      for (let chart of this.item.charts) {
        this.tabs.push(chart.title);
        this.charts[chart.title] = {
          data: chart.chart,
          layout: chart.layout || {}
        };
      }
      this.showTab(this.tabs[0]);
    }
  }
}
