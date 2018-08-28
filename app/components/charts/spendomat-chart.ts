import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { format_number } from '../../pipes/render-template';

let COLORSCHEME_1 = {
  primaryBorder: '5D40D4',  // primary box hover and border
  primaryBg: 'B6A5EB',  // primary box background
  tagBg: 'f6f3fa',  // tag background
  tagBorder: 'B3AADE',  // tag border
  text: '3E4E59'   // text color
};

let COLORSCHEME_2 = {
  primaryBorder: '80C8FF',  // primary box hover and border
  primaryBg: 'CEE7FD',  // primary box background
  tagBg: 'F0F6FA',  // tag background
  tagBorder: 'B5DFFF',  // tag border
  text: '3E4E59'   // text color
};

@Component({
  selector: 'budgetkey-chart-spendomat-row',
  template: `
    <div class="spendomat-container" [ngClass]="theme">
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
    border-radius: 0px 10px 10px 0px;
  }

  .row-part.hovered {
    color: #ffffff;
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
    opacity: 0.5;	
    border-radius: 10px;	
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
    font-family: "Miriam Libre";	
    pointer-events: none;
  }

  .payer-label {
    right: 0;

    width: 80%;
    font-size: 16px;	
    font-weight: bold;	
    line-height: 22px;  

    white-space: nowrap;
    overflow: hidden;
  }

  .small .payer-label {
    font-size: 12px;	
    font-weight: normal;	
    line-height: 16px;      
  }

  .amount-label {
    left: 0;
    text-align: left;
    padding: 0 4px;
    white-space: nowrap;

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
    transition-property: transform;
    transition-duration: 200ms;
    transform: rotate(0);
  }

  .selected .chevron {
    transform: rotate(-90deg);
  }
  
  .spendomat-tags {
    min-height: 30px;
    overflow-y: hidden;
    transition-property: height;
    transition-duration: 200ms;
    margin: 6px 0;
  }

  .spendomat-tags.selected {
    height: 0.1px;
    min-height: 0px;
  }

  .tag {
    display: inline-block;
    margin: 0 4px;
    padding: 0px 2px;
    font-family: "Abraham TRIAL";	
    font-size: 12px;	
    line-height: 16px;
    border-radius: 4px;	
    white-space: nowrap;
    overflow: hidden;
  }

  .tag.hovered {
    color: #ffffff;
  }

  .small-spendomat-rows {
    overflow: hidden;
    height: 0px;
  }

  .small-spendomat-rows.selected {
    height: auto;
  }
`,
`
  .theme-1 .row-part {
    border: 1px solid #${COLORSCHEME_1.primaryBorder};	
    background-color: #${COLORSCHEME_1.primaryBg};
  }

  .theme-1 .row-part.hovered {
    background-color: #${COLORSCHEME_1.primaryBorder};
  }

  .theme-1 .small .row-part {
    background-color: #${COLORSCHEME_1.tagBg};    
    border: 1px solid #${COLORSCHEME_1.tagBorder};
  }

  .theme-1 .small .row-part.hovered {
    background-color: #${COLORSCHEME_1.primaryBorder};
  }

  .theme-1 .row-bg {
    border: 1px solid #${COLORSCHEME_1.primaryBorder};	
    background-color: #${COLORSCHEME_1.primaryBg};    
  }

  .theme-1 .row-label {
    color: #${COLORSCHEME_1.text};	
  }

  .theme-1 .chevron {
    border-color: transparent #${COLORSCHEME_1.primaryBorder} transparent transparent;
  }

  .theme-1 .tag {
    color: #${COLORSCHEME_1.text};	
    background-color: #${COLORSCHEME_1.tagBg};    
    border: 1px solid #${COLORSCHEME_1.tagBorder};	
  }

  .theme-1 .tag.hovered {
    background-color: #${COLORSCHEME_1.primaryBorder};
  }
  `,
  `
  .theme-2 .row-part {
    border: 1px solid #${COLORSCHEME_2.primaryBorder};	
    background-color: #${COLORSCHEME_2.primaryBg};
  }

  .theme-2 .row-part.hovered {
    background-color: #${COLORSCHEME_2.primaryBorder};
  }

  .theme-2 .small .row-part {
    background-color: #${COLORSCHEME_2.tagBg};    
    border: 1px solid #${COLORSCHEME_2.tagBorder};
  }

  .theme-2 .small .row-part.hovered {
    background-color: #${COLORSCHEME_2.primaryBorder};
  }

  .theme-2 .row-bg {
    border: 1px solid #${COLORSCHEME_2.primaryBorder};	
    background-color: #${COLORSCHEME_2.primaryBg};    
  }

  .theme-2 .row-label {
    color: #${COLORSCHEME_2.text};	
  }

  .theme-2 .chevron {
    border-color: transparent #${COLORSCHEME_2.primaryBorder} transparent transparent;
  }

  .theme-2 .tag {
    color: #${COLORSCHEME_2.text};	
    background-color: #${COLORSCHEME_2.tagBg};    
    border: 1px solid #${COLORSCHEME_2.tagBorder};	
  }

  .theme-2 .tag.hovered {
    background-color: #${COLORSCHEME_2.primaryBorder};
  }
  `
  ]
})
export class SpendomatChartComponentRow {

  @Input() public row: any;
  @Input() theme: string;
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
      <budgetkey-chart-spendomat-row [row]="row" [theme]="data.theme || 'theme-1'"></budgetkey-chart-spendomat-row>
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
