import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ApiSmartService } from 'src/app/services/api-smart/apismart.service';
import queryString from 'query-string';
import * as moment from 'moment';
import { autoCompleteValueValidate, onProcessValue, onValidateNumeric } from 'src/app/utils/common/function-common';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
@Component({
  selector: 'app-search-order',
  templateUrl: './search-order.component.html',
  styleUrls: ['./search-order.component.css']
})
export class SearchOrderComponent implements OnInit {
  public modules: Module[] = AllModules;
  @Input() storeId;
  @Input() reason;
  @Input() order;
  @Output() outputOrder = new EventEmitter<any>();
  @Output() clearOrder = new EventEmitter<any>();
  constructor(
    private apiSmart: ApiSmartService
  ) { }
  query = { filter: '', gridWidth: 0, offSet: 0, pageSize: 10000000, storeId: '', supplierId: '',
  employeeId: '', reason: null, status: null, fromDate: '', toDate: '', product_barcode: ''};
  queryOrder = { filter: '', gridWidth: 0, offSet: 0, pageSize: 10000000, storeId: '', order_type: -1, supplierId: '',
  employeeId: '', reason: null, orderStatus: null, orderFrom: '', orderTo: ''};
  fromDate = null;
  toDate = null;
  listOrder = [];
  modelSupplier;
  modelStaff;
  supplierSuggestions = [];
  listStaff = [];
  listOrderStatus = [];
  listReason = [];
  placeHolder = '';
  onProcessValue = onProcessValue;
  onValidateNumeric = onValidateNumeric;
  public autoCompleteValueValidate = autoCompleteValueValidate
  ngOnInit(): void {
    this.listOrderStatus = [
      {label: 'Đã hủy', value: 0},
      {label: 'Đã hoàn thành', value: 1}
    ];
    this.initPlaceholder();
    if (+this.reason === 1) {
      this.getOrderReasons();
      this.getOrderStatus();
    }
  }

  getOrders() {
    this.queryOrder.storeId = this.storeId;
    if (this.queryOrder.storeId) {
      const queryParams = queryString.stringify(this.queryOrder);
      this.apiSmart.getOdersPage(queryParams).subscribe(results => {
        if (results.status === 'success') {
          this.listOrder = results.data.dataList.data;
        }
      }, error => {
      });
    }
  }

  getPurchaseOrders() {
    this.query.storeId = this.storeId;
    if (this.query.storeId) {
      this.query.reason = 1;
      const queryParams = queryString.stringify(this.query);
      this.apiSmart.getPurchaseOrderPage(queryParams).subscribe(results => {
        if (results.status === 'success') {
          this.listOrder = results.data.dataList.data;
          this.init();
        }
      }, error => {
      });
    }
    this.clearOrder.emit(null);
  }

  getOrderReasons() {
    this.apiSmart.getOrderReasons().subscribe(result => {
      this.listReason = result.data.map(r => ({label: r.name, value: +r.code}));
    });
  }

  getOrderStatus() {
    this.apiSmart.getOrderStatus().subscribe(result => {
      this.listOrderStatus = result.data.map(o => ({label: o.name, value: +o.code}));
    });
  }

  @HostListener('document:keydown', ['$event'])
  enterEvent(event) {
    if (event.which === 13) {
      const element = event.target as HTMLInputElement;
      if (!element.getAttribute('id')) {
          if (+this.reason === 1) {
            this.getOrders();
          } else {
            this.getPurchaseOrders();
          }
      }
    }
  }

  initPlaceholder() {
    if (+this.reason === 11) {
      this.placeHolder = 'Theo số hóa đơn';
    } else if (+this.reason === 4) {
      this.placeHolder = 'Theo số đơn nhập điều chỉnh';
    } else if (+this.reason === 16) {
      this.placeHolder = 'Theo số đơn xuất điều chỉnh';
    } else if (+this.reason === 14) {
      this.placeHolder = 'Theo số đơn xuất bếp';
    } else if (+this.reason === 12) {
      this.placeHolder = 'Theo số đơn xuất hủy';
    } else if (+this.reason === 13) {
      this.placeHolder = 'Theo số đơn nhập kho';
    } else if (+this.reason === 15) {
      this.placeHolder = 'Theo số đơn xuất tách';
    }  else {
      this.placeHolder = 'Theo mã số phiếu, mã sản phẩm';
    }
  }

  onHandleSearchEvent() {
    if (+this.reason === 1) {
      this.getOrders();
    } else {
      this.getPurchaseOrders();
    }
  }

  searchSupplier(event) {
    this.query.storeId = this.storeId;
    const queryParams = queryString.stringify({search: event.query, store_id: this.query.storeId})
    this.apiSmart.searchSupplier(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.supplierSuggestions = results.data.map(res => {
          return {
            label: res.code + ' - ' + res.name,
            value: res.id
          };
        });
      }
    });
  }

  onSelectSupplierFilter(event) {
    if (+this.reason === 1) {
      this.queryOrder.supplierId = event.value;
    } else {
      this.query.supplierId = event.value;
    }
  }

  clearEvent(key , event) {
    if (key === 'supplier') {
      this.query.supplierId = '';
      this.queryOrder.supplierId = '';
    }

    if (key === 'employee') {
      this.query.employeeId = '';
      this.queryOrder.employeeId = '';
    }
  }

  cancelOrderFilter() {
    this.queryOrder.filter = '';
    this.queryOrder.employeeId = '';
    this.queryOrder.orderFrom = '';
    this.queryOrder.orderTo = '';
    this.queryOrder.supplierId = '';
    this.queryOrder.reason = null;
    this.queryOrder.orderStatus = null;
  }

  cancelPurchaseFilter() {
    this.query.filter = '';
    this.query.product_barcode = '';
    this.query.supplierId = '';
    this.query.employeeId = '';
    this.query.fromDate = '';
    this.query.toDate = '';
    this.query.status = null;
  }

  cancelSearch() {
    if (+this.reason === 1) {
      this.cancelOrderFilter();
    } else {
      this.cancelPurchaseFilter();
    }
    this.fromDate = null;
    this.toDate = null;
    this.modelSupplier = null;
    this.modelStaff = null;
  }

  onClearClick(key, event) {
    if (key === 'fromDate') {
      if (+this.reason === 1) {
        this.queryOrder.orderFrom = '';
      } else {
        this.query.fromDate = '';
      }
      this.fromDate = null;
    } else {
      if (+this.reason === 1) {
        this.queryOrder.orderTo = '';
      } else {
        this.query.toDate = '';
      }
      this.toDate = null;
    }
  }

  getStaffsAtStore(event) {
    const queryParams = queryString.stringify({
      filter: event.query , storeId: this.query.storeId, offset: 0, pageSize: 1000000, gridWidth: 1580
    });
    this.apiSmart.getUserPageToStore(queryParams).subscribe(result => {
      if (result.data) {
        this.listStaff = result.data.dataList.data.map(d => ({label: d.name, value: d.userId}));
      }
    });
  }

  detectChange(key, value) {
    if(value) {
      if (key === 'fromDate') {
        if (+this.reason === 1) {
          this.queryOrder.orderFrom = moment(value).format('YYYY-MM-DD');
        } else {
          this.query.fromDate = moment(value).format('YYYY-MM-DD');
        }
      } else {
        if (+this.reason === 1) {
          this.queryOrder.orderTo = moment(value).format('YYYY-MM-DD');
        } else {
          this.query.toDate = moment(value).format('YYYY-MM-DD');
        }
      }
    }
   
  }

  onSelectStaff(event) {
    if (+this.reason === 1) {
      this.queryOrder.employeeId = event.value;
    } else {
      this.query.employeeId = event.value;
    }
  }

  selectOrder() {
    this.outputOrder.emit(this.order);
  }

  init() {

  }
}
