import {Component, Inject } from '@angular/core';
import { Item } from '../model';

import * as _ from 'lodash';
import {THEME_TOKEN} from 'budgetkey-ng2-components';
import { StoreService } from '../services';

@Component({})
export class BaseItemInfoComponent {

    store: StoreService;
    item: Item;
    ngComponentsTheme: any;

    constructor(store: StoreService,
                @Inject(THEME_TOKEN) ngComponentsTheme: any) {
        this.store = store;
        this.item = this.store.item;
        this.ngComponentsTheme = ngComponentsTheme;
        this.setDescriptor(this.store.descriptor);
    }

    setDescriptor(descriptor: any) {}

}
