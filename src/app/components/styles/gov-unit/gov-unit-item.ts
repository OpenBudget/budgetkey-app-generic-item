import { Component, OnInit } from '@angular/core';
import { from, ReplaySubject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { BudgetKeyItemService } from '../../../services';

import { StoreService } from '../../../services/store';

import { chartTemplates } from './charts';
import { tableDefs } from './tables';

@Component({
    selector: 'gov-unit-item',
    templateUrl: `./gov-unit-item.html`,
    styleUrls: [`./gov-unit-item.less`]
})
export class GovUnitItemComponent implements OnInit {

  private item: any;

  PAGE_LINKS = [
    {title: 'משרדי הממשלה', href: '/i/units/gov_social_service_unit/main'},
    {title: 'משרד הרווחה', href: '/i/units/gov_social_service_unit/משרד הרווחה'},
    {title: 'משרד הבריאות', href: '/i/units/gov_social_service_unit/משרד הבריאות'},
    {title: 'משרד החינוך', href: '/i/units/gov_social_service_unit/משרד החינוך'},
  ];   
  PAGE_FILTERS = [
    {title: 'אופן ההתערבות', id: 'intervention'},
    {title: 'קבוצת גיל', id: 'target_age_group'},
    {title: 'אוכלוסיית היעד', id: 'target_audience'},
    {title: 'תחום ההתערבות', id: 'subject'},
    {title: 'סוג המכרז', id: 'tender_type'},
    {title: 'מודל תמחור', id: 'pricing_model'},
  ];

  private parameters: any = {
    pricing_model: [
      {value: 'TRUE', display: 'כלשהו'},
      {value: `(tenders::text) like '%%"fixed"%%'`, display: 'מחיר קבוע'},
      {value: `(tenders::text) like '%%"proposal"%%'`, display: 'הצעת מחיר'},
      {value: `(tenders::text) like '%%"combined"%%'`, display: 'משולב'},
    ],
    tender_type: [
      {value: 'TRUE', display: 'כלשהו'},
    ].concat([
      'מכרז רגיל', 'מכרז סגור', 'מכרז מסגרת', 'מכרז מאגר',
      'התקשרות המשך', 'ספק יחיד', 'מימוש אופציה', 'מיזם משותף', 'התקשרות עם רשות מקומית',
      'אחר'
    ].map((x) => { return {value: `(tenders::text) like '%%"sub_kind_he": "${x}"%%'`, display: x}; }))
  };
  private levelCond = 'TRUE';
  private groupByLvl: string = null;
  private subunits = null;
  private ready = new ReplaySubject<void>(1);
  private filters = {
    pricing_model: 'TRUE',
    tender_type: 'TRUE'
  };
  public currentTab = 'services';
  private chartTemplates = chartTemplates;
  public charts = {};
  public TABLES = tableDefs;
  public _currentTable: any = this.TABLES.services;

  constructor(private store: StoreService, private api: BudgetKeyItemService) {
    const fields = ['subject', 'intervention', 'target_audience', 'target_age_group'];
    from(fields).pipe(
      mergeMap((field) => {
        return api.getDatarecords(field).pipe(
          map((results) => {
            return {results, field};
          })
        );
      })
    ).subscribe(({results, field}) => {
      const params = this.processParams(results, field, field === 'target_age_group' || field === 'target_audience');
      this.parameters[field] = params;
      this.filters[field] = 'TRUE';
      if (Object.keys(this.parameters).length === fields.length) {
        this.ready.next();
      }
    });
  }

  ngOnInit() {
    this.item = this.store.item;
    // console.log('ITEM', this.item);
    this.processLevel();
    // this.item.charts = [];
    // this.ready.pipe(first()).subscribe(() => {
    //   this.item.charts = [
    //     {
    //       title: 'שירותים',
    //       long_title: 'השירותים החברתיים במיקור חוץ',
    //       description: 'מידע נוסף על השירותים החברתיים, התקציב שלהם ומאפיינים נוספים שלהם',
    //       type: 'questions',
    //       label: 'שאילתות<br/>מוכנות',
    //       questions: QuestionParser.processQuestions(this.servicesQuestions(this.item))
    //     },
    //     {
    //       title: 'תקציב',
    //       long_title: 'התקציב המוקצב לשירותים השונים',
    //       description: 'התקציב המאושר והמבוצע לשירותים השונים, כפי שדווח על ידי המשרדים.',
    //     },
    //     {
    //       title: 'מפעילים',
    //       long_title: 'הגופים המפעילים את השירותים השונים',
    //       description: 'מידע נוסף על הספקים או העמותות המפעילות את השירותים החברתיים ומאפיינים נוספים שלהם',
    //     },
    //   ];
    //   this.store.item = this.store.item;
    // });
    this.filtersChanged();
    if (this.item.office && !this.item.unit) {
      this.item.unit = '';
      this.getSubunits(this.item.office);
    }
  }

  getSubunits(office) {
    const query = `select distinct unit as unit from activities where office='${office}'`;
    this.api.getItemData(
      query, ['value'], [this.formatter]
    ).pipe(
      map((x: any) => x.rows),
      map((x: any[]) => x.map((y) => y.unit)),
    ).subscribe((rows) => {
      this.subunits = rows.filter((x) => x);
    })
  }

  processParams(records, field, female) {
    const params = [];
    const dflt = female ? 'כלשהי' : 'כלשהו';
    params.push({
      display: dflt,
      value: 'TRUE'
    });
    for (const rec of records) {
      params.push({
        display: rec['name'],
        value: `(${field}::text) LIKE '%%"${rec.name}"%%'`
      })
    }
    return params;
  }

  processLevel() {
    const levelCondParts = [];
    this.groupByLvl = null;
    for (const lvl of ['office', 'unit', 'subunit', 'subsubunit']) {
      if (this.item[lvl]) {
        levelCondParts.push(`${lvl} = '${this.item[lvl]}'`);
      } else if (!this.groupByLvl) {
        this.groupByLvl = lvl;
      } else {
        break;
      }
    }
    this.levelCond = levelCondParts.join(' AND ') || 'TRUE';
  }

  formatter(f) {
    return (row) => '' + row[f];
  }

  calcWhere() {
    let where = '';
    for (const k of Object.keys(this.filters)) {
      where += ` ${this.filters[k]} AND`;
    }
    where += ' ' + this.levelCond;
    where = where.split(' TRUE AND').join('');
    return where;
  }

  filtersChanged() {
    const where = this.calcWhere();
    for (const ct of this.chartTemplates) {
      this.refreshChart(ct, where);
    }
    for (const tbl of Object.keys(this.TABLES)) {
      this.refreshTable(this.TABLES[tbl], where);
    }
  }

  sum(arr): number {
    return arr.reduce(function(a, b){
      return a + b;
    }, 0);
  }

  replaceAll(query, conf) {
    for (const {from, to} of conf) {
      query = query.split(from).join(to);
    }
    return query;
  }

  prepareChartQuery(query, where) {
    return this.replaceAll(
      query,
      [
        {from: ':where', to: where},
        {from: ':org-field', to: `coalesce("${this.groupByLvl}", 'אחר')`},
      ]
    );
  }

  refreshChart(ct, where) {
    const query = this.prepareChartQuery(ct.query, where);
    this.api.getItemData(
      query, ['משרד', 'value'], [this.formatter('משד'), this.formatter('value')]
    ).subscribe((result: any) => {
      const layout = ct.layout;
      layout.margin = {t: 20, l:30};
      layout.height = 400;
      const rows = result.rows || [];
      if (result.error || rows.length === 0) {
        console.log('ERROR', query, result.error);
      }
      if (ct.subtitleQuery) {
        this.api.getItemData(
          this.prepareChartQuery(ct.subtitleQuery, where),
          ['משרד', 'value'], [this.formatter('משד'), this.formatter('value')]
        ).subscribe((result: any) => {
          const rows = result.rows || [];
          this.setSubtitle(ct, rows);
        });
      } else {
        this.setSubtitle(ct, rows);
      }
      const data = ct.data(rows, ct);
      this.charts[ct.id] = {layout, data};
    });
  }

  setSubtitle(ct, rows) {
    const total = this.sum(rows.map((x) => x[ct.y_field])).toLocaleString('he-IL', {maximumFractionDigits: 2});
    ct._subtitle = ct.subtitle
                        .replace(':total', total)
                        .replace(':max-year', rows[0].max_year)
                        .replace(':min-year', rows[0].min_year)
                        .replace(':org', this.item.breadcrumbs);
  }

  refreshTable(tbl, where) {
    if (!tbl.query) {
      return;
    }
    let query = this.replaceAll(
      tbl.query,
      [
        {from: ':where', to: where},
        {from: ':tender-type', to: this.filters.tender_type},
        {from: ':pricing-model', to: this.filters.pricing_model},
        {from: ':fields', to: tbl.fields.join(', ')},
      ]
    );
    if (!tbl.actualQuery || tbl.actualQuery !== query) {
      tbl.actualQuery = query;
      tbl.currentPage = 0;
    }
    if (tbl.sortField) {
      if (tbl.sortDirectionDesc) {
        query = query + ` ORDER BY ${tbl.sortField} DESC NULLS LAST`
      } else {
        query = query + ` ORDER BY ${tbl.sortField} ASC NULLS LAST`
      }
    }
    const formatters = [];
    tbl.fields.forEach(f => {
      formatters.push(this.formatter(f));
    });
    this.api.getItemData(
      query, tbl.fields, formatters, tbl.currentPage
    ).subscribe((result: any) => {
      tbl.rows = result.rows;
      tbl.currentPage = result.page;
      tbl.totalPages = result.pages;
      tbl.totalRows = result.total;
    });
  }

  set currentTable(value) {
    if (value !== this._currentTable) {
      this._currentTable = value;
      this._currentTable.sortField = this._currentTable.sortField || this._currentTable.sorting[0];
    }      
  }

  get currentTable() {
    return this._currentTable;
  }

  sortBy(field) {
    if (this._currentTable.sortField !== field) {
      this._currentTable.sortField = field;
      this._currentTable.sortDirectionDesc = false;
    } else {
      this._currentTable.sortDirectionDesc = !this._currentTable.sortDirectionDesc;
    }
    this.refreshTable(this._currentTable, this.calcWhere());
  }

  movePage(by) {
    const current = this.currentTable.currentPage;
    this.currentTable.currentPage += by;
    this.currentTable.currentPage = Math.max(this.currentTable.currentPage, 0);
    this.currentTable.currentPage = Math.min(this.currentTable.currentPage, this.currentTable.totalPages - 1);
    if (current !== this.currentTable.currentPage) {
      this.refreshTable(this._currentTable, this.calcWhere());
    }
  }

  download() {
    const filename = `${this.item.page_title} / מידע על ${this.currentTable.name}`;
    const url = this.api.getDownloadUrl(this.currentTable.actualQuery, 'xlsx', this.currentTable.downloadHeaders, filename)
    window.open(url, '_blank');
  }
}
