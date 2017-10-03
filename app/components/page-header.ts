import { Component } from '@angular/core';

@Component({
  selector: 'budgetkey-page-header',
  template: `
    <div class="row page-header-wrapper">
      <div class="col-xs-2" style="padding-top: 20px;">מפתח התקציב</div>
      <div class="col-xs-8">
        <div class="row">
          <div class="col-xs-1"></div>
          <form ngNoForm method="get" [action]="searchUrl" class="col-xs-10">
            <input type="text" placeholder="חפשו הכל.. סעיף תקציבי, ארגון, אדם, או כל דבר אחר העולה על דעתכם.."
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
}
