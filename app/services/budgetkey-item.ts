import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import descriptors from '../descriptors';

import { Item, Descriptor } from '../model';

@Injectable()
export class BudgetKeyItemService {
  constructor(private http: Http) {
  }

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
    return new Promise<Item>((resolve, reject) => {
      this.http.get(url)
        .map((res: any) => res.json())
        .subscribe(
          (res: any) => resolve(res.value),
          () => reject(new Error('Cannot load ' + url))
        );
    });
  }

  getItemDescriptor(type: string): Promise<Descriptor> {
    type = type.replace(/^[/]+/, '').replace(/[/]+$/, '');
    for (let descriptor in descriptors) {
      if (type.startsWith(descriptor)) {
        return Promise.resolve(descriptors[descriptor]);
      }
    }
    Promise.reject(new Error('No layout for ' + type));
  }

  getItemData(query: string): Promise<object> {
    let url = 'http://next.obudget.org/api/query?query=' +
      encodeURIComponent(query);
    return new Promise<any>((resolve, reject) => {
      this.http.get(url)
        .map((res: any) => res.json())
        .subscribe(
          (res: any) => {
            let rows: object[] = res.rows;
            let headers = rows.length > 0 ? _.keys(_.first(rows)) : [];
            let items = _.map(rows, _.values);
            resolve({query, headers, items});
          },
          () => reject(new Error('Cannot load ' + url))
        );
    });
  }
}
