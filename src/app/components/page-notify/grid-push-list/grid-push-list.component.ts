import { Router } from '@angular/router';
import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CONSTANTS } from 'src/app/shared/constants';
@Component({
  selector: 'app-grid-push-list',
  templateUrl: './grid-push-list.component.html',
  styleUrls: ['./grid-push-list.component.css']
})
export class GridPushListComponent implements OnInit, OnChanges {
  public modules: Module[] = AllModules;
  @Input() notify;
  @Input() indexTab;
  @Input() hideAction = false;
  @Input() loadForm;
  @Output() send = new EventEmitter<any>();
  @Output() saveSend = new EventEmitter<any>();
  @Output() saveStore = new EventEmitter<any>();
  @Output() deleteRooms = new EventEmitter<any>();
  constructor(
    private router: Router,
    private apiService: ApiHrmService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService) {
    this.defaultColDef = {
      resizable: true,
    };
    this.frameworkComponents = {
      buttonAgGridComponent: ButtonAgGridComponent,
    };
    this.getRowHeight = function (params) {
      return 50;
    };
  }
  model: any = {};
  totalRecord = 0;
  filter = {
    notiId: 0,
    filter: '',
    action: '',
    push_st: -1,
    email_st: -1,
    sms_st: -1,
    gridWidth: 1380,
    offSet: 0,
    pageSize: 15
  }
  pagingComponent = {
    total: 0
  }

  columnDefs;
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  gridColumnApi: any;
  gridflexdetails: any;
  gridflexs: any;
  objectAction: any;
  objectActionDetails: any;
  getRowHeight;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  rowSelection;
  notifyTypes = [];
  items: any = [];
  gridData: any = [];
  agGridFn = AgGridFn;

  ngOnInit(): void {
    this.filter.notiId = this.notify.notiId
    this.getFilterType();
    //test
    this.load();
  }

  getFilterType() {
    this.apiService.getNotifyPushStatus().subscribe((result: any) => {
      this.notifyTypes = result.data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.notify && this.notify && this.notify.notiId) {
    //   this.load();
    // }
    console.log(":sadasdas", changes)
    console.log(":sadasdas", this.indexTab)
    if (this.notify.notiId) {
      this.filter.notiId = this.notify.notiId
      this.load();
    }
  }

  cols;
  colsDetail;
  loading = false
  load() {
    this.spinner.show();
    const queryParams = queryString.stringify(this.filter);
    this.apiService.getNotifyToPushs(queryParams).subscribe(
      (results: any) => {
        this.items = results.data;
        this.items.dataList.data = [...this.items.dataList.data]
        if (this.filter.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
          this.cols.forEach(column => {
            if (column.columnField === 'actions') {
              this.objectAction = column;
            }
          });
        }
        this.initTableGrid();
        this.spinner.hide();
        this.pagingComponent.total = this.items.dataList.recordsTotal;
        this.countRecord.totalRecord = this.items.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.filter.offSet + 1;
        if ((this.items.dataList.recordsTotal - this.filter.offSet) > this.filter.pageSize) {
          this.countRecord.currentRecordEnd = this.filter.offSet + Number(this.filter.pageSize);
        } else {
          this.countRecord.currentRecordEnd = this.items.dataList.recordsTotal;
        }
      },
      error => { });
  }

  initTableGrid() {
    this.columnDefs = [
      ...this.agGridFn(this.cols),
      {
        headerName: 'Chức năng',
        filter: '',
        width: 100,
        pinned: 'right',
        cellRenderer: 'buttonRenderer',
        cellClass: ['text-center', 'text-right', 'border-right', 'd-flex', 'align-items-center', 'justify-content-center'],
        cellRendererParams: params => this.showButtons(params),
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        field: 'checkbox'
      },
    ];
    this.rowSelection = 'multiple';
    this.groupDefaultExpanded = 0;
    this.detailRowHeight = 300;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.items && this.items.dataList && this.items.dataList.data.length > 0) {
      this.gridApi.setRowData(this.items.dataList.data);
    }
  }

  showButtons(params) {
    return {
      buttons: [
        {
          onClick: this.handleDelete.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-google text-white',
          show: true
        }
      ]
    };
  }

  closeModal() {
    this.saveSend.emit('hide');
  }

  handleDelete(e) {
    this.confirmationService.confirm({
      message: `${CONSTANTS.CONFIRM.DELETE}`,
      accept: () => {
        const queryParams = queryString.stringify({ id: e.rowData.id });
        this.apiService.delNotifyPush(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xoá chính sách lãi đầu tư thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
            this.spinner.hide();
          }
        });
      }
    });
  }

  closePage() {
    this.saveStore.emit('List');
  }

  changePageSize() {
    this.load();
  }

  first = 0
  paginate(event) {
    this.filter.offSet = event.first;
    this.first = event.first;
    this.filter.pageSize = event.rows;
    this.load();
  }

  insertRow(row) {
    this.gridData.push(row);
    this.gridApi.setRowData(this.items.dataList.data);
  }

  getRowSelection() {
    const selectedRowData = this.gridApi.getSelectedRows();
    return selectedRowData;
  }

  getAllItem() {
    return this.items.dataList.data;
  }

  displaySend = false
  storeNotify() {
    this.saveStore.emit();
  }

  sendNotify() {
    this.send.emit();
  }

  saveSendNotify() {
    if(this.gridApi.getSelectedRows().length > 0) {
      this.saveSend.emit(this.gridApi.getSelectedRows());
    }else {
      this.saveSend.emit(this.items.dataList.data);
    }
  }

  deleteMultipleApartment() {
    this.deleteRooms.emit(this.gridApi.getSelectedRows())
  }

}
