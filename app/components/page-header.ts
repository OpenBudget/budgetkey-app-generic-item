import { Component } from '@angular/core';

@Component({
  selector: 'budgetkey-page-header',
  template: `
    <div class="row page-header-wrapper">
      <div class="col-xs-2" style="padding-top: 20px;">מפתח התקציב</div>
      <div class="col-xs-8">
        <div class="row">
          <div class="col-xs-1"></div>
          <div class="col-xs-10">
            <input type="text" placeholder="חפשו הכל.. סעיף תקציבי, ארגון, אדם, או כל דבר אחר העולה על דעתכם..">            
          </div>
          <div class="col-xs-1"></div>
        </div>
      </div>
      <div class="col-xs-2"></div>
    </div>
  `
})
export class HeaderComponent {
}
