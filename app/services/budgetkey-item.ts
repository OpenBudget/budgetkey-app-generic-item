import { Injectable } from '@angular/core';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import descriptors from '../descriptors';

import { Item, Descriptor } from '../model';

@Injectable()
export class BudgetKeyItemService {
  getRedashUrl(query: string): string {
    // TODO: Implement
    return 'http://next.obudget.org/api/query?query=' +
      encodeURIComponent(query);
  }

  getDownloadCSVUrl(query: string): string {
    // TODO: Implement
    return 'http://next.obudget.org/api/query?query=' +
      encodeURIComponent(query);
  }

  getItem(itemId: string): Promise<Item> {
    let url = 'http://next.obudget.org/get/' + itemId;
    return Promise.resolve(
      fetch(url)
        .then(response => response.json())
        .then(result => result.value)
    );
  }

  getItemDescriptor(type: string): Promise<Descriptor> {
    type = type.replace(/^[/]+/, '').replace(/[/]+$/, '');
    for (let descriptor in descriptors) {
      if (descriptor.startsWith(type)) {
        Promise.resolve(descriptors[type]);
        return
      }
    }
    Promise.reject(new Error('No layout for ' + type));
  }

  getItemData(query: string): Promise<object> {
    let url = 'http://next.obudget.org/api/query?query=' +
      encodeURIComponent(query);
    return Promise.resolve(
      fetch(url)
        .then(response => response.json())
        .then(result => result.rows)
        .then((result: object[]) => {
          let headers = result.length > 0 ? _.keys(_.first(result)) : [];
          let items = _.map(result, _.values);
          return {query, headers, items};
        })
    );
  }
}
