import {Component, ViewChild, ElementRef, Input, OnInit, OnChanges, AfterViewInit} from '@angular/core';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import * as Plotly from 'plotly.js-dist';

// declare const Plotly: any;
// declare const window: any;

@Component({
  selector: 'budgetkey-chart-plotly',
  templateUrl: './plotly-chart.html',
  styleUrls: ['./plotly-chart.less'],
  host: {
    '[class.enlarged]': 'enlarged'
  }
})
export class PlotlyChartComponent implements OnChanges, AfterViewInit {

  @Input() public data: any;
  @Input() public layout: any;

  @ViewChild('plot') plot: ElementRef;
  @ViewChild('wrapper') wrapper: ElementRef;

  _enlarged = false;

  private ready = new ReplaySubject(1);

  constructor(private location: Location) {
  }

  ngAfterViewInit() {
    this.ready.next();
  }

  ngOnChanges() {
    this.ready.pipe(first()).subscribe(() => { this.checkPlotly(); });;
  }

  checkPlotly(big?: boolean) {
    // if (window['Plotly']) {
    const wrapper = this.wrapper.nativeElement as HTMLDivElement;
    const el = this.plot.nativeElement as HTMLDivElement;
    const layout = Object.assign({
      height: 600,
      font: {
        size: 10
      }
    }, this.layout);
    if (big) {
      layout.height = wrapper.offsetHeight - 80;
      layout.width = wrapper.offsetWidth - 80;
    }

    el.innerHTML = '';
    Plotly.newPlot(el, this.data, layout, {responsive: true});
    el.querySelectorAll('svg').forEach((svg) => {
      svg.setAttribute('alt', this.data.title || 'diagram');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', this.data.title || 'diagram');
    });
    // } else {
    //   setTimeout(() => this.checkPlotly(), 100);
    // }
  }

  set enlarged(value: boolean) {
    this._enlarged = value;
    setTimeout(() => {
      this.checkPlotly(value);
    }, 0);
  }

  get enlarged(): boolean {
    return this._enlarged;
  }
}
