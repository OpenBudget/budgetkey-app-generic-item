import { Component } from '@angular/core';
import { ReportDescriptor, DescriptorBase } from '../../../model';

import * as _ from 'lodash';
import { BaseItemInfoComponent } from '../../base-item-info';

@Component({
  selector: 'report-item-info',
  template: `  
    <div class="container">
      <div class="title">
        <small>{{descriptor.titlePrefix}}</small><br/>
        <strong>
            <span (click)="dropdownHidden = !dropdownHidden">
              {{ item.details[descriptor.titleField] }}
            </span>
            <div class="report-dropdown"
                 [ngClass]="{hidden: dropdownHidden}"
            >
                <span *ngFor="let other of item.others">
                  <a [href]="href(other)">{{other}}</a>
                </span>
            </div>
        </strong><br/>
        <small>{{descriptor.titleSuffix}}</small>
      </div>
      <div class="row" [style.right]="(4 - descriptor.indicators.length)*12.5 + '%'">
        <div class="indicator col-md-3" *ngFor="let indicator of descriptor.indicators">
          <div>
            <span class="borderon"></span>
            <img [src]="'assets/img/' + indicator.asset"/>
            <div class="indicator-text" [innerHTML]="indicator.template | renderTemplate:item:ngComponentsTheme.themeId"></div>
          </div>
        </div>
      </div>
      <div class="suffix" [innerHTML]="descriptor.suffixTemplate | renderTemplate:item:ngComponentsTheme.themeId"></div>
    </div>
  `
})
export class ReportItemInfoComponent extends BaseItemInfoComponent {

  private descriptor: ReportDescriptor;
  private dropdownHidden: boolean = true;

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
}
