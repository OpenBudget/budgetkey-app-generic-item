import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import * as _ from 'lodash';
import { format_number } from '../../pipes';

@Component({
  selector: 'budgetkey-contract-payments',
  template: `<div #container></div>
  `,
  styles: [
    `
    div {
      width: 100%;
      position: relative;
    }
    ::ng-deep rect {
      stroke: none;
      fill: #512C0A;
    }
    ::ng-deep rect.bar-bg {
      opacity: 0.15;
    }
    ::ng-deep rect.bar-bg:nth-child(2n+1) {
      fill: none;
    }
    ::ng-deep rect.bar-executed {
      opacity: 0.5;	
    }
    ::ng-deep rect.bar-diff {
      opacity: 1;	
    }
    ::ng-deep .text-year {
      text-anchor: end;
      fill: #512C0A;
      font-family: "Abraham TRIAL";	
      font-size: 18;
    }
    ::ng-deep .text-amount {
      position: absolute;
      display: inline-block;
      text-align: center;
      color: #512C0A;	
      font-family: "Abraham TRIAL";	
      font-size: 18px;
    }
    ::ng-deep .grid {
      stroke-width: 1;
      stroke: #512C0A;	
      opacity: 0.25;
    }
    ::ng-deep .grid-25 {
      stroke-dasharray: 2, 8;
    }
    ::ng-deep .grid-75 {
      stroke-dasharray: 2, 8;
    }
    ::ng-deep .grid-50 {
      stroke-dasharray: 2, 4;
    }
    ::ng-deep .grid-text {
      text-anchor: end;
      opacity: 0.5;	
      color: #512C0A;	
      font-family: "Abraham TRIAL";	
      font-size: 12px;
    }
    `
  ]
})
export class ContractPaymentsChartComponent implements AfterViewInit {

  @Input() public payments: any;
  @ViewChild('container') container: ElementRef;

  HEIGHT = 350;
  TEXT_SIZE = 24;

  private width: number;
  private data: any[];
  private x: ScaleLinear<number, number>;
  private y: ScaleLinear<number, number>;

  constructor() {}

  ngAfterViewInit () {
    this.width = this.container.nativeElement.offsetWidth;
    this.data = _.filter(
      this.payments,
      (p) => p.selected
    );
    if (this.data.length === 0) { return; }
    let volume = this.data[this.data.length - 1].volume;
    if (volume <= 0) { return; }
    let max = _.max(_.map(this.data, (p) => p.executed));
    max = _.max([max, volume]);
    this.x = scaleLinear()
             .domain([0, this.data.length])
             .range([0, this.width]);
    this.y = scaleLinear()
             .domain([0, max])
             .range([this.HEIGHT - this.TEXT_SIZE, this.TEXT_SIZE]);

    let svg = select(this.container.nativeElement)
              .append('svg')
              .attr('width', this.width + 'px')
              .attr('height', this.HEIGHT + 'px');
    svg.selectAll('.bar-bg')
       .data(this.data, (p) => p.timestamp)
       .enter()
       .append('rect')
       .attr('class', 'bar-bg')
       .attr('x', (p, i) => this.x(i))
       .attr('width', (p, i) => (this.x(i + 1) - this.x(i)))
       .attr('y', (p) => this.y(volume))
       .attr('height', (p) => (this.y(0) - this.y(volume)));
    svg.selectAll('.grid')
       .data([0, 25, 50, 75, 100])
       .enter()
       .append('line')
       .attr('class', (d) => 'grid grid-' + d)
       .attr('x1', this.x(0))
       .attr('x2', this.x(this.data.length))
       .attr('y1', (d) => this.y(volume * d / 100))
       .attr('y2', (d) => this.y(volume * d / 100))
    svg.selectAll('.grid-text')
       .data([50, 100])
       .enter()
       .append('text')
       .attr('class', (d) => 'grid-text')
       .attr('x', this.x(0))
       .attr('y', (d) => this.y(volume * d / 100))
       .attr('dy', 12)
       .text((d) => d + '%');
    svg.selectAll('.bar-executed')
       .data(this.data, (p) => p.timestamp)
       .enter()
       .append('rect')
       .attr('class', 'bar-executed')
       .attr('x', (p, i) => this.x(i))
       .attr('width', (p, i) => (this.x(i + 1) - this.x(i)))
       .attr('y', (p) => this.y(p.executed))
       .attr('height', (p) => (this.y(0) - this.y(p.executed)));
    svg.selectAll('.bar-diff')
       .data(this.data, (p) => p.timestamp)
       .enter()
       .append('rect')
       .attr('class', 'bar-diff')
       .attr('x', (p, i) => this.x(i))
       .attr('width', (p, i) => (this.x(i + 1) - this.x(i)))
       .attr('y', (p) => this.y(p.executed))
       .attr('height', (p) => (this.y(p.executed - p.diff) - this.y(p.executed)));
    svg.selectAll('.text-year')
       .data(this.data, (p) => p.timestamp)
       .enter()
       .append('text')
       .attr('class', 'text-year')
       .attr('x', (p, i) => this.x(i))
       .attr('y', (p) => this.y(0))
       .attr('dy', this.TEXT_SIZE)
       .text((p) => p.period === '1' ? p.year : null)
    select(this.container.nativeElement).append('span')
       .attr('class', 'text-amount')
       .style('left', this.x(this.data.length - 1) + 'px')
       .style('top',
              (p) => (this.y(this.data[this.data.length - 1].executed) - this.TEXT_SIZE) + 'px')
       .style('width', (p) => (this.x(1) - this.x(0)) + 'px')
       .html((p) => format_number(this.data[this.data.length - 1].executed) + '₪');
  }
}
