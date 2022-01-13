import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { ApiSmartService } from 'src/app/services/api-smart/apismart.service';
import { CustomTooltipComponent } from 'src/app/utils/common/customtooltip.component';
const MAX_SIZE = 100000000;
import { AgGridFn } from 'src/app/utils/common/function-common';
const queryString = require('query-string');
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
@Component({
  selector: 'app-inventory-product',
  templateUrl: './inventory-product.component.html',
  styleUrls: ['./inventory-product.component.css']
})
export class InventoryProductComponent implements OnInit {
  @Input() modelInventory: any;
  public modules: Module[] = AllModules;
  @Output() changeDate = new EventEmitter<any>();
  query = {
    filter: '', storeId: '', fromDate: '', toDate: '', gridWidth: 1300, productId: '', offSet: 0, pageSize: 100000000, status: null
  };
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  objectAction: any;
  gridflexs: any;
  getRowHeight;
  gridColumnApi: any;
  countRecord: any = { totalRecord: 0, currentRecordStart: 0, currentRecordEnd: 0 };
  paginatePage = {
    total: 0
  };
  first = 0;
  items = [];
  rowClassRules;
  agGridFn = AgGridFn;
  constructor(
    private apiSmart: ApiSmartService
  ) {
    this.defaultColDef = {
      resizable: true,
      cellClass: ['border-right'],
      tooltipComponent: 'customTooltip'
    };
    this.getRowHeight = (params) => {
      return 50;
    };

    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent
    };
  }

  ngOnInit(): void {
    this.query.storeId = this.modelInventory.storeId;
    this.query.productId = this.modelInventory.productId;
    this.query.fromDate = moment(this.modelInventory.fromDate).format('YYYY-MM-DD');
    this.query.toDate = moment(this.modelInventory.toDate).format('YYYY-MM-DD');
    this.getInventoryByProductPage();
  }

  getInventoryByProductPage(): void {
    const queryParams = queryString.stringify(this.query);
    this.apiSmart.getInventoryByProductPage(queryParams)
    .subscribe(result => {
      if (result.status === 'success') {
        this.items = result.data.dataList.data;
        if (this.query.offSet === 0) {
          this.gridflexs = result.data.gridflexs;
          this.gridflexs.forEach(g => {
            if (g.columnField === 'diff_quantity' || g.columnField === 'diff_amount') {
              g.headerClass = ['clebb878'];
            }
          });
          this.init();
        }
        setTimeout(() => {
          if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
          }
        }, 200);
        this.paginatePage.total = result.data.dataList.recordsTotal;
        this.countRecord.totalRecord = result.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.countRecord.totalRecord === 0 ? this.query.offSet + 0 : this.query.offSet + 1;
        if ((result.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = result.data.dataList.recordsTotal;
        }
      }
    });
  }

  init(): void {
    this.columnDefs = [...this.agGridFn(this.gridflexs)];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  changePageSize() {
    this.getInventoryByProductPage();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.getInventoryByProductPage();
  }

  detectChange(key, event) {
    if (key === 'from_date') {
      this.query.fromDate = moment(event).format('YYYY-MM-DD');
      this.getInventoryByProductPage();
    }

    if (key === 'to_date') {
      this.query.toDate = moment(event).format('YYYY-MM-DD');
      this.getInventoryByProductPage();
    }

    this.changeDate.emit({
      fromDate: moment(this.query.fromDate).toDate(),
      toDate: moment(this.query.toDate).toDate()
    });
  }
}
