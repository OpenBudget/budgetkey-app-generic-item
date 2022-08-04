import { Component } from '@angular/core';
import { DescriptorBase, MuniBudgetDescriptor } from '../../../model';

import { BaseItemInfoComponent } from '../../base-item-info';

import { format_ils } from '../../../pipes';

@Component({
  selector: 'muni-budget-item-info',
  templateUrl: './muni-budget-item-info.html',
  styleUrls: ['./muni-budget-item-info.less']
})
export class MuniBudgetItemInfoComponent extends BaseItemInfoComponent {

  descriptor: MuniBudgetDescriptor;

  format_ils = format_ils;
  totalValue = 0;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = <MuniBudgetDescriptor>this.store.descriptor;
    let children = this.item.children;
    if (children) {
      this.totalValue = 0;
      children.forEach(child => {
        child.value = child.executed || child.revised || child.allocated;
        this.totalValue += child.value;
      });      
      children = children.sort((a, b) => b.value - a.value)
      children.forEach(child => {
        child.pct = (child.value / this.totalValue * 100) + '%';
        child.value = format_ils(child.value);
      });
      this.item.children = children;
    }
  }
}
