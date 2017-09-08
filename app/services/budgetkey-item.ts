import { Injectable } from '@angular/core';
import * as Promise from 'bluebird';
import descriptors from '../descriptors';

import { Item, Descriptor } from '../model';

@Injectable()
export class BudgetKeyItemService {
  getItem(): Promise<Item> {
    // TODO: Stub - remove when API implemented
    return Promise.resolve({
      id: '70.05',
      type: 'org/company',
      amount: '774,173,000 ₪',
      name: 'דיור ציבורי',
      description: `
                    תחום פעולה במשרד השיכון הכולל 9 תכניות.
              רוב התקציב יוצא דרך רכש של ציוד ושירותים, לרוב בפטור ממכרז.
              המובילים בתקצוב מתחום פעולה זה הן חברות עמידר, וחלמיש.
              מתחילת השנה, 12 העברות הגדילו לכדי 367%⬆ מסכומו המקורי (210,727,000 ₪).
              ב4 השנים האחרונות באופן קבוע, סעיף זה גדל בהעברות עד לכדי פי 3 מתקציבו המקורי.
              השנה התקציב התנפח יותר מבדרך כלל הן ביחס לתקציב המקורי והן ביחס לשנים קודמות.
      `
    });
  }

  getItemDescriptor(type: string): Promise<Descriptor> {
    type = type.replace(/^[/]+/, '').replace(/[/]+$/, '');
    return type in descriptors ? Promise.resolve(descriptors[type]) :
      Promise.reject(new Error('No layout for ' + type));
  }

  getItemData(query: string): Promise<object> {
    // TODO: Stub - remove when API implemented
    // Return random data
    let result = [];
    for (let i = 0; i < 10; i++) {
      let row = [];
      for (let j = 0; j < 5; j++) {
        row.push(Number(Math.random() * 100000).toFixed(2));
      }
      result.push(row);
    }
    return Promise.resolve({
      query: query,
      items: result
    });
  }
}
