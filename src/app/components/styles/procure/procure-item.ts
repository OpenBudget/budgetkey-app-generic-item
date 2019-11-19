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

    isTender = false;
    isContract = false;
    isCallForBids = false;
    isSupportCriteria = false;

    constructor(private store: StoreService) {
        if (store.item['tender_type'] === 'call_for_bids') {
            this.isCallForBids = true;
        } else if (store.item['tender_type'] === 'support_criteria') {
            this.isSupportCriteria = true;
        } else if (!!store.item['order_id']) {
            this.isContract = true;
        } else {
            this.isTender = true;
        }
    }
}
