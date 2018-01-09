import { Component, OnDestroy } from '@angular/core';
import { StoreService } from '../services';
import { Item, Descriptor } from '../model';

import * as _ from 'lodash';

@Component({
  selector: 'budgetkey-item-info',
  template: `  
    <div class="row budgetkey-item-title-wrapper">
      <div class="col-xs-1"></div>
      <div class="col-xs-11">
        <div class="row">
          <div class="col-xs-2 text-left"><small [innerHTML]="descriptor.preTitleTemplate | renderTemplate:item"></small></div>
          <div class="col-xs-6">
            <h1 [innerHTML]="descriptor.titleTemplate | renderTemplate:item"></h1>
          </div>
          <div class="col-xs-4 text-left" [innerHTML]="descriptor.amountTemplate | renderTemplate:item"></div>
        </div>
      </div>
    </div>

    <div class="row budgetkey-item-description-wrapper">
      <div class="col-xs-2"></div>
      <div class="col-xs-8">
        <div class="row">
          <div class="col-xs-1"></div>
          <div class="col-xs-10">
            <div class="subtitle" [innerHTML]="descriptor.subtitleTemplate | renderTemplate:item"></div>
            <div [innerHTML]="descriptor.textTemplate | renderTemplate:item"></div>
          </div>
          <div class="col-xs-1"></div>
        </div>
      </div>
      <div class="col-xs-2"></div>
    </div>
  `
})
export class ItemInfoComponent implements OnDestroy {

  private eventSubscriptions: any[] = [];

  private item: Item;
  private descriptor: Descriptor;

  private static processItem(item: Item): Item {
    return <Item>_.mapKeys(item, (value: any, key: string, obj: any) => {
      return key.replace(/-/g, '_');
    });
  }

  private onStoreChanged() {
    this.item = ItemInfoComponent.processItem(this.store.item);
    this.descriptor = this.store.descriptor;
  }

  constructor(private store: StoreService) {
    this.eventSubscriptions = [
      this.store.itemChange.subscribe(() => this.onStoreChanged()),
      this.store.descriptorChange.subscribe(() => this.onStoreChanged()),
    ];
    this.onStoreChanged();
  }

  ngOnDestroy() {
    this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.eventSubscriptions = [];
  }

}
