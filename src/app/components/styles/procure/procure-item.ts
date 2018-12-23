import { Component } from '@angular/core';
import { StoreService } from '../../../services';

@Component({
    selector: 'procure-item',
    template: `
                    <tender-item-info *ngIf='isTender'></tender-item-info>
                    <contract-item-info *ngIf='!isTender'></contract-item-info>
              `
})
export class ProcureItemComponent {

    isTender: boolean;

    constructor(private store: StoreService) {
        this.isTender = !!store.item['tender_id'];
    }
}
