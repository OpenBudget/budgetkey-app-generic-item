import {Inject, ElementRef } from '@angular/core';
import { Item } from '../model';

import * as _ from 'lodash';
import {THEME_TOKEN} from 'budgetkey-ng2-components';
import { StoreService } from '../services';

export class BaseItemInfoComponent {

    store: StoreService;
    item: Item;
    ngComponentsTheme: any;

    constructor(store: StoreService,
                public el: ElementRef,
                @Inject(THEME_TOKEN) ngComponentsTheme: any) {
        this.store = store;
        this.item = this.store.item;
        this.ngComponentsTheme = ngComponentsTheme;
        this.setDescriptor(this.store.descriptor);
    }

    setDescriptor(descriptor: any) {}

}
