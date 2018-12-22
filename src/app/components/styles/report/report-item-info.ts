import { Component } from '@angular/core';
import { ReportDescriptor, DescriptorBase } from '../../../model';

import * as _ from 'lodash';
import { BaseItemInfoComponent } from '../../base-item-info';

@Component({
  selector: 'report-item-info',
  template: `  
    <div class="container">
      <div class="title">
        <small [innerHtml]="descriptor.titlePrefix"></small><br/>
        <strong>
            <span (click)="dropdownHidden = !dropdownHidden">
              {{ item.details[descriptor.titleField] }}
            </span>
            <div class="report-dropdown"
                 [ngClass]="{hidden: dropdownHidden}"
            >
              <div class='report-dropdown-bg' (click)='dropdownHidden=true' (touchmove)='false'></div>
              <div class='report-dropdown-scroll'>
                <span *ngFor="let other of item['others']">
                  <a [href]="href(other)">{{other}}</a>
                </span>
              </div>
              <span class='close' (click)='dropdownHidden=true'>&times;</span>
            </div>
        </strong><br/>
        <small>{{descriptor.titleSuffix}}</small>
      </div>
      <div class="indicator-row row" [style.right]="(4 - descriptor.indicators.length)*12.5 + '%'">
        <div class="indicator col-md-3" *ngFor="let indicator of descriptor.indicators">
          <div>
            <span class="borderon"></span>
            <img [src]="'assets/img/' + indicator.asset"/>
            <div class="indicator-text" [innerHTML]="indicator.template | renderTemplate:item:ngComponentsTheme.themeId"></div>
          </div>
        </div>
      </div>
      <div class='indicator-carousel'>
        <div class='indicator-carousel-main'>
          <span (click)='prevIndicator()'>
            <i class='glyphicon glyphicon-chevron-right'></i>
          </span>
          <div class='indicator'>
            <div>
              <img [src]="'assets/img/' + descriptor.indicators[selectedIndicator].asset"/>
              <div class="indicator-text" [innerHTML]="descriptor.indicators[selectedIndicator].template | renderTemplate:item:ngComponentsTheme.themeId"></div>
            </div>
          </div>
          <span (click)='nextIndicator()'>
            <i class='glyphicon glyphicon-chevron-left'></i>
          </span>
        </div>
        <div class='indicator-carousel-dots'>
          <div class='dot' 
               *ngFor='let ind of descriptor.indicators; let idx = index'
               [ngClass]='{active: selectedIndicator===idx}'
               (click)='selectedIndicator=idx'
          ></div>
        </div>
      </div>
      <div class="suffix" [innerHTML]="descriptor.suffixTemplate | renderTemplate:item:ngComponentsTheme.themeId"></div>
    </div>
  `
})
export class ReportItemInfoComponent extends BaseItemInfoComponent {

  descriptor: ReportDescriptor;
  dropdownHidden = true;
  selectedIndicator = 0;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = <ReportDescriptor>this.store.descriptor;
  }

  href(other: string) {
    let href = '//next.obudget.org/i/' + 
      this.descriptor.titleOtherURLPrefix +
      other;
    if (this.ngComponentsTheme.themeId) {
      href += '?theme=' +
        this.ngComponentsTheme.themeId;
    }
    return href;
  }

  nextIndicator() {
    const l = this.descriptor.indicators.length
    this.selectedIndicator = (this.selectedIndicator + l + 1) % l;
  }

  prevIndicator() {
    const l = this.descriptor.indicators.length
    this.selectedIndicator = (this.selectedIndicator + l - 1) % l;
  }
}
