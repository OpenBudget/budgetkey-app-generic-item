import { Component, OnInit } from '@angular/core';
import { forkJoin, from, ReplaySubject } from 'rxjs';
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
    {title: 'אוכלוסיית היעד', id: 'target_audience'},
    {title: 'קבוצת גיל', id: 'target_age_group'},
    {title: 'תחום ההתערבות', id: 'subject', tooltip: 'תחומי התוכן או הנושאים שבהם מתמקד השירות'},
    {title: 'אופן ההתערבות', id: 'intervention', tooltip: 'הדרך או הצורה שבה ניתן השירות'},
    {title: 'סוג המכרז', id: 'tender_type', tooltip: 'הליך מכרזי רגיל או הליך של פטור ממכרז ופירוט של סוג המכרז/סוג הפטור'},
    {title: 'מודל תמחור', id: 'pricing_model', tooltip: 'האם נקבע מראש תעריף לאספקת השירות או שעל המציעים להגיש הצעת מחיר או מודל משולב'},
  ];
  COLORS = [
    // '#AB6701',
    '#87cefa',
    '#ff9900',
    '#6661d1',
    '#68788c',
    '#d6b618',
    '#ef7625',
    '#002070',
    '#44b8e0',
    '#b658cc',
    '#192841',
    '#526223',
  ];

  private parameters: any = {
    pricing_model: [
      {value: 'TRUE', display: 'הכל'},
      {value: `(tenders::text) like '%%"fixed"%%'`, display: 'מחיר קבוע'},
      {value: `(tenders::text) like '%%"proposal"%%'`, display: 'הצעת מחיר'},
      {value: `(tenders::text) like '%%"combined"%%'`, display: 'משולב'},
    ],
    tender_type: [
      {value: 'TRUE', display: 'הכל'},
      {value: `(tenders::text) like '%%"tender_type": "office"%%'`, display: 'מכרז (כל הסוגים)'},
      {value: `(tenders::text) like '%%"tender_type": "exemptions"%%'`, display: 'פטור (כל הסוגים)'},
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
    pricing_model: ['TRUE'],
    tender_type: ['TRUE']
  };
  public currentTab = 'services';
  private chartTemplates = chartTemplates;
  public charts = {};
  public tables = tableDefs;
  public replacements: any[] = [];
  public colorscheme = new ReplaySubject<any>(1);
  public xValues: any = {};

  constructor(private store: StoreService, private api: BudgetKeyItemService) {
    const fields = ['subject', 'intervention', 'target_audience', 'target_age_group'];
    from(fields).pipe(
      mergeMap((field) => {
        return api.getDatarecords(field).pipe(
          map((results) => {
            results = results.sort((a, b) => (a.order || 0) - (b.order || 0));
            return {results, field};
          })
        );
      })
    ).subscribe(({results, field}) => {
      const params = this.processParams(results, field);
      this.parameters[field] = params;
      this.filters[field] = ['TRUE'];
      if (Object.keys(this.parameters).length === fields.length) {
        this.ready.next();
      }
    });
  }

  ngOnInit() {
    this.item = this.store.item;
    // console.log('ITEM', this.item);
    this.processLevel();
    this.fetchColorscheme();
    this.colorscheme.subscribe(() => {
      this.filtersChanged();
      if (this.item.office && !this.item.unit) {
        this.item.unit = '';
        this.subunits = this.xValues[this.item.office];
      }
    });
  }

  fetchColorscheme() {
    const query = `select office, unit, subunit from activities group by 1, 2, 3 order by 1, 2, 3`;
    this.api.getItemData(
      query, ['value', 'value', 'value'], [this.formatter, this.formatter, this.formatter]
    ).pipe(
      map((x: any) => x.rows),
    ).subscribe((rows) => {
      const scheme = {default: 0};
      for (const row of rows) {
        const office = row.office;
        this.xValues.offices = this.xValues.offices || [];
        if (this.xValues.offices.indexOf(office) === -1) {
          scheme[office] = this.xValues.offices.length;
          this.xValues.offices.push(office);
        }
        const unit = row.unit;
        if (unit) {
          this.xValues[office] = this.xValues[office] || [];
          if (this.xValues[office].indexOf(unit) === -1) {
            scheme[unit] = this.xValues[office].length;
            this.xValues[office].push(unit);
          }

          const subunit = row.subunit || 'אחר';
          const key = office + ':' + unit;
          this.xValues[key] = this.xValues[key] || [];
          if (this.xValues[key].indexOf(subunit) === -1) {
            scheme[subunit] = this.xValues[key].length;
            this.xValues[key].push(subunit);
          }
        }
      }
      const orgSizes = ['1', '2-5', '6+']
      const orgKinds = ['עסקי', 'מגזר שלישי', 'רשויות מקומיות', 'משולב'];
      for (const i in orgSizes) {
        scheme[orgSizes[i]] = i;
      }
      for (const i in orgKinds) {
        scheme[orgKinds[i]] = i;
      }
      scheme['אחר'] = 9;
      this.colorscheme.next(scheme);
      this.colorscheme.complete();
    });
  }

  processParams(records, field) {
    const params = [];
    const dflt =  'הכל';
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

  filterExpression(k) {
    return '(' + this.filters[k].join(' OR ') + ')';
  }

  calcWhere() {
    let where = '';
    for (const k of Object.keys(this.filters)) {
      const filter = this.filterExpression(k);
      where += ` ${filter} AND`;
    }
    where += ' ' + this.levelCond;
    where = where.split(' (TRUE) AND').join('');
    where = where.split(' TRUE AND').join('');
    return where;
  }

  filtersChanged() {
    const where = this.calcWhere();
    for (const ct of this.chartTemplates) {
      this.refreshChart(ct, where);
    }
    this.replacements = [
      {from: ':where', to: where},
      {from: ':tender-type', to: this.filterExpression('tender_type')},
      {from: ':pricing-model', to: this.filterExpression('pricing_model')},
    ];
  }

  clearFilters() {
    for (const k of Object.keys(this.filters)) {
      this.filters[k] = ['TRUE'];
    }
    this.filtersChanged()
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
    forkJoin(
      this.colorscheme,
      this.api.getItemData(
        query, ['משרד', 'value'], [this.formatter('משד'), this.formatter('value')]
      )
    ).subscribe(([scheme, result]: any[]) => {
      const layout = ct.layout;
      layout.margin = {t: 20};
      layout.height = 400;
      layout.bargap = 0.5;
      const rows = result.rows || [];
      if (result.error) {
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
      let x_values = [];
      if (ct.kind === 'org') {
        let key = 'offices';
        if (this.item.office) {
          key = this.item.office;
          if (this.item.unit) {
            key += ':' + this.item.unit;
          }
        }
        x_values = this.xValues[key];
      } else {
        console.log('UNKNOWN CHART KIND', ct.title)
      }
      const data = ct.data(rows, ct, x_values);
      for (const d of data) {
        if (scheme.hasOwnProperty(d.name)) {
          const color = this.COLORS[scheme[d.name]];
          d.marker = {
            color: color,
            opacity: 1,
            line: {
              color: color,
              opacity: 1,
            }
          };
        } else {
          console.log('MISSING VALUE', d.name)
        }
      }
      this.charts[ct.id] = {layout, data};
    });
  }

  setSubtitle(ct, rows) {
    if (rows && rows.length) {
      const total = this.sum(rows.map((x) => x[ct.y_field])).toLocaleString('he-IL', {maximumFractionDigits: 0});
      ct._subtitle = ct.subtitle
                          .replace(':total', total)
                          .replace(':max-year', rows[0].max_year)
                          .replace(':min-year', rows[0].min_year)
                          .replace(':org', this.item.breadcrumbs);
    } else {
      ct._subtitle = 'לא נמצאו נתונים';
    }
  }

  doSearch(href) {
    window.open(href, '_self');
  }

  processTitles(ct: any) {
    if (ct.titleTooltip) {
      return `<span class='bk-tooltip-anchor'>${ct.title}<span class='bk-tooltip'>${ct.titleTooltip}</span></span>`;
    } else {
      return ct.title;
    }
  }
}
