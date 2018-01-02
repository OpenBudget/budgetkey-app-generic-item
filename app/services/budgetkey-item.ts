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

  private budgetNumberFormatter(value: any)
  {
    return parseFloat(value).toLocaleString('he-IL',{ style: 'currency', currency: 'ILS' });
  }
  
  private budgetLinkFormatter(value: string, hLink: string)
  {
    return '<a>' + value + '</a>';
  }

  getItemData(query: string, headersOrder: string[], formatters: string[]): Promise<object> {
    let url = 'http://next.obudget.org/api/query?query=' +
      encodeURIComponent(query);
    return new Promise<any>((resolve, reject) => {
      this.http.get(url)
        .map((res: any) => res.json())
        .subscribe(
          (res: any) => {
            let items: object[] = [], rows = res.rows, 
            headers = rows.length > 0 ? _.union(headersOrder, _.keys(_.first(rows))) : [];
            
            _.each(rows, (row) => {
              let newItem: any[] = [];
              
              _.each(headers, (header) => {
                let item = row[header];
                
                (typeof(item) != 'object') &&  _.each(formatters, (formatter) => {
                  const formatterKey = Object.keys(formatter)[0], formatterValue = Object.values(formatter)[0];
                  item = (formatterKey === header) ? this[formatterValue](item) : item;
                });

                newItem.push(item);
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
