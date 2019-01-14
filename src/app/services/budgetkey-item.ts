import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import descriptors from '../descriptors';

import { Item, DescriptorBase } from '../model';
import {THEME_TOKEN} from 'budgetkey-ng2-components';
import { format_number } from '../pipes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BudgetKeyItemService {
  constructor(private http: HttpClient, @Inject(THEME_TOKEN) private ngComponentsTheme: any) {
    for (const descriptor of descriptors) {
      descriptor.init(this.ngComponentsTheme.themeId);
    }
  }

  getRedashUrl(query: string): string {
    // TODO: Implement
    return '//next.obudget.org/api/query?query=' +
      encodeURIComponent(query);
  }

  getDownloadUrl(query: string, format: string, headers: string[], fileName: string): string {
    return '//next.obudget.org/api/download?query=' + encodeURIComponent(query) +
      '&format=' + format +
      '&filename=' + fileName +
      '&headers=' + encodeURIComponent(headers.join(';'));
  }

  getItem(itemId: string): Observable<Item> {
    const url = 'https://next.obudget.org/get/' + itemId;
    return this.http.get(url)
        .pipe(
          map((res: any) => res.value)
        );
  }

  getItemDescriptor(path: string): DescriptorBase {
    path = path.replace(/^[/]+/, '').replace(/[/]+$/, '');
    for (const descriptor of descriptors) {
      const searchPattern = new RegExp('^' + descriptor.pathPrefix);
      if (searchPattern.test(path)) {
        return descriptor;
      }
    }
  }

  private _budgetNumberFormatter(value: any) {
    value = parseFloat(value);

    return isFinite(value)
      ? format_number(value)
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
    const parts = value.split('#', 2);
    if (parts.length < 2) {
      return value;
    }
    return '<a href="' + parts[0] + '">' + parts[1] + '</a>';
  }

  private _budgetItemTitleFormatter(value: string) {
    if (!value) {
      return '';
    }
    const parts = value.split('#', 2);
    if (parts.length < 2) {
      return value;
    }

    return '<a href="https://next.obudget.org/i/' + parts[0]
      + (this.ngComponentsTheme.themeId ? '?theme=' + this.ngComponentsTheme.themeId : '') +
      '">' + parts[1] + '</a>';
  }

  private _budgetSearchTitleFormatter(value: string) {
    if (!value) {
      return '';
    }
    const parts = value.split('#', 3);
    if (parts.length < 3) {
      return value;
    }
    return '<a href="https://next.obudget.org/s?q=' +
      encodeURIComponent(parts[0]) + '&dd=' + encodeURIComponent(parts[1]) +
        (this.ngComponentsTheme.themeId ? '&theme=' + this.ngComponentsTheme.themeId : '') + '">' + parts[2] + '</a>';
  }

  getItemData(query: string, headersOrder: string[], formatters: any[]): Observable<object> {
    const url = 'https://next.obudget.org/api/query?query=' + encodeURIComponent(query);

    return this.http.get(url)
        .pipe(
          map(
            (res: any) => {
              const items: object[] = [];
              const rows = res.rows;
              const total = res.total;
              const headers = headersOrder;

              _.each(rows, (row) => {
                const newItem: any[] = [];

                _.each(formatters, (formatter) => {
                  const item = formatter(row);
                  newItem.push(item);
                });
                items.push(newItem);
              });
              return {query, headers, items, total};
            }),
        );
  }
}
