  import {Component, OnDestroy, OnInit} from '@angular/core';
import {Item} from '../../../model/item';
import {StoreService} from '../../../services/store';


@Component({
  selector: 'simple-item-visualizations',
  template: `
    <div class="budgetkey-item-visualizations-wrapper row" *ngIf="item.charts">
      <div class="tabs">
        <div class="row">
          <div *ngFor="let tab of charts"
              [style.width]="(100 / charts.length) + '%'"
              class="tab-header"
              [ngClass]="{active: tab == current}">
              <a href="javascript:void(0)" 
              (click)="showTab(tab)">{{ tab.title }}</a>          
             </div>
        </div>
      </div>  
      <div class="tab-contents" *ngIf="chart">
        <div class="chart-title" [innerHtml]="current['long_title'] || current.title"></div>
        <div class="subtabs" *ngIf="subcharts">
          <div class="subtab-row">
            <div class="subtab" *ngFor="let subtab of subcharts"
                [ngClass]="{active: subtab === currentSub}"
                (click)="showSubTab(subtab)"
                [style.width]="(100 / subcharts.length) + '%'">
                <input type="radio" [checked]="subtab === currentSub"/>
                <label [innerHtml]="subtab.title"></label>
            </div>
          </div>
        </div>
        <ng-container *ngIf="!subcharts">
          <ng-container *ngFor="let tab of charts">
            <budgetkey-chart-router [chart]="chart" *ngIf="tab == current">
            </budgetkey-chart-router>
          </ng-container>
        </ng-container>
        <ng-container *ngIf="subcharts">
          <ng-container *ngFor="let subtab of subcharts">
            <ng-container *ngIf="subtab == currentSub">
              <div class="subtab-title" *ngIf="subtab.long_title" [innerHtml]="subtab.long_title"></div>
              <budgetkey-chart-router [chart]="chart">
              </budgetkey-chart-router> 
            </ng-container>
          </ng-container>
        </ng-container>
      </div>
    </div>
  `
})
export class SimpleItemVisualizationsComponent implements OnInit {

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
