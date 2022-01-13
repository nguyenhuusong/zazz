import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode, MenuItem } from 'primeng/api';
import { ApiSmartService } from 'src/app/services/api-smart/apismart.service';
import { ButtonRendererComponent } from 'src/app/utils/common/button-renderer.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { CheckboxEditorComponent } from 'src/app/utils/common/checkbox-editor.component';
import { CustomTooltipComponent } from 'src/app/utils/common/customtooltip.component';
const MAX_SIZE = 100000000;
import { AgGridFn, CheckAction, FormatNumberCurrency, momentFormatDate, onProcessValue } from 'src/app/utils/common/function-common';
const queryString = require('query-string');
import { HttpParams } from '@angular/common/http';
import { cloneDeep, clone } from 'lodash';
import * as moment from 'moment';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { KEYBUTTON } from 'src/app/shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-supplier-price-plan',
  templateUrl: './supplier-price-plan.component.html',
  styleUrls: ['./supplier-price-plan.component.css']
})
export class SupplierPricePlanComponent implements OnInit, OnChanges {
  // @ViewChild(BasePagingComponent, { static: true }) pagingComponent: BasePagingComponent
  @Input() dataSupplicePrice;
  public modules: Module[] = AllModules;
  @Output() backPage = new EventEmitter<any>();
  today = new Date()
  pagingComponent = {
    total: 0
  };
  rowClassRules;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiSmart: ApiSmartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
    };
    this.getRowHeight = (params) => {
      return 40;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonRenderer1: ButtonRendererComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      checkboxRenderer: CheckboxEditorComponent
    };

    this.query.fromDate = new Date();
    this.query.toDate = new Date();
  }
  public checkAction = CheckAction;
  public agGridFn = AgGridFn;
  public onProcessValue = onProcessValue;
  formatNumberCurrency = FormatNumberCurrency;
  momentFormatDate = momentFormatDate;
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  displayProductInfo: any;
  detailProductInfo: any;
  valueSearchSuppliers: any;
  clientWidth: any;
  gridColumnApi: any;
  objectAction: any;
  gridflexs: any;
  getRowHeight;
  query = {
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 100000000,
    employeeId: '',
    store_id: '',
    status: null,
    fromDate: null,
    toDate: null,
    barcode: '',
  };
  loading;
  lists: any
  cols = []
  colsDetail = []
  countRecord: any = { totalRecord: 0, currentRecordStart: 0, currentRecordEnd: 0 };
  ngOnInit(): void {
    this.load();
  }

  ngOnChanges() {
    console.log(this.dataSupplicePrice)
    this.query.barcode = this.dataSupplicePrice.bar_code;
    this.query.store_id = this.dataSupplicePrice.store_id;
    this.load();
  }
  addSupplierPricePlan() {
    this.getSupplierPricePlanInfo(null);
  }

  backpage() {
    this.displayProductInfo = false;
    this.backPage.emit();
  }
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'View' },
    { label: 'Lưu lại', value: 'Update' }
  ]
  getSupplierPricePlanInfo(id) {
    const opts = { params: new HttpParams({ fromString: `id=${id}&storeSupplierPriceId=${this.dataSupplicePrice.id}` }) };
    this.apiSmart.getSupplierPricePlanInfo(opts.params.toString()).subscribe(results => {
      if (results.status === 'success') {
        if (id == null) {
          results.data.group_fields.forEach(element => {
            element.fields.forEach(element1 => {
              if (element1.field_name === 'from') {
                element1.columnValue = moment(new Date()).add(1, 'days').format('DD/MM/YYYY');
              }
            });
          });
        }
        this.listViews = [...results.data.group_fields]
        this.detailProductInfo = results.data;
        this.displayProductInfo = true;
      }
    })
  }
  listsData = []
  load() {
    this.columnDefs = [];
    this.spinner.show();
    localStorage.setItem('storeId', this.query.store_id);
    let params = { ... this.query };
    params.fromDate = params.fromDate ? moment(params.fromDate).format() : null;
    params.toDate = params.toDate ? moment(params.toDate).format() : null;
    const queryParams = queryString.stringify(params);
    this.apiSmart.getSupplierPricePlanPage(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listsData = results.data.dataList.data;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails;
        }
        this.init()
        this.displayProductInfo = false
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
 if(this.query.pageSize === MAX_SIZE) {
            this.query.pageSize =this.countRecord.totalRecord;
 }
        this.countRecord.currentRecordStart = this.countRecord.totalRecord === 0 ? this.query.offSet + 0 : this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.displayProductInfo = false
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : 'Lỗi hệ thống' });
      }
    })
  }

  first = 0
  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }

  init() {
    this.columnDefs = [
      ...this.agGridFn(this.cols),
      {
        headerName: '',
        field: 'button',
        filter: '',
        pinned: this.objectAction ? this.objectAction.pinned : 'right',
        width: this.objectAction ? this.objectAction.columnWidth : 60,
        cellRenderer: 'buttonAgGridComponent',
        cellClass: this.objectAction ? this.objectAction.cellClass : ['border-right'],
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.OnClickRow.bind(this),
                label: 'Sửa',
                icon: 'pi pi-pencil',
                class: 'btn-primary mr5',
                key: KEYBUTTON.XEMCHITIET
              },
              {
                onClick: this.OnClickRow.bind(this),
                label: 'Cập nhật',
                icon: 'fa fa-refresh',
                class: 'btn-primary',
                hide: !this.checkAction('/product/store-product-page', 'ACTION_UPDATE_PRICE'),
                key: KEYBUTTON.CAP_NHAT
              }
            ]
          };
        },
      },
    ];

  }


  OnClickRow(event: any) {
    if (event.event.item.key === KEYBUTTON.XEMCHITIET) {
      this.EditPricePlan(event);
    } else {
      this.updatePricePlan(event)
    }
  }

  updatePricePlan(event): void {
    const queryParams = queryString.stringify({ id: event.rowData.id });
    this.apiSmart.updatePricePlan(queryParams)
      .subscribe(result => {
        if (result.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: result.data });
          this.backPage.emit();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: result.message })
        }
      }),
      error => {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error })
      }
  }

  EditPricePlan(event) {
    this.displayProductInfo = false;
    this.getSupplierPricePlanInfo(event.rowData.id);
  }

  DeletePricePlan(event) {
    alert("Đang phát triển ")
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  saveSupplierPricePlan(data) {
    this.loading = true;
    let params = {
      ...this.detailProductInfo,
      group_fields: data
    };

    this.apiSmart.setSupplierPricePlanInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.loading = false;
        this.load();
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results ? results.message : 'Lỗi hệ thống'
        });
        this.loading = false;
      }
    }), error => {
      this.loading = false;
    };
  }


}
