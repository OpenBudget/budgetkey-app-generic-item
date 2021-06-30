import {Component, ViewChild, ElementRef, Input, OnInit, OnChanges, AfterViewInit} from '@angular/core';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

declare const Plotly: any;
declare const window: any;

@Component({
  selector: 'budgetkey-chart-plotly',
  template: `
    <div style="direction: ltr" #plot>
    </div>
  `, styles: [`
  :host {
    display: block;
  }
  `]
})
export class PlotlyChartComponent implements OnChanges, AfterViewInit {

  @Input() public data: any;
  @Input() public layout: any;

  @ViewChild('plot') plot: ElementRef;

  private ready = new ReplaySubject(1);

  constructor(private location: Location) {
  }

  ngAfterViewInit() {
    this.ready.next();
  }

  ngOnChanges() {
    this.ready.pipe(first()).subscribe(() => { this.checkPlotly(); });;
  }

  checkPlotly() {
    if (window['Plotly']) {
      const layout = Object.assign({
        height: 600,
        font: {
          size: 10
        }
      }, this.layout);

      Plotly.newPlot(this.plot.nativeElement, this.data, layout, {responsive: true});
    } else {
      setTimeout(() => this.checkPlotly(), 100);
    }
  }
}
