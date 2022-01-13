import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { ApiSmartService } from 'src/app/services/api-smart/apismart.service';
import { CustomTooltipComponent } from 'src/app/utils/common/customtooltip.component';
const MAX_SIZE = 100000000;
const queryString = require('query-string');
import { AgGridFn } from 'src/app/utils/common/function-common';
import { Router } from '@angular/router';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
@Component({
  selector: 'app-cancel-product',
  templateUrl: './cancel-product.component.html',
  styleUrls: ['./cancel-product.component.css']
})
export class CancelProductComponent implements OnInit {
  @Input() modelCancel: any;
  public modules: Module[] = AllModules;
  @Output() changeDate = new EventEmitter<any>();
  query = {
    filter: '', storeId: '', fromDate: '', toDate: '', gridWidth: 1300, productId: '', offSet: 0, pageSize: 100000000, supplierId: null,
    reason: null, employeeId: null
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
    private apiSmart: ApiSmartService,
    private router: Router
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
    this.query.storeId = this.modelCancel.storeId;
    this.query.productId = this.modelCancel.productId;
    this.query.fromDate = moment(this.modelCancel.fromDate).format('YYYY-MM-DD');
    this.query.toDate = moment(this.modelCancel.toDate).format('YYYY-MM-DD');
    this.getStockDiaryByProductPage();
  }

  getStockDiaryByProductPage(): void {
    const queryParams = queryString.stringify(this.query);
    this.apiSmart.getStockDiaryByProductPage(queryParams)
    .subscribe(result => {
      if (result.status === 'success') {
        this.items = result.data.dataList.data;
        if (this.query.offSet === 0) {
          this.gridflexs = result.data.gridflexs;
          this.gridflexs.forEach(g => {
            if (g.columnField === 'stock_no') {
              g.cellClass = [...g.cellClass, 'text-link', 'cursor-pointer'];
            }
            if (g.columnField === 'quantity' || g.columnField === 'remain_amount') {
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

  cellClicked(event): void {
    if (event.colDef.field === 'stock_no') {
      localStorage.setItem('reasonPurchase', JSON.stringify(12));
      localStorage.setItem('pathPurchase', '/exchange/export-cancel-product-page');
      localStorage.setItem('isOutside', '1');
      this.router.navigate(['/purchase-order/create-purchase-order'], { queryParams: {
        storeId: this.query.storeId, id: event.data.id } });
    }
  }

  init(): void {
    this.columnDefs = [...this.agGridFn(this.gridflexs)];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  changePageSize() {
    this.getStockDiaryByProductPage();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.getStockDiaryByProductPage();
  }

  detectChange(key, event) {
    if (key === 'from_date') {
      this.query.fromDate = moment(event).format('YYYY-MM-DD');
      this.getStockDiaryByProductPage();
    }

    if (key === 'to_date') {
      this.query.toDate = moment(event).format('YYYY-MM-DD');
      this.getStockDiaryByProductPage();
    }

    this.changeDate.emit({
      fromDate: moment(this.query.fromDate).toDate(),
      toDate: moment(this.query.toDate).toDate()
    });
  }

}
