import { Component, Input } from '@angular/core';

@Component({
  selector: 'budgetkey-chart-router',
  template: `
    <budgetkey-chart-plotly     *ngIf="chart.type == 'plotly'"
        [data]="chart.chart" 
        [layout]="chart.layout"
    ></budgetkey-chart-plotly>
    <budgetkey-chart-mushonkey  *ngIf="chart.type == 'mushonkey'"
        [data]="chart.chart" 
    ></budgetkey-chart-mushonkey>
`
})
export class ChartRouterComponent {

  @Input() public chart: any;

  constructor() {
  }
}
