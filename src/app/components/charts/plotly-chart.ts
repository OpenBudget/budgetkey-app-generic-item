import {Component, ViewChild, ElementRef, Input, OnInit} from '@angular/core';
import { Location } from '@angular/common';

declare const Plotly: any;
declare const window: any;

@Component({
  selector: 'budgetkey-chart-plotly',
  template: `
    <p *ngIf="firstYear < lastYear" > תקציב זה פעיל בין השנים : {{firstYear}} - {{ lastYear }}  </p>
    <p *ngIf="firstYear === lastYear" > תקציב זה פעיל בשנת: {{firstYear}} בלבד  </p>
    <div style="direction: ltr" #plot>
    </div>
  `
})
export class PlotlyChartComponent implements OnInit {

  @Input() public data: any;
  @Input() public layout: any;

  // Describe the range of years the budget item was active.
  firstYear: number;
  lastYear: number;

  @ViewChild('plot') plot: ElementRef;

  constructor(private location: Location) {
  }

  ngOnInit() {
    this.checkPlotly();
  }

  checkPlotly() {
    if (window['Plotly']) {
      const layout = Object.assign({
        height: 600,
        font: {
          size: 10
        }
      }, this.layout);

      this.itemYearsRange();
      Plotly.plot(this.plot.nativeElement, this.data, layout);
    } else {
      setTimeout(() => this.checkPlotly(), 100);
    }
  }
  // Get the active years range of budget item.
  itemYearsRange() {
    // Budeget years (first graph - x col) array length.
    length = this.data[0].x.length;

    // Get the beginning and end of active years to displayable variables.
    this.firstYear = this.data[0].x[0];
    this.lastYear = this.data[0].x[length - 1];
  }
}
