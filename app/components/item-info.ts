import { Component, OnDestroy } from '@angular/core';
import { StoreService, ThemeService } from '../services';
import { Item, Descriptor } from '../model';

import * as _ from 'lodash';

@Component({
  selector: 'budgetkey-item-info',
  template: `  
    <div class="row budgetkey-item-title-wrapper">
      <div class="col-md-1"></div>
      <div class="col-md-11">
        <div class="row">
          <div class="col-md-2 text-left"><small 
            [innerHTML]="descriptor.preTitleTemplate | renderTemplate:item:theme.themeId"></small></div>
          <div class="col-md-6">
            <h1 [innerHTML]="descriptor.titleTemplate | renderTemplate:item:theme.themeId"></h1>
          </div>
          <div class="col-md-4 text-left" [innerHTML]="descriptor.amountTemplate | renderTemplate:item:theme.themeId"></div>
        </div>
      </div>
    </div>

    <div class="row budgetkey-item-description-wrapper">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div class="row">
          <div class="col-md-1"></div>
          <div class="col-md-10">
            <div class="subtitle" [innerHTML]="descriptor.subtitleTemplate | renderTemplate:item:theme.themeId"></div>
            <div [innerHTML]="descriptor.textTemplate | renderTemplate:item:theme.themeId"></div>
          </div>
          <div class="col-md-1"></div>
        </div>
      </div>
      <div class="col-md-2"></div>
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

  constructor(private store: StoreService, private theme: ThemeService) {
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
