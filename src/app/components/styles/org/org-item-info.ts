import { Component } from '@angular/core';
import { DescriptorBase, OrgDescriptor } from '../../../model';

import * as _ from 'lodash';
import { BaseItemInfoComponent } from '../../base-item-info';

@Component({
  selector: 'org-item-info',
  template: `  
  <div class='title-container' [ngClass]='item ? item.kind : ""'>
    <div class="title-row">
      <span class="pretitle-wrapper">
        <span class="pretitle"
              [innerHTML]="descriptor.preTitleTemplate | renderTemplate:item:ngComponentsTheme.themeId">
        </span>
      </span>
      <span class='title-wrapper'>
        <span class="title"
              [innerHTML]="descriptor.titleTemplate | renderTemplate:item:ngComponentsTheme.themeId">
        </span>
      </span>
      <span class="org-id invert" 
            [innerHTML]="descriptor.subtitleTemplate | renderTemplate:item:ngComponentsTheme.themeId">
      </span>
      <span class="amount invert"
            [innerHTML]="descriptor.amountTemplate | renderTemplate:item:ngComponentsTheme.themeId">
      </span>
    </div>
  </div>
  <div class="row-container text-container">
    <div class="text"
        [innerHTML]="descriptor.textTemplate | renderTemplate:item:ngComponentsTheme.themeId">
    </div>
    <div class='tips'>
      <div class='tip' *ngFor='let tip of descriptor.tips' [innerHTML]='tip | renderTemplate:item:ngComponentsTheme.themeId'>
      </div>
    </div>
  </div>
`
})
export class OrgItemInfoComponent extends BaseItemInfoComponent {

  descriptor: OrgDescriptor;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = <OrgDescriptor>this.store.descriptor;
  }
}
