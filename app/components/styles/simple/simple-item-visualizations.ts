  import {Component, OnDestroy} from '@angular/core';
import {Item} from '../../../model/item';
import {StoreService} from '../../../services/store';


@Component({
  selector: 'simple-item-visualizations',
  template: `
    <div class="budgetkey-item-visualizations-wrapper row" *ngIf="item.charts">
      <div class="tabs">
        <div *ngFor="let tab of charts"
             [ngClass]="{active: tab == current}">
          <a href="javascript:void(0)" 
             (click)="showTab(tab)">{{ tab.title }}</a>          
        </div>
      </div>  
      <div class="tab-contents" *ngIf="chart">
        <ng-container *ngIf="!subcharts">
          <ng-container *ngFor="let tab of charts">
            <budgetkey-chart-router [chart]="chart" *ngIf="tab == current">
            </budgetkey-chart-router>
          </ng-container>
        </ng-container>
        <div class="subtabs" *ngIf="subcharts">
          <div *ngFor="let subtab of subcharts"
              [ngClass]="{active: subtab === currentSub}">
            <a href="javascript:void(0)" 
              (click)="showSubTab(subtab)" 
              [innerHtml]="subtab.title"></a>          
          </div>
          <ng-container *ngFor="let subtab of subcharts">
            <budgetkey-chart-router [chart]="chart" *ngIf="subtab == currentSub">
            </budgetkey-chart-router> 
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class SimpleItemVisualizationsComponent {

  private item: Item;

  private current: any = null;
  private currentSub: any = null;

  private charts: any = {};
  private subcharts: any = null;
  private chart: any = {};

  ngOnInit() {
    this.item = this.store.item;
    this.charts = {};
    this.current = null;
    this.charts = this.item.charts;
    if (this.charts) {
      this.showTab(this.charts[0]);
    }
  }

  showTab(selectedChart: any) {
    if (this.current === selectedChart) {
      return;
    }
    this.current = selectedChart;
    if (this.current.subcharts) {
      this.subcharts = this.current.subcharts;
      this.currentSub = this.current.subcharts[0];
      this.chart = this.currentSub;
    } else {
      this.chart = selectedChart;
      this.subcharts = null;
      this.currentSub = null;
      console.log(this.chart);
    }
  }

  showSubTab(subtab: string) {
    this.currentSub = subtab;
  }

  constructor(private store: StoreService) {
  }

}
