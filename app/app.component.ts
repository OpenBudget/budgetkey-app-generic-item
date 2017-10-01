import { Component, OnInit } from '@angular/core';
import { BudgetKeyItemService, StoreService } from './services';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'budgetkey-app-generic-item',
  template: `
    <budgetkey-container>
      <div class="budgetkey-item-wrapper container-fluid">
        <budgetkey-page-header></budgetkey-page-header>
        <div *ngIf="!loaded">Loading...</div>
        <budgetkey-breadcrumbs *ngIf="loaded"></budgetkey-breadcrumbs>
        <budgetkey-item-info *ngIf="loaded"></budgetkey-item-info>
        <budgetkey-item-visualizations *ngIf="loaded"></budgetkey-item-visualizations>

        <budgetkey-item-questions *ngIf="loaded"></budgetkey-item-questions>
        <budgetkey-item-data-table *ngIf="loaded"></budgetkey-item-data-table>
      </div>  
    </budgetkey-container>
  `,
  providers: [
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
})
export class AppComponent implements OnInit {
  loaded: boolean;

  constructor(private itemService: BudgetKeyItemService, private store: StoreService, private location: Location) {
    this.loaded = false;
  }

  ngOnInit(): void {
    this.loaded = false;
    let itemId = this.location.path().replace(/^\//, '').replace(/\/$/, '');
    this.itemService.getItem(itemId)
      .then(item => {
        this.store.item = item;
        return this.itemService.getItemDescriptor('org/' + item.kind);
      })
      .then(descriptor => {
        this.store.descriptor = descriptor;
        this.loaded = true;
      });
  }
}
