import { Component, OnDestroy, ViewChild, ElementRef, Input, OnInit } from "@angular/core";
import { PreparedQuestions, PreparedQuestion } from "../../../model";
import { BudgetKeyItemService, StoreService, EventsService } from "../../..//services";
import { QuestionsManager } from "../questions-manager";

@Component({
  selector: 'budgetkey-item-questions',
  templateUrl: './item-questions.component.html'
})
export class ItemQuestionsComponent implements OnInit, OnDestroy {

  @Input() manager: QuestionsManager;

  private eventSubscriptions: any[] = [];
  isSearching: boolean;

  preparedQuestions: PreparedQuestions;
  currentQuestion: PreparedQuestion;
  redashUrl: string;
  downloadUrl: string;
  downloadUrlXlsx: string;

  @ViewChild('btnToggleItemQuest') btnToggleItemQuest: ElementRef;

  constructor(
    private itemService: BudgetKeyItemService, private store: StoreService,
  ) {
  }

  ngOnInit() {
    this.eventSubscriptions = [
      this.store.itemChange.subscribe(() => this.onStoreChanged()),
      this.manager.preparedQuestionsChange.subscribe(() => this.onStoreChanged()),
      this.manager.dataQueryChange.subscribe(() => this.onStoreChanged()),
      this.manager.onDataReady.subscribe(() => {this.isSearching = false; })
    ];
    this.onStoreChanged();
  }

  selectQuestion(question: PreparedQuestion) {
    if (this.manager.currentQuestion !== question) {
      this.manager.currentQuestion = question;
      this.manager.currentParameters = question.defaults;
    }
  }

  private onStoreChanged() {
    if (!this.manager.currentQuestion) {
      this.currentQuestion = undefined;
      this.redashUrl = '';
      this.downloadUrl = '';
      this.downloadUrlXlsx = '';
      return;
    }

    this.preparedQuestions = this.store.preparedQuestions;
    this.currentQuestion = this.store.currentQuestion;
    this.redashUrl = this.itemService.getRedashUrl(this.store.dataQuery);

    // Create a filename - item name + current question, so for example:
    // wingate institute__annual summary of communications

    // For the name, take either name, title, page title
    let entityName = '';
    if (this.store.item.name) {
      entityName = this.store.item.name;
    } else if (this.store.item.title) {
      entityName = this.store.item.title;
    } else if (this.store.item.page_title) {
      entityName = this.store.item.page_title;
    }

    // Create the question
    let question = '';
    for (let i = 0; i < this.manager.currentQuestion.parsed.length; i++) {
      question = question + this.manager.currentQuestion.parsed[i].value;
    }

    const fileName = entityName + '__' + question;

    this.downloadUrl =
      this.itemService.getDownloadUrl(
          this.store.dataQuery,
          'csv',
          this.store.currentQuestion.originalHeaders,
          fileName
      );
    this.downloadUrlXlsx =
      this.itemService.getDownloadUrl(
          this.store.dataQuery,
          'xlsx',
          this.store.currentQuestion.originalHeaders,
          fileName
      );
    this.isSearching = true;
  }

  get currentParameters() {
    return this.manager.currentParameters;
  }
  
  setParameter(key: string, value: string) {
    const params = Object.assign({}, this.manager.currentParameters);
    params[key] = value;
    this.manager.currentParameters = params;
  }

  ngOnDestroy() {
    this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.eventSubscriptions = [];
  }

}