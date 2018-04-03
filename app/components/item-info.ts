import {Component, Inject, OnDestroy} from '@angular/core';
import { StoreService } from '../services';
import { Item, SimpleDescriptor } from '../model';

import * as _ from 'lodash';
import {THEME_TOKEN as NG_COMPONENTS_THEME_TOKEN} from 'budgetkey-ng2-components';

@Component({
  selector: 'budgetkey-item-info',
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
export class ItemInfoComponent implements OnDestroy {

  private eventSubscriptions: any[] = [];

  private item: Item;
  private descriptor: SimpleDescriptor;

  private static processItem(item: Item): Item {
    return <Item>_.mapKeys(item, (value: any, key: string, obj: any) => {
      return key.replace(/-/g, '_');
    });
  }

  private onStoreChanged() {
    this.item = ItemInfoComponent.processItem(this.store.item);
    this.descriptor = <SimpleDescriptor>this.store.descriptor;
  }

  constructor(private store: StoreService, @Inject(NG_COMPONENTS_THEME_TOKEN) private ngComponentsTheme: any) {
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
