import { Component } from '@angular/core';
import { ReportDescriptor, DescriptorBase } from '../../../model';

import * as _ from 'lodash';
import { BaseItemInfoComponent } from '../../base-item-info';

@Component({
  selector: 'report-item-info',
  template: `  
    <div class="container">
      <div class="title" [innerHTML]="descriptor.titleTemplate | renderTemplate:item:ngComponentsTheme.themeId"></div>
      <div class="row">
        <div class="indicator col-md-3" *ngFor="let indicator of descriptor.indicators">
          <div>
            <span class="borderon"></span>
            <img [src]="'assets/img/' + indicator.asset"/>
            <div class="indicator-text" [innerHTML]="indicator.template | renderTemplate:item:ngComponentsTheme.themeId"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportItemInfoComponent extends BaseItemInfoComponent {

  private descriptor: ReportDescriptor;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = <ReportDescriptor>this.store.descriptor;
  }
}
