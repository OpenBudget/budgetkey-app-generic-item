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
    return '//next.obudget.org/api/query?query=' +
      encodeURIComponent(query);
  }

  getDownloadCSVUrl(query: string): string {
    return '//next.obudget.org/api/download?query=' +
      encodeURIComponent(query);
  }

  getItem(itemId: string): Promise<Item> {
    let url = '//next.obudget.org/get/' + itemId;
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

  private _budgetNumberFormatter(value: any) {
    value = parseFloat(value);

    return isFinite(value)
      ? value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })
      : '-';
  }

  private _budgetLinkFormatter(value: string) {
    if (!value) {
      return '';
    }
    return '<a href="' + value + '">קישור</a>';
  }

  private _budgetLinkTitleFormatter(value: string) {
    if (!value) {
      return '';
    }
    let parts = value.split('#', 2);
    if (parts.length < 2) return value;
    return '<a href="' + parts[0] + '">' + parts[1] + '</a>';
  }

  private _budgetItemTitleFormatter(value: string) {
    if (!value) {
      return '';
    }
    let parts = value.split('#', 2);
    if (parts.length < 2) {
      return value;
    }
    return '<a href="https://next.obudget.org/i/' + parts[0] + '">' + parts[1] + '</a>';
  }

  private _budgetSearchTitleFormatter(value: string) {
    if (!value) {
      return '';
    }
    let parts = value.split('#', 3);
    if (parts.length < 3) {
      return value;
    }
    return '<a href="https://next.obudget.org/s?q=' +
      encodeURIComponent(parts[0]) + '&dd=' + encodeURIComponent(parts[1]) + '">' + parts[2] + '</a>';
  }

  getItemData(query: string, headersOrder: string[], formatters: object): Promise<object> {
    const url = '//next.obudget.org/api/query?query=' + encodeURIComponent(query);

    return new Promise<any>((resolve, reject) => {
      this.http.get(url)
        .map((res: any) => res.json())
        .subscribe(
          (res: any) => {
            let items: object[] = [];
            let rows = res.rows;
            let total = res.total;
            let headers = rows.length > 0 ? _.union(headersOrder, _.keys(_.first(rows))) : [];

            _.each(rows, (row) => {
              let newItem: any[] = [];

              _.each(headers, (header) => {
                let item = formatters[header] ? this[formatters[header]](row[header]) : row[header];
                newItem.push(item);
              });
              items.push(newItem);
            });
            resolve({query, headers, items, total});
          },
          () => reject(new Error('Cannot load ' + url))
        );
    });
  }
}
