import { Component, Input, OnInit } from '@angular/core';

import { hierarchy, pack } from 'd3-hierarchy';

@Component({
  selector: 'budgetkey-chart-comparatron',
  template: `
<div class='big-container'>
<div>
<div class='comparatron-container'
  [style.height]='HEIGHT + "px"'>
  <div class='main-bar'
    [style.top]='data.main.top + "px"'>
    <div class='main-amount'>{{ data.main.amount_fmt }}</div>
    <div class='main-rect'
         [style.background-color]='data.main.color'
         [style.height]='data.main.height + "px"'>
    </div>
  </div>

  <div class='compare-bar'
    [style.top]='(data.compare.top - 15) + "px"'>
    <div class='compare-text'>
      <div>
      <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
          class="compare-line"
          viewBox="0 0 125 20" width="125" height="20">
        <path d="M0 15 L125 15"></path>
      </svg>
      <span class="median-icon"></span>
        <span class='compare-amount'>{{ data.compare.amount_fmt }}</span>
      </div>
      <span class='compare-label' [innerHtml]="data.compare.label"></span>
    </div>
  </div>
</div>
<div class='main-label'>
  {{ data.main.label }}
</div>
</div>
</div>
  `,
  styles: [
    `
    .big-container {
      display:flex;
      align-items: center;
      flex-flow: column;
      margin-top: 30px;
    }

    .comparatron-container {
      width: 400px;
      position: relative;
      border-bottom: 1px solid #979797;
    }

    .main-bar {
      position: absolute;
      width: 100px;
      right: 50px;
    }

    .main-amount {
      text-align: center;
      color: #3C4948;
      font-family: "Miriam Libre";
      font-size: 18px;
      font-weight: bold;
      line-height: 24px;
      white-space: nowrap;
    }

    .main-rect {
      width: 100%;
      background-color: #FFAE90;
      border: 1px solid #FFAE90;
    }

    .main-label {
      margin-right: 50px;
      margin-top: 15px;
      width: 100px;
      text-align: center;
      color: #3C4948;
      font-family: "Abraham TRIAL";
      font-size: 14px;
    }

    .compare-bar {
      position: absolute;
      right: 50px;
    }

    .compare-text {
      display: inline-block;
    }

    .compare-amount {
      color: #4A4A4A;
      font-family: "Miriam Libre";
      font-size: 14px;
      font-weight: bold;
    }

    .compare-label {
      display: block;
      color: #757575;
      font-family: "Abraham TRIAL";
      font-size: 12px;
      text-indent: 145px;

    }

    ::ng-deep .bk-tooltip {
      text-indent: 0px;
    }

    svg {
      display: inline-block;
    }

    path {
      stroke: black;
      stroke-dasharray: 5 3;
    }
    `
  ]
})
export class ComparatronChartComponent implements OnInit {

  @Input() public data: any;

  HEIGHT = 250;
  TEXT_SIZE = 24;

  constructor() {}

  ngOnInit() {
    const max_num =
      this.data.compare.amount > this.data.main.amount ?
          this.data.compare.amount : this.data.main.amount;
    const scale = max_num / (this.HEIGHT - 20);
    this.data.main['height'] = this.data.main.amount / scale;
    this.data.main['top'] = this.HEIGHT - this.TEXT_SIZE - this.data.main['height'];
    this.data.compare['top'] = this.HEIGHT -  this.data.compare.amount / scale;
  }

}
