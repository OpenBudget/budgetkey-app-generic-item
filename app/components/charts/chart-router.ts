import { Component, Input } from '@angular/core';

@Component({
  selector: 'budgetkey-chart-router',
  template: `
    <budgetkey-chart-plotly               *ngIf="chart.type == 'plotly'"
        [data]="chart.chart" 
        [layout]="chart.layout"
    ></budgetkey-chart-plotly>
    <budgetkey-chart-mushonkey            *ngIf="chart.type == 'mushonkey'"
        [data]="chart.chart" 
    ></budgetkey-chart-mushonkey>
    <budgetkey-chart-horizontal-barchart  *ngIf="chart.type == 'horizontal-barchart'"
        [data]="chart.chart" 
    ></budgetkey-chart-horizontal-barchart>
    <budgetkey-chart-adamkey              *ngIf="chart.type == 'adamkey'"
        [data]="chart.chart" 
    ></budgetkey-chart-adamkey>
    <budgetkey-chart-template             *ngIf="chart.type == 'template'"
        [data]="chart.chart" 
    ></budgetkey-chart-template>
    <budgetkey-horizontal-layout          *ngIf="chart.type == 'horizontal'"
            [data]="chart.chart" 
    ></budgetkey-horizontal-layout>
    <budgetkey-vertical-layout            *ngIf="chart.type == 'vertical'"
            [data]="chart.chart" 
    ></budgetkey-vertical-layout>
    <budgetkey-chart-pointatron            *ngIf="chart.type == 'pointatron'"
            [data]="chart.chart" 
    ></budgetkey-chart-pointatron>
    <budgetkey-chart-comparatron            *ngIf="chart.type == 'comparatron'"
            [data]="chart.chart" 
    ></budgetkey-chart-comparatron>
`
})
export class ChartRouterComponent {

  @Input() public chart: any;

  constructor() {
  }
}
