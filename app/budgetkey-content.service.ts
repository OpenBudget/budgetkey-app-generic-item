import { Injectable } from '@angular/core';

class Content {
  id: number;
  name: string;
}

export const Contents: Content[] = [
  {id: 1, name: 'תובנות'},
  {id: 2, name: 'לאן הולך הכסף?'},
  {id: 3, name: 'מה מתוקצב פה?'},
  {id: 4, name: 'איך השתנה התקציב?'},
  {id: 5, name: 'מה לגבי הכנסות?'},
  {id: 6, name: 'מה עוד?'}
]

@Injectable()
export class BudgetKeyContenetService {

  getContents(): Content[] {
    return Contents
  }
}
