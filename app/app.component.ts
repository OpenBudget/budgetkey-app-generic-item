import { Component, OnInit } from '@angular/core';
import { BudgetKeyContenetService } from './budgetkey-content.service';

@Component({
  selector: 'my-app',
  template: `
    <budgetkey-container>
    <budgetkey-item-header></budgetkey-item-header>

    <ul class="content-table">
      <li *ngFor="let content of contents">
        {{content.name}}
      </li>
    </ul>

    <budgetkey-item-body></budgetkey-item-body>
    </budgetkey-container>
  `,
  providers: [BudgetKeyContenetService]
})

export class AppComponent implements OnInit {
  contents: {};

  constructor(private contentsService: BudgetKeyContenetService) { }

  getContents(): void {
    this.contents = this.contentsService.getContents();
  }

  ngOnInit(): void {
    this.getContents();
  }
}
