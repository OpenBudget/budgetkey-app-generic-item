import { Component, Inject } from '@angular/core';
import {THEME_TOKEN} from '../config';

@Component({
  selector: 'budgetkey-page-header',
  template: `
    <div class="row page-header-wrapper">
      <header>
        <div class="col-xs-2 navbar-brand" style="padding-top: 20px;">{{theme.siteName}}</div>
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
      </header>
    </div>
  `
})
export class HeaderComponent {
  searchTerm: string = '';

  get searchUrl() {
    return 'https://next.obudget.org/s/?q=' + encodeURIComponent(this.searchTerm);
  }

  constructor (@Inject(THEME_TOKEN) private theme: any) {

  }
}
