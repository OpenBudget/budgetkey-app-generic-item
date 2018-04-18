import { Component, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'budgetkey-chart-spendomat-row',
  template: `
    <div class="spendomat-container">
      <div class="spendomat-row">
        <div class="row-bg"></div>
        <div class="row-part" *ngFor="let s of row.spending.slice().reverse()" [style.width]='s.acc_width + "%"'></div>
        <div class="row-label payer-label">
          <span>{{row.payer}}</span>
        </div>
        <div class="row-label amount-label">
          <span>{{row.amount_fmt}}</span>
        </div>
        <div class="chevron-container">
          <div class="chevron"></div>
        </div>
      </div>
      <div class="spendomat-tags">
        <div class="tag" *ngFor="let s of row.spending.slice(0, 4)">
          {{ s.tag }} 
        </div>
      </div>

      <div class="small spendomat-row" *ngFor="let s of row.spending">
        <div class="row-bg"></div>
        <div class="row-part" [style.width]='aw + "%"' *ngFor='let aw of s.amount_widths'></div>
        <div class="row-label payer-label">
          <span>{{s.tag}}</span>
        </div>
        <div class="row-label amount-label">
          <span>{{s.amount_fmt}}</span>
        </div>
      </div>

    </div>
  `,
  styles: [
    `
  .spendomat-container {
    padding-top: 23px;
    width: 100%;	
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(0,0,0,0.03);
  }

  .spendomat-row {
    position: relative;
    height: 78px;	
    width: 100%;	
    border-radius: 10px;
  }

  .spendomat-row.small {
    position: relative;
    height: 16px;	
    width: 60%;	
    border-radius: 4px;
  }

  .row-part {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    border: 1px solid #7FAA5E;	
    border-radius: 0px 10px 10px 0px;
    background-color: #EAF9DE;    
  }

  .small .row-part {
    border-radius: 0px 4px 4px 0px;
  }

  .row-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #7FAA5E;	
    opacity: 0.5;	
    border-radius: 10px;	
    background-color: #EAF9DE;    
  }

  .small .row-bg {
    border-radius: 4px;
  }

  .row-label {
    position: absolute;
    top: 0;
    display: flex;
    height: 100%;
    flex-flow: column;
    justify-content: center;
    padding: 0 19px;
    color: #3E4E59;	
    font-family: "Miriam Libre";	
  }

  .payer-label {
    right: 0;

    width: 80%;
    font-size: 16px;	
    font-weight: bold;	
    line-height: 22px;  
  }

  .small .payer-label {
    font-size: 12px;	
    font-weight: normal;	
    line-height: 16px;      
  }

  .amount-label {
    left: 0;
    text-align: left;
    width: 20%;

    font-size: 14px;	
    line-height: 19px;
  }

  .small .amount-label {
    font-size: 10px;	
    line-height: 13px;
    text-align: right;
  }

  .chevron-container {
    width: 20px;
    height: 100%;
    position: absolute;
    right: -20px;
    top: 0;
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .chevron {
    width: 0; 
    height: 0;
    border-style: solid;
    border-width: 7px 7px 7px 0;
    border-color: transparent #7FAA5E transparent transparent;
  }

  .chevron.rotated {
    transform: rotate(-90deg);
  }
  
  .tag {
    display: inline-block;
    margin: 6px 4px;
    padding: 0px 2px;
    color: #3E4E59;	
    font-family: "Abraham TRIAL";	
    font-size: 12px;	
    line-height: 16px;
    border: 1px solid #7FAA5E;	
    border-radius: 4px;	
    background-color: #F6F7F0;
  }
    `
  ]
})
export class SpendomatChartComponentRow {

  @Input() public row: any;

  constructor() {}

  ngOnInit() {
  }

}




@Component({
  selector: 'budgetkey-chart-spendomat',
  template: `
    <ng-container *ngFor="let row of rows">
      <budgetkey-chart-spendomat-row [row]="row"></budgetkey-chart-spendomat-row>
    </ng-container>
  `,
  styles: [
    `
    `
  ]
})
export class SpendomatChartComponent {

  @Input() public data: any;

  rows: any[] = [];

  constructor() {}

  ngOnInit() {
    let data = this.data.data;
    this.rows = data;
    let sum = _.sum(
      _.map(this.rows, (r) => r['amount'])
    );
    _.each(
      this.rows,
      (r) => {
        r['amount_fmt'] = r['amount'].toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2}) + ' ₪';
        let width = 100 * r['amount'] / sum;
        console.log('width', width);
        let acc = 0;
        _.each(r['spending'], (s) => {
          s['amount_fmt'] = s['amount'].toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2}) + ' ₪';
          let s_width = s['amount'] / r['amount'];
          console.log('s_width', s_width);
          acc += s_width * width;
          console.log('acc', acc);
          s['acc_width'] = acc;
          s['width'] = s_width * 100;

          let inner_acc = 0;
          s['amount_widths'] = _.map(s['amounts'], (a: number) => {
            let inner_w = a / s['amount'];
            inner_acc += inner_w;
            return inner_acc * s['width'];
          });
          s['amount_widths'].reverse();
        });
      }
    );
    console.log('PPP', sum, data);
    // for (let payer in data) {
    //   if (payer === 'all') {
    //     continue;
    //   }
    //   let row = data[payer];
    //   // row['payer'] = payer;
    //   this.rows.push(row)
    // }
  }

}
