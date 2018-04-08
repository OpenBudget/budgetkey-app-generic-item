import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'budgetkey-chart-adamkey',
  template: `
    <div class='row chart'>
      <div class='details-container col-md-6'>
        <div class="details" #details
             [style.height]="maxHeight + 'px'"
        >
          <div class='row detail' 
              [ngClass]="{hovered: i == hoverIndex}"
              *ngFor='let value of data.values; let i = index'
              (mouseover)="hoverIndex = i"
          >
            <div class='index-col col-xs-1'>
              <div class='text'>{{ i + 1 }}</div>
            </div>
            <div class='label-col col-xs-7'>
              <div class='text' [innerHtml]="value.label"></div>
            </div>
            <div class='amount-col col-xs-4'>
              <div class='text'>{{ value.amount_fmt }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class='barchart col-md-6'
        [style.height]="maxHeight + 'px'"
        >
        <ng-container  *ngFor="let v of data.values; let i = index">
          <div class="bar-bg"
              [ngClass]="{hovered: i == hoverIndex}"
              [style.top]="(9 * i) + 'px'"
              (mouseover)="hoverIndex = i; scrollDetails()"
              >
          </div>
          <div class="bar"
              [ngClass]="{hovered: i == hoverIndex}"
              [style.width]="100 * (v.amount / maxValue) + '%'"
              [style.top]="(9 * i) + 'px'"
              (mouseover)="hoverIndex = i; scrollDetails()"
              >
          </div>
        </ng-container>
    </div>
  `,
  styles: [
    `
      .chart {
        margin-top: 20px;
      }

      .text {
        vertical-align: middle;
        height: 0px;
        display: inline-block;    
      }

      .details-container {
        padding: 0px 20px;
      }

      .details {
        overflow-y: scroll;
        scroll-behavior: smooth;
        border: 1px solid #EEEEEE;	
        border-radius: 4px;	
        background-color: #FFFFFF;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
        padding: 10px 20px;
      }

      .detail {
        height: 50px;
      }

      .detail.hovered {
        background-color: #EAF9DE;
      }

      .index-col {
        opacity: 0.8;	
        color: #C3C3C3;	
        font-family: "Abraham TRIAL";	
        font-size: 18px;	
        text-align: right;
      }

      ::ng-deep .label-col a {
        color: #7FAA5E !important;	
        font-family: "Abraham TRIAL";	
        font-size: 14px !important;
        text-align: right; 
      }

      .amount-col {
        text-align: left;
        color: #3E4E59;	
        font-family: "Miriam Libre";	
        font-size: 14px;
        font-weight: 400;
      }

      .barchart {
        position: relative;
        border-right: 1px solid #888;
        padding-right: 0;
      }   

      .bar {
        position: absolute;
        height: 8px;
        background-color: #EAF9DE;
      }

      .bar.hovered {
        background-color: #C5F6A2;
      }
      
      .bar-bg {
        position: absolute;
        width: 100%;
        height: 8px;
        opacity: 0.01
        background-color: #fff;
      }

      .bar-bg.hovered {
        background-color: #eee;
      }
    `
  ]
})
export class AdamKeyChartComponent {

  @Input() public data: any;
  @ViewChild('details', { read: ElementRef }) public details: ElementRef;

  maxValue: number = 1;
  maxHeight: number = 1;
  hoverIndex_: number = 0;

  constructor(private location: Location) {
  }

  public set hoverIndex( v: number) {
    console.log('hoverIndex', v);
    this.hoverIndex_ = v;
  }

  public get hoverIndex(): number {
    return this.hoverIndex_;
  }

  scrollDetails() {
    this.details.nativeElement.scrollTop = 10 + this.hoverIndex * (50 - 8); // height of detail - height of bar
    console.log('st', this.details.nativeElement.scrollTop);
  }

  ngOnInit() {
    for (let v of this.data.values) {
      if (v.amount > this.maxValue) {
        this.maxValue = v.amount;
      }
    }
    this.maxValue *= 1.15;
    this.maxHeight = this.data.values.length * 9;
    if (this.maxHeight < 200) {
      this.maxHeight = 200;
    }
  }

}
