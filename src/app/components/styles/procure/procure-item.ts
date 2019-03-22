import { Component } from '@angular/core';
import { StoreService } from '../../../services';

@Component({
    selector: 'procure-item',
    template: `
                    <tender-item-info *ngIf='isTender'></tender-item-info>
                    <contract-item-info *ngIf='isContract'></contract-item-info>
                    <call-for-bids-item-info *ngIf='isCallForBids'></call-for-bids-item-info>
                    <support-criteria-item-info *ngIf='isSupportCriteria'></support-criteria-item-info>
              `
})
export class ProcureItemComponent {

    isTender: boolean;
    isContract: boolean;
    isCallForBids: boolean;
    isSupportCriteria: boolean;

    constructor(private store: StoreService) {
        this.isTender = !!store.item['tender_id'];
        this.isContract = !!store.item['order_id'];
        this.isCallForBids = store.item['tender_type'] === 'call_for_bids';
        this.isSupportCriteria = store.item['tender_type'] === 'support-criteria';
    }
}
