import { Component } from '@angular/core';
import { DescriptorBase } from '../../../model';

import * as moment from 'moment';
import { BaseItemInfoComponent } from '../../base-item-info';
import { format_absolute_percent, format_number } from '../../../pipes/render-template';

export class ProcureItemInfoComponent extends BaseItemInfoComponent {

  private descriptor: DescriptorBase;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = this.store.descriptor;
  }

  firstUpdateDate() {
    if (this.item['start_date']) {
      return this.item['start_date'];
    }
    if (this.item['order_date']) {
      return this.item['order_date'];
    }
    if (this.item['payments']) {
      return this.item['payments'][0]['date'];
    }
    if (this.item['__created_at']) {
      return moment(this.item['__created_at']).format('YYYY-MM-DD');
    }
  }

  // Formatting
  percent(x: number) {
    return format_absolute_percent(x);
  }

  number(x: number) {
    return format_number(x);
  }

  relative(x: string) {
    if (x) {
      return '<span title="' + x + '">' + moment(x).fromNow() + '</span>';
    }
    return 'תאריך פרסום לא ידוע';
  }

  entityLink(awardee: any) {
    const ret = '/i/org/' + awardee.entity_kind + '/' + awardee.entity_id;
    if (this.ngComponentsTheme.themeId) {
      return ret + '?theme=' + this.ngComponentsTheme.themeId ;
    } else {
      return ret;
    }
  }
}
