import { Component } from '@angular/core';
import { SimpleDescriptor, DescriptorBase } from '../../../model';

import * as _ from 'lodash';
import { BaseItemInfoComponent } from '../../base-item-info';

@Component({
  selector: 'simple-item-info',
  template: `  
    <div class="row budgetkey-item-title-wrapper">
      <div class="col-md-1"></div>
      <div class="col-md-11">
        <div class="row">
          <div class="col-md-2 text-left"><small 
            [innerHTML]="descriptor.preTitleTemplate | renderTemplate:item:ngComponentsTheme.themeId"></small></div>
          <div class="col-md-6">
            <h1 [innerHTML]="descriptor.titleTemplate | renderTemplate:item:ngComponentsTheme.themeId"></h1>
          </div>
          <div class="col-md-4 text-left" [innerHTML]="descriptor.amountTemplate | renderTemplate:item:ngComponentsTheme.themeId"></div>
        </div>
      </div>
    </div>

    <div class="row budgetkey-item-description-wrapper">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div class="row">
          <div class="col-md-1"></div>
          <div class="col-md-10">
            <div class="subtitle" [innerHTML]="descriptor.subtitleTemplate | renderTemplate:item:ngComponentsTheme.themeId"></div>
            <div [innerHTML]="descriptor.textTemplate | renderTemplate:item:ngComponentsTheme.themeId"></div>
          </div>
          <div class="col-md-1"></div>
        </div>
      </div>
      <div class="col-md-2"></div>
    </div>
  `
})
export class SimpleItemInfoComponent extends BaseItemInfoComponent {

  descriptor: SimpleDescriptor;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = <SimpleDescriptor>this.store.descriptor;
  }
}
