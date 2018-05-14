import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { format_number } from '../../pipes/render-template';

@Component({
  selector: 'budgetkey-chart-spendomat-row',
  template: `
    <div class="spendomat-container">
      <div class="spendomat-row"
           (mouseleave)="hoverIndex = -1">
        <div class="row-bg"></div>
        <div class="row-part" 
             *ngFor="let s of row.spending.slice().reverse(); let i = index;" 
             [style.width]='s.acc_width + "%"'
             [ngClass]="{hovered: i == row.spending.length - 1 - hoverIndex}"
             (mouseover)="hoverIndex = row.spending.length - 1 - i"
             >
        </div>
        <div class="row-label payer-label">
          <span>{{row.payer}}</span>
        </div>
        <div class="row-label amount-label">
          <span [innerHtml]="row.amount_fmt"></span>
        </div>
        <div class="chevron-container"
             [ngClass]="{selected: selected}"
             (click)="selected = !selected"
        >
          <div class="chevron"></div>
        </div>
      </div>
      <div class="spendomat-tags"
           [ngClass]="{selected: selected}"
           (mouseleave)="hoverIndex = -1"
      >
        <div class="tag" 
             *ngFor="let s of row.spending.slice(0, 4); let i = index"
             [ngClass]="{hovered: i == hoverIndex}"
             (mouseover)="hoverIndex = i"
             >
          {{ s.tag }} 
        </div>
      </div>

      <div class="small-spendomat-rows"
           [ngClass]="{selected: selected}"
           [style.height]="(selected ? 20 * row.spending.length : 0) + 'px'"
           (mouseleave)="hoverIndex = -1"
        >
        <div class="small spendomat-row" *ngFor="let s of row.spending; let i = index"
             (mouseover)="hoverIndex = i"
        >
          <div class="row-bg"></div>
          <div class="row-part" 
              [style.width]='aw + "%"' *ngFor='let aw of s.amount_widths'
              [ngClass]="{hovered: i == hoverIndex}"
          ></div>
          <div class="row-label payer-label"
              [ngClass]="{hovered: i == hoverIndex}"
          >
            <span>{{s.tag}}</span>
          </div>
          <div class="row-label amount-label">
            <span [innerHtml]="s.amount_fmt"></span>
            </div>
          <div class="row-label kinds-label">
            <span *ngIf="s.count == 1 && s.spending_types[0] == 'contract'">התקשרות אחת</span>
            <span *ngIf="s.count == 1 && s.spending_types[0] == 'support'">תמיכה אחת</span>
            <ng-container *ngIf="s.count > 1">
              <span>{{s.count}}</span>
              <ng-container *ngIf="s.spending_types.length > 1">
                <span>התקשרויות ותמיכות</span>
              </ng-container>
              <ng-container *ngIf="s.spending_types.length == 1">
                <span *ngIf="s.spending_types[0] == 'contract'">התקשרויות</span>
                <span *ngIf="s.spending_types[0] == 'support'">תמיכות</span>
              </ng-container>
            </ng-container>
          </div>
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
    margin-bottom: 5px;
  }

  .row-part {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    border: 1px solid #5D40D4;	
    border-radius: 0px 10px 10px 0px;
    background-color: #B6A5EB;    
  }

  .row-part.hovered {
    background-color: #5D40D4;
    color: #ffffff;
  }

  .small .row-part {
    border-radius: 0px 4px 4px 0px;
    background-color: #f6f3fa;    
    border: 1px solid #B3AADE;	
  }

  .small .row-part.hovered {
    background-color: #5D40D4;
  }

  .row-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #5D40D4;	
    opacity: 0.5;	
    border-radius: 10px;	
    background-color: #B6A5EB;    
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
    pointer-events: none;
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

  .kinds-label {
    left: -200px;
    text-align: right;
    width: 200px;

    font-size: 10px;	
    line-height: 18px;
    display: inline-block;
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
    cursor: pointer;
  }

  .chevron {
    width: 0; 
    height: 0;
    border-style: solid;
    border-width: 7px 7px 7px 0;
    border-color: transparent #5D40D4 transparent transparent;
    transition-property: transform;
    transition-duration: 200ms;
    transform: rotate(0);
  }

  .selected .chevron {
    transform: rotate(-90deg);
  }
  
  .spendomat-tags {
    height: 30px;
    overflow-y: hidden;
    transition-property: height;
    transition-duration: 200ms;
  }

  .spendomat-tags.selected {
    height: 6px;
  }

  .tag {
    display: inline-block;
    margin: 6px 4px;
    padding: 0px 2px;
    color: #3E4E59;	
    font-family: "Abraham TRIAL";	
    font-size: 12px;	
    line-height: 16px;
    border-radius: 4px;	
    // border: 1px solid #5D40D4;	
    // background-color: #F6F7F0;

    background-color: #f6f3fa;    
    border: 1px solid #B3AADE;	
  }

  .tag.hovered {
    color: #ffffff;
    background-color: #5D40D4;
  }

  .small-spendomat-rows {
    overflow: hidden;
    transition-property: height;
    transition-duration: 200ms;
  }
    `
  ]
})
export class SpendomatChartComponentRow {

  @Input() public row: any;
  hoverIndex_: number = -1;
  selected: boolean = false;

  constructor() {}

  public set hoverIndex( v: number) {
    this.hoverIndex_ = v;
  }

  public get hoverIndex(): number {
    return this.hoverIndex_;
  }

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
        r['amount_fmt'] = format_number(r['amount']) + ' ₪';
        let width = 100 * r['amount'] / sum;
        let acc = 0;
        _.each(r['spending'], (s) => {
          s['amount_fmt'] = format_number(s['amount']) + ' ₪';
          let s_width = s['amount'] / r['amount'];
          acc += s_width * width;
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
  }

}
