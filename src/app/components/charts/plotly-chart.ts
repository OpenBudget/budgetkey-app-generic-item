import {Component, ViewChild, ElementRef, Input, OnInit} from '@angular/core';
import { Location } from '@angular/common';

declare const Plotly: any;
declare const window: any;

@Component({
  selector: 'budgetkey-chart-plotly',
  template: `
    <div style="direction: ltr" #plot>
    </div>
  `
})
export class PlotlyChartComponent implements OnInit {

  @Input() public data: any;
  @Input() public layout: any;

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

      Plotly.plot(this.plot.nativeElement, this.data, layout);
    } else {
      setTimeout(() => this.checkPlotly(), 100);
    }
  }
}
