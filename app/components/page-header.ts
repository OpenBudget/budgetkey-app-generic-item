import { Component, Inject } from '@angular/core';
import {THEME_TOKEN} from '../config';

@Component({
  selector: 'budgetkey-page-header',
  template: `
    <div class="row page-header-wrapper">
      <div class="col-xs-2" style="padding-top: 20px;">{{theme.siteName}}</div>
      <div class="col-xs-8">
        <div class="row">
          <div class="col-xs-1"></div>
          <form ngNoForm method="get" [action]="searchUrl" class="col-xs-10">
            <input type="text" [placeholder]="theme.searchPlaceholder"
              [(ngModel)]="searchTerm" [ngModelOptions]="{standalone: true}"> 
            <button type="submit"></button>
          </form>
          <div class="col-xs-1"></div>
        </div>
      </div>
      <div class="col-xs-2"></div>
    </div>
  `
})
export class HeaderComponent {
  searchTerm: string = '';

  get searchUrl() {
    return 'http://next.obudget.org/app/search/#/search?term=' +
      encodeURIComponent(this.searchTerm);
  }

  constructor (@Inject(THEME_TOKEN) private theme: any) {

  }
}
