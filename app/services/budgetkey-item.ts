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

  getItemDescriptor(path: string): Promise<Descriptor> {
    path = path.replace(/^[/]+/, '').replace(/[/]+$/, '');
    for (let descriptor of descriptors) {
      let searchPattern = new RegExp('^' + descriptor.pathPrefix);
      if (searchPattern.test(path)) {
        return Promise.resolve(descriptor);
      }
    }
    Promise.reject(new Error('No layout for ' + path));
  }

  getItemData(query: string, headersOrder: string[]): Promise<object> {
    let url = 'http://next.obudget.org/api/query?query=' +
      encodeURIComponent(query);
    return new Promise<any>((resolve, reject) => {
      this.http.get(url)
        .map((res: any) => res.json())
        .subscribe(
          (res: any) => {
            let items: object[]=[];
            let rows = res.rows;
            let headers = rows.length > 0 ?_.union(headersOrder, _.keys(_.first(rows))) : [];
            _.each(rows,(row)=>{
              let newItem: any[] =[];
              _.each(headers,(header)=>{
                newItem.push(row[header]);
              });
              items.push(newItem);
            });
            resolve({query, headers, items});
          },
          () => reject(new Error('Cannot load ' + url))
        );
    });
  }
}
