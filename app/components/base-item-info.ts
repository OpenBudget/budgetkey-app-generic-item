import {Component, Inject } from '@angular/core';
import { Item } from '../model';

import * as _ from 'lodash';
import {THEME_TOKEN as NG_COMPONENTS_THEME_TOKEN} from 'budgetkey-ng2-components';
import { StoreService } from '../services';

@Component({})
export class BaseItemInfoComponent {

    store: StoreService;
    item: Item;

    constructor(store: StoreService,
                @Inject(NG_COMPONENTS_THEME_TOKEN) private ngComponentsTheme: any) {
        this.store = store;
        this.item = this.store.item;
        this.setDescriptor(this.store.descriptor);
    }

    setDescriptor(descriptor: any) {}

}
