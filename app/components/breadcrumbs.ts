import { Component } from '@angular/core';

@Component({
  selector: 'budgetkey-breadcrumbs',
  template: `
    <div class="row budgetkey-breadcrumbs-wrapper">
      <div class="col-xs-1"></div>
      <div class="col-xs-10">
        <div class="row">
          <div class="col-xs-8">
            <ul class="breadcrumbs-items">
              <li>שיכון</li>
            </ul>  
          </div>
          <div class="col-xs-4 text-left year-select">
            <i>&#9656;</i>
            <span>2017</span>
            <i>&#9666;</i>
          </div>
        </div>
      </div>
      <div class="col-xs-1"></div>
    </div>  
  `
})
export class BeadcrumbsComponent {
}
