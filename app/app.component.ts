import { Component } from '@angular/core';

import { GREETING } from './config';

@Component({
  selector: 'my-app',
  styles: [`
    budgetkey-container {
        background-color: #cfc;
        display: block;
    }
    
    .container-fluid {
        padding: 10px;
        max-width: 1024px;
    }
  `],
  template: `
      <budgetkey-container>
        <div class="container-fluid">
            <h1>{{greeting}}</h1>    
            <img src="assets/img/smiley.jpg">
        </div>      
      </budgetkey-container>
  `,
})
export class AppComponent  {
  greeting = GREETING;
}
