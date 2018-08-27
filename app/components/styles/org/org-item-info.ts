import { Component } from '@angular/core';
import { SimpleDescriptor, DescriptorBase } from '../../../model';

import * as _ from 'lodash';
import { BaseItemInfoComponent } from '../../base-item-info';

@Component({
  selector: 'org-item-info',
  template: `  
  <div class='row-container title-container' [ngClass]='item ? item.kind : ""'>
    <div class="title-row row">
      <div class="col-md-1">
          <span class="pretitle"
                [innerHTML]="descriptor.preTitleTemplate | renderTemplate:item:ngComponentsTheme.themeId">
          </span>          
      </div>
      <div class="col-md-6">
          <span class="title"
          [innerHTML]="descriptor.titleTemplate | renderTemplate:item:ngComponentsTheme.themeId">
          </span>
      </div>
      <div class="col-md-2 invert">
          <span class="org-id" 
                [innerHTML]="descriptor.subtitleTemplate | renderTemplate:item:ngComponentsTheme.themeId">
          </span>
      </div>
      <div class="col-md-3 invert">
        <div class="pull-left">
          <span class="amount"
                [innerHTML]="descriptor.amountTemplate | renderTemplate:item:ngComponentsTheme.themeId">
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="row-container text-container">
    <div class="row text"
        [innerHTML]="descriptor.textTemplate | renderTemplate:item:ngComponentsTheme.themeId">
    </div>
  </div>
`
})
export class OrgItemInfoComponent extends BaseItemInfoComponent {

  private descriptor: SimpleDescriptor;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = <SimpleDescriptor>this.store.descriptor;
  }
}
