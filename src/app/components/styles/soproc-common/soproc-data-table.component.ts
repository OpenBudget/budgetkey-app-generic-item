import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { BudgetKeyItemService } from "src/app/services";

@Component({
  selector: 'soproc-data-table',
  templateUrl: `./soproc-data-table.component.html`,
  styleUrls: [`./soproc-data-table.component.less`]
})
export class SoProcDatatableComponent implements OnInit, OnChanges {

  @Input() item: any;
  @Input() tables: any;
  @Input() replacements: any[];
  @Input() default: string;
  @Input() filename: string;
  public _currentTable: any;
  public _tableKeys: string[] = [];

  constructor(private api: BudgetKeyItemService) {
  }

  ngOnChanges() {
    this._tableKeys = Object.keys(this.tables);
    this.refresh();
  }

  ngOnInit() {
    this._currentTable = this.tables[this.default];
  }

  refresh() {
    for (const tbl of Object.keys(this.tables)) {
      this.refreshTable(this.tables[tbl]);
    }
  }

  refreshTable(tbl: any) {
    if (!tbl.query) {
        return;
    }
    let query = this.replaceAll(
      tbl.query, this.replacements.concat([{from: ':fields', to: tbl.fields.join(', ')}])
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
        if (result.error) {
          console.log('ERROR', query, result.error);
        }  
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
      this.refreshTable(this._currentTable);
    }
    
    movePage(by) {
      const current = this.currentTable.currentPage;
      this.currentTable.currentPage += by;
      this.currentTable.currentPage = Math.max(this.currentTable.currentPage, 0);
      this.currentTable.currentPage = Math.min(this.currentTable.currentPage, this.currentTable.totalPages - 1);
      if (current !== this.currentTable.currentPage) {
        this.refreshTable(this._currentTable);
      }
    }
    
    download() {
      const filename = `${this.filename} / מידע על ${this.currentTable.name}`;
      const url = this.api.getDownloadUrl(this.currentTable.actualQuery, 'xlsx', this.currentTable.downloadHeaders, filename)
      window.open(url, '_blank');
    }
    
    downloadReportUrl() {
      const url = `https://next.obudget.org/datapackages/reports/services/שירותים חברתיים - ${this.item.office}.xlsx`;
      return url;
    }

    doSearch(href) {
      window.open(href, '_self');
    }
  
    replaceAll(query, conf) {
      for (const {from, to} of conf) {
        query = query.split(from).join(to);
      }
      return query;
    }

    formatter(f) {
      return (row) => '' + row[f];
    }
}
