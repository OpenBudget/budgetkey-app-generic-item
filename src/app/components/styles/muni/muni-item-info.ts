import { Component } from '@angular/core';
import { DescriptorBase, MuniDescriptor, Chart } from '../../../model';

import * as _ from 'lodash';
import { BaseItemInfoComponent } from '../../base-item-info';

@Component({
  selector: 'muni-item-info',
  templateUrl: './muni-item-info.html',
  styleUrls: ['./muni-item-info.less']
})
export class MuniItemInfoComponent extends BaseItemInfoComponent {

  descriptor: MuniDescriptor;

  props: any;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = <MuniDescriptor>this.store.descriptor;
  }

  public get ext(): any {
    return (this.item.details && this.item.details.extended) || ({} as any);
  }
}
