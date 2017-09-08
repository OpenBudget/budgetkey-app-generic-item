import { Component, OnDestroy } from '@angular/core';
import { StoreService } from '../services';
import { Item, Descriptor } from '../model';

@Component({
  selector: 'budgetkey-item-info',
  styles: [`
    .item-title-row > .row {
      border-top: 3px solid #7A6B99;
      background-color: #E4DCF5;
      color: #7A6B99;
      font-size: 32px;
      line-height: 42px;
      font-weight: bold;
      box-sizing: border-box;
      padding-top: 3px;
      padding-bottom: 2px;
      margin-bottom: 18px;
    }

    .item-title-row > .row h1 {
      margin: 0;
      padding: 0;
      font: inherit;
      color: inherit;
    }
    
    .item-description-row > .row {
      color: #3C4948;
      font-size: 20px;
      line-height: 34px;
    }

    .item-description-row .icon-hide-description {
      text-align: center;
      height: 15px;
      overflow: hidden;
    }
    
    .item-description-row .icon-hide-description i {
      display: inline-block;
      box-sizing: border-box;	
      height: 27px;	
      width: 27px;	
      border: 1px solid #9B9B9B;
      transform: rotate(45deg);
      vertical-align: bottom;
    }
  `],
  template: `  
    <div class="item-title-row">
      <div class="row">
        <div class="col-xs-1"></div>
        <div class="col-xs-10">
          <div class="row">
            <div class="col-xs-2 text-left">{{ item.id }}</div>
            <div class="col-xs-10">
              <div class="pull-left">{{ item.amount }}</div>
              <h1 [innerHTML]="descriptor.titleTemplate | renderTemplate:item"></h1>
            </div>
          </div>
        </div>
        <div class="col-xs-1"></div>
      </div>
    </div>

    <div class="item-description-row">
      <div class="row">
        <div class="col-xs-2"></div>
        <div class="col-xs-8">
          <div class="row">
            <div class="col-xs-1"></div>
            <div class="col-xs-10">
              <div [innerHTML]="descriptor.subtitleTemplate | renderTemplate:item"></div>
              <div class="icon-hide-description"><i></i></div>
            </div>
            <div class="col-xs-1"></div>
          </div>
        </div>
        <div class="col-xs-2"></div>
      </div>
    </div>
  `
})
export class ItemInfoComponent implements OnDestroy {

  private eventSubscriptions: any[] = [];

  private item: Item;
  private descriptor: Descriptor;

  private onStoreChanged() {
    this.item = this.store.item;
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
