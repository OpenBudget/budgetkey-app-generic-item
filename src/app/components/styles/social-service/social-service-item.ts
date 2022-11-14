import { Component, OnInit } from '@angular/core';
import { BudgetKeyItemService } from '../../../services';

import { StoreService } from '../../../services/store';

import { tableDefs } from './tables';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'social-service-item',
    templateUrl: `./social-service-item.html`,
    styleUrls: [`./social-service-item.less`]
})
export class SocialServiceItemComponent implements OnInit {

  item: any;
  budget_chart: any;
  beneficiary_chart: any;
  tables = tableDefs;
  replacements: any[] = [];
  supplierRegions = {};
  REGIONS = [
    'ארצי',
    'מרכז',
    'צפון',
    'דרום',
    'ירושלים ויו"ש'
  ];

  constructor(private store: StoreService, private api: BudgetKeyItemService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.item = this.store.item;
    this.replacements = [
      {from: ':where', to: `id = '${this.item.id}'`}
    ];
    this.item.breadcrumbs = [this.item.office, this.item.unit, this.item.subunit, this.item.subsubunit].filter(x => !!x).join(' / ');
    this.item.catalog_number = parseInt(this.item.catalog_number, 10) || null;
    // console.log('ITEM=', this.item);
    const budget = this.item.manualBudget.sort((a, b) => a.year - b.year).filter(x => x.year <= 2021);
    const beneficiaries = this.item.beneficiaries.sort((a, b) => a.year - b.year);
    this.budget_chart = {
      layout: {
        margin: {t: 20, r:40},
        height: 400,
        yaxis: {
          rangemode: 'tozero',
          title: '₪ תקציב השירות במיליוני',
          hoverformat: ',.0f',
        },
        xaxis: {
          dtick: 1,
          title: 'שנת התקציב'
        }
      },
      data: [{
        type: 'line',
        line: {
          dash: 'dot',
        },
        marker: {
          color: '#87cefa',
          opacity: 1,
          line: {
            color: '#87cefa',
            opacity: 1
          }
        },
        name: 'תקציב מאושר',
        x: budget.map(x => x.year),
        y: budget.map(x => x.approved/1000000.0),
        text: budget.map(x => Math.floor(x.approved).toLocaleString()),
        hovertemplate: '₪%{text}',
      }, {
        type: 'line',
        line: {
          dash: 'dot',
        },
        marker: {
          color: '#ff9900',
          opacity: 1,
          line: {
            color: '#ff9900',
            opacity: 1
          }
        },
        name: 'ביצוע בפועל',
        x: budget.map(x => x.year),
        y: budget.map(x => x.executed/1000000.0),
        text: budget.map(x => Math.floor(x.executed).toLocaleString()),
        hovertemplate: '₪%{text}',
      }]
    };
    this.beneficiary_chart = {
      layout: {
        margin: {t: 20, r:40},
        height: 400,
        yaxis: {
          rangemode: 'tozero',
          title: 'מספר מוטבים',
        },
        xaxis: {
          dtick: 1,
          title: 'שנה',
        }
      },
      data: [{
        type: 'line',
        marker: {
          color: '#6661d1',
          opacity: 1,
          line: {
            color: '#6661d1',
            opacity: 1
          }
        },
        x: beneficiaries.map(x => x.year),
        y: beneficiaries.map(x => x.num_beneficiaries),
      }]
    };
    this.analyzeSupplierGeo();
    if (window.innerWidth < 600) {
      alert('מומלץ לפתוח ממחשב שולחני לשימוש מיטבי');
    }
  }

  analyzeSupplierGeo() {
    for (const supplier of this.item.suppliers) {
      if (supplier.geo) {
        for (const geo of supplier.geo) {
          this.supplierRegions[geo] = this.supplierRegions[geo] || {count: 0, suppliers: []};
          this.supplierRegions[geo].count++;
          this.supplierRegions[geo].suppliers.push(supplier.entity_name);
        }
      }
    }
  }

  countForRegion(region) {
    let count = ((this.supplierRegions['ארצי'] || {}).count || 0);
    if (this.supplierRegions[region]) {
      count += this.supplierRegions[region].count;
    }
    console.log('this.supplierRegions', count, this.supplierRegions[region])
    return count;
  }

  titleForRegion(region) {
    let ret = '';
    let count = this.countForRegion(region);
    if (count > 0) {
      ret += count === 1 ? 'מפעיל אחד' : `${count} מפעילים:`; 
      ret += '\n';
    }
    for (const r of [region, 'ארצי']) {
      if (this.supplierRegions[r]) {
        const sr = this.supplierRegions[r];
        const suppliers = (sr.suppliers as string[]).map(x => `- ${x}`).join('\n');
        ret += `${r}\n${suppliers}\n`;
      }
    }
    return ret;
  }
  

  mapFillFor(region) {
    const count = this.countForRegion(region);
    let ret = '';
    if (count < 1) {
      ret += 'fill: #00000000';
    }
    else if (count === 1) {
      ret += 'fill: #ef7625;';
      ret += 'stroke: #ef7625';
    }
    else if (count < 5) {
      ret += 'fill: #d6b618;';
      ret += 'stroke: #d6b618';
    }
    else if (count > 5) {
      ret += 'fill: #44b8e0;';
      ret += 'stroke: #44b8e0';
    }
    return this.sanitizer.bypassSecurityTrustStyle(ret);
  }

  get virtue_of_table() {
    return (this.item.virtue_of_table || []).filter(i => i.kind !== 'לא רלוונטי');
  }
}
