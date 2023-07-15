import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services';

@Component({
    selector: 'simple-item',
    template: `
                    <simple-item-info></simple-item-info>
                    <simple-item-visualizations></simple-item-visualizations>
              `
})
export class SimpleItemComponent implements OnInit {

    item: any;

    constructor(private store: StoreService) { }

    ngOnInit() {
        this.item = this.store.item;
        if (this.item.code) {
            this.item.child_code_len = this.item.code.length + 2;
        }
    }
}
