  import {Component, OnInit} from '@angular/core';
import {Item} from '../../../model/item';
import {StoreService} from '../../../services/store';


@Component({
  selector: 'simple-item-visualizations',
  template: `
    <div class="budgetkey-item-visualizations-wrapper row" *ngIf="item.charts">
      <div class="tabs" *ngIf="charts.length > 1">
        <div class="tabs-row" (scroll)='tabsScroll($event)'>
          <ng-container>
            <div *ngFor="let tab of charts"
                class="tab-header"
                [ngClass]="{active: tab == current}"
                (click)="showTab(tab)">
                <span class='tab-title' 
                      (click)="showTab(tab)">
                      {{ tab.title }}
                </span> 
            </div>
          </ng-container>
        </div>
      </div>  
      <div class="tab-contents" *ngIf="chart">
        <div class="chart-title" [innerHtml]="current['long_title'] || current.title"></div>
        <div class="chart-description" *ngIf="current.description"
             [innerHtml]="current.description"></div>
        <div class="subtabs" *ngIf="subcharts">
          <div class="subtab-row">
            <div class="subtab" *ngFor="let subtab of subcharts"
                [ngClass]="{active: subtab === currentSub}"
                (click)="showSubTab(subtab)">
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

  private charts: any = [];
  private subcharts: any = null;
  private chart_: any = null;

  ngOnInit() {
    this.item = this.store.item;
    this.charts = {};
    this.current = null;
    this.charts = this.item.charts;
    if (this.charts && this.charts.length > 0) {
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
    }
  }

  showSubTab(subtab: any) {
    this.currentSub = subtab;
    this.chart = this.currentSub;
  }

  public set chart(chart: any) {
    this.chart_ = chart;
  }

  public get chart(): any {
    return this.chart_;
  }

  constructor(private store: StoreService) {
  }

  tabsScroll(event: any) {
    const center = event.target.offsetWidth / 2;
    const scrollCenter = event.target.scrollLeft + center;
    const itemWidth = event.target.scrollWidth / this.charts.length;
    const visibleItem = this.charts.length - Math.floor(scrollCenter / itemWidth) - 1;
    this.showTab(this.charts[visibleItem]);
  }

}
