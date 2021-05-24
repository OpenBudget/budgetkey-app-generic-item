import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { THEME_TOKEN } from 'budgetkey-ng2-components';
import { StoreService } from 'src/app/services';

@Component({
  selector: 'budgetkey-questions-panel',
  templateUrl: './questions-panel.component.html',
  styleUrls: ['./questions-panel.component.less']
})
export class QuestionsPanelComponent implements OnInit {

  @ViewChild('questionsPanel') questionsPanel: ElementRef;
  @ViewChild('dataTable') dataTable: ElementRef;

  constructor(
    public store: StoreService,
    @Inject(THEME_TOKEN) private ngComponentsTheme: any
  ) { }

  ngOnInit() {
  }

  mailto() {
    const subject = `קישור למידע מאתר "${this.ngComponentsTheme.siteName}"`;
    const body = `שלום.

העמוד ״${document.title}״ נשלח אליכם ממכשיר נייד.
לחצו כאן לצפייה בעמוד: ${window.location.href}`;
    return 'mailto:?' +
      'subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body)
    ;
  }

  scrollToTable() {
    const questionsPanelElement = this.questionsPanel.nativeElement as HTMLElement;
    if (questionsPanelElement && questionsPanelElement.scrollIntoView) {
      questionsPanelElement.scrollIntoView({behavior: 'smooth'});
    }
  }

}
