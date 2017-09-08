import { Component, OnInit } from '@angular/core';
import { BudgetKeyItemService, StoreService } from './services';

@Component({
  selector: 'budgetkey-app-generic-item',
  template: `
    <budgetkey-container>
      <div class="container-fluid">
        <budgetkey-page-header></budgetkey-page-header>
        <div *ngIf="!loaded">Loading...</div>
        <budgetkey-breadcrumbs *ngIf="loaded"></budgetkey-breadcrumbs>
        <budgetkey-item-info *ngIf="loaded"></budgetkey-item-info>
        <budgetkey-item-visualizations *ngIf="loaded"></budgetkey-item-visualizations>
        <budgetkey-item-data *ngIf="loaded"></budgetkey-item-data>
      </div>  
    </budgetkey-container>
  `
})
export class AppComponent implements OnInit {
  loaded: boolean;

  constructor(private itemService: BudgetKeyItemService, private store: StoreService) {
    this.loaded = false;
  }

  ngOnInit(): void {
    this.loaded = false;
    this.itemService.getItem()
      .then(item => {
        this.store.item = item;
        return this.itemService.getItemDescriptor(item.type);
      })
      .then(descriptor => {
        this.store.descriptor = descriptor;
        this.loaded = true;
      });
  }
}
