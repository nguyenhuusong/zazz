import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
const queryString = require('query-string');
import { ApiSmartService } from 'src/app/services/api-smart/apismart.service';
import { CustomTooltipComponent } from 'src/app/utils/common/customtooltip.component';
const MAX_SIZE = 100000000;
import { AgGridFn, FormatNumberCurrency, onProcessValue } from 'src/app/utils/common/function-common';
@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {
  @Input() modelHistoryProduct: any;
  public modules: Module[] = AllModules;
  @Output() changeDate = new EventEmitter<any>();
  items = [];
  noRowsTemplate = '';
  cols = [];
  objectAction;
  countRecord: any = { totalRecord: 0, currentRecordStart: 0, currentRecordEnd: 0 };
  columnDefs = [];
  rowClassRules;
  query = {
    storeId: '',
    productId: '',
    unitId: '',
    barcode: '',
    product_name: '',
    supplier_name: '',
    filter: '',
    gridWidth: 1190,
    offSet: 0,
    pageSize: 100000000,
    fromDate: null,
    toDate: null,
  };
  constructor(
    private apiSmart: ApiSmartService,
    private router: Router
  ) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
    };
    this.getRowHeight = (params) => {
      return 50;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent
    };
   }
  paginatePage = {
    total: 0
  };
  detailRowHeight;
  defaultColDef;
  defaultDetailColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  getRowHeight;
  gridColumnApi: any;
  first = 0;
  agGridFn = AgGridFn;
  formatNumberCurrency = FormatNumberCurrency;
  onProcessValue = onProcessValue;

  ngOnInit(): void {
    this.query = this.modelHistoryProduct;
    this.getProductHistoryPage();
  }

  detectChange(key, event) {
    if (key === 'from_date') {
      this.query.fromDate = moment(event).format('YYYY-MM-DD');
      this.getProductHistoryPage();
    }

    if (key === 'to_date') {
      this.query.toDate = moment(event).format('YYYY-MM-DD');
      this.getProductHistoryPage();
    }

    this.changeDate.emit({
      fromDate: moment(this.query.fromDate).toDate(),
      toDate: moment(this.query.toDate).toDate()
    });
  }

  getProductHistoryPage() {
    const params = {...this.query};
    delete params.product_name;
    params.fromDate = params.fromDate ?  moment(params.fromDate).format() : null;
    params.toDate = params.toDate ? moment(params.toDate).format() : null;
    const queryParams = queryString.stringify(params);
    this.apiSmart.getProductHistoryPage(queryParams).subscribe(results => {
      if(results.status === 'success') {
        this.items = results.data.dataList.data;
        if(this.items.length > 0) {
          this.noRowsTemplate = '';
        }else {
          this.noRowsTemplate = `<h4>Hàng hóa ${this.modelHistoryProduct.product_name} chưa có giao dịch nào </h4>`
        }
        if (this.modelHistoryProduct.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.cols.forEach(column => {
            if (column.columnField === 'actions') {
              this.objectAction = column;
            }

            if (column.columnField === 'code') {
              column.cellClass = [...column.cellClass, 'text-link', 'cursor-pointer'];
              column.headerClass = ['cl6dabe8'];
            }

            if (column.columnField === 'quantity') {
              column.headerClass = ['clad5e7f'];
            }

            if (column.columnField === 'before_vat_amount') {
              column.headerClass = ['clebb878'];
            }

            if (column.columnField === 'remain_amount') {
              column.headerClass = ['cl8bd46a'];
            }

          });
        }
        this.init();
        setTimeout(() => {
          if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
          }
        }, 200);
        this.paginatePage.total = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
 if(this.query.pageSize === MAX_SIZE) {
            this.query.pageSize =this.countRecord.totalRecord;
 }
        this.countRecord.currentRecordStart = this.modelHistoryProduct.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.modelHistoryProduct.offSet) > this.modelHistoryProduct.pageSize) {
          this.countRecord.currentRecordEnd = this.modelHistoryProduct.offSet + Number(this.modelHistoryProduct.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
        }
        // this.loading = false;
      }

    });
  }

  cellClicked(event): void {
    if (event.colDef.field === 'code') {
      if (event.data.trans_type === 'stock') {

        if (event.data.code.indexOf('TL') > -1) {
          localStorage.setItem('reasonPurchase', JSON.stringify(2));
          localStorage.setItem('pathPurchase', '/exchange/purchase-back-page');
        } else if (event.data.code.indexOf('NC') > -1) {
          localStorage.setItem('reasonPurchase', JSON.stringify(1));
          localStorage.setItem('pathPurchase', '/exchange/purchase-order-page');
        } else if (event.data.code.indexOf('TP') > -1) {
          localStorage.setItem('reasonPurchase', JSON.stringify(3));
          localStorage.setItem('pathPurchase', '/exchange/import-warehouse-page');
        }else if (event.data.code.indexOf('NG') > -1) {
          localStorage.setItem('reasonPurchase', JSON.stringify(5));
          localStorage.setItem('pathPurchase', '/exchange/import-consignment');
        } else if (event.data.code.indexOf('HH') > -1) {
          localStorage.setItem('reasonPurchase', JSON.stringify(12));
          localStorage.setItem('pathPurchase', '/exchange/export-cancel-product-page');
        } else if (event.data.code.indexOf('XC') > -1) {
          localStorage.setItem('reasonPurchase', JSON.stringify(13));
          localStorage.setItem('pathPurchase', '/exchange/export-product-to-supplier-page');
        } else if (event.data.code.indexOf('XB') > -1) {
          localStorage.setItem('reasonPurchase', JSON.stringify(14));
          localStorage.setItem('pathPurchase', '/exchange/export-kitchen-page');
        } else if (event.data.code.indexOf('XT') > -1) {
          localStorage.setItem('reasonPurchase', JSON.stringify(15));
          localStorage.setItem('pathPurchase', '/exchange/export-product-separate-page');
        } else if (event.data.code.indexOf('XG') > -1) {
          localStorage.setItem('reasonPurchase', JSON.stringify(17));
          localStorage.setItem('pathPurchase', '/exchange/export-consignment');
        }


        if (event.data.code.indexOf('BH') === -1) {
          setTimeout(() => {
            this.router.navigate(['/purchase-order/create-purchase-order'], { queryParams: {
              storeId: this.query.storeId, id: event.data.id, linkedExchange: true } });
          });
        } else {
          localStorage.setItem('reasonPurchase', JSON.stringify(11)); // Hóa đơn
          localStorage.setItem('pathPurchase', '/exchange/bill-page');
          setTimeout(() => {
            this.router.navigate(['/exchange/bill-page'], {queryParams: {
              code: event.data.code, linkedExchange: true
            }});
          });
        }
      } else {
        this.router.navigate(['/order/edit'], { queryParams: { storeId: this.query.storeId, order_type: 1, id: event.data.id,
          linkedExchange: true } });
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  changePageSize() {
    this.getProductHistoryPage();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.getProductHistoryPage();
  }

  init(): void {
    this.columnDefs = [
      ...this.agGridFn(this.cols)
    ];
  }

}
