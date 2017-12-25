import { Component, OnDestroy } from '@angular/core';
import { StoreService } from '../services';
import { Item, Descriptor } from '../model';

@Component({
  selector: 'budgetkey-item-info',
  template: `
    <div class="row budgetkey-item-title-wrapper">
      <div class="col-xs-1"></div>
      <div class="col-xs-10">
        <div class="row">
          <div class="col-xs-2 text-left"><small [innerHTML]="descriptor.preTitleTemplate | renderTemplate:item"></small></div>
          <div class="col-xs-6">
            <h1 [innerHTML]="descriptor.titleTemplate | renderTemplate:item"></h1>
          </div>
          <div class="col-xs-4 text-left" [innerHTML]="descriptor.amountTemplate | renderTemplate:item"></div>
        </div>
      </div>
      <div class="col-xs-1"></div>
    </div>

    <div class="row budgetkey-item-description-wrapper">
      <div class="col-xs-2"></div>
      <div class="col-xs-8">
        <div class="row">
          <div class="col-xs-1"></div>
          <div class="col-xs-10">
            <div [innerHTML]="descriptor.subtitleTemplate | renderTemplate:item"></div>
            <div *ngIf="isDescriptionVisible" [innerHTML]="descriptor.textTemplate | renderTemplate:item"></div>
            <div class="toggle-description" (click)="toggleDescription()">
              <i class="glyphicon glyphicon-chevron-down" *ngIf="!isDescriptionVisible"></i>
              <i class="glyphicon glyphicon-chevron-up" *ngIf="isDescriptionVisible"></i>
            </div>
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
  private isDescriptionVisible = true;

  toggleDescription() {
    this.isDescriptionVisible = !this.isDescriptionVisible;
  }

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
