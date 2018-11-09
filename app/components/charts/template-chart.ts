import { Component, Input, Inject } from '@angular/core';
import {THEME_TOKEN} from 'budgetkey-ng2-components';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}


@Component({
  selector: 'budgetkey-chart-template',
  template: `
    <div class="budgetkey-chart-template" 
        [innerHtml]="data.template | renderTemplate:data.item:ngComponentsTheme.themeId | safeHtml"></div>
  `,
})
export class TemplateChartComponent {

  @Input() public data: any;

  constructor(@Inject(THEME_TOKEN) private ngComponentsTheme: any) {
  }
}
