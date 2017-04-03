import { Component, Input, OnInit } from '@angular/core';
import { BudgetKeyIntro } from './introduction';

@Component({
  selector: 'budgetkey-item-body',
  template:`
  <budgetkey-item-intro></budgetkey-item-intro>
  <where-is-the-money></where-is-the-money>
  `
})

export class BudgetKeyItemBody{
}
