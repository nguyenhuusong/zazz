import { Router } from '@angular/router';
import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { Subject, takeUntil } from 'rxjs';
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
    n_id: 0,
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
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS


  columnDefs = [];
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
    this.filter.n_id = this.notify ? this.notify.n_id : 0;
    this.getFilterType();
    //test
    // this.load();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getFilterType() {
    this.apiService.getNotifyPushStatus()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((result: any) => {
      this.notifyTypes = result.data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.notify && this.notify.n_id) {
      this.filter.n_id = this.notify.n_id
      this.load();
    }
  }

  listsData = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.filter);
    this.apiService.getNotifyToPushs(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.items = results.data;
        this.listsData = results.data.dataList.data;
        if (this.filter.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.filter.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.filter.offSet) > this.filter.pageSize) {
          this.countRecord.currentRecordEnd = this.filter.offSet + Number(this.filter.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp'}
          }, 100);
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      });
  }

  showButtons(event: any) {
    return {
      buttons: [
        // {
        //   onClick: this.handleDelete.bind(this),
        //   label: 'Xóa',
        //   icon: 'fa fa-trash',
        //   class: 'btn-google text-white',
        //   hide: CheckHideAction(MENUACTIONROLEAPI.GetAppNotifyPage.url, ACTIONS.DANH_SACH_GUI_THONG_BAO_XOA)
        // }
      ]
    };
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        width: 120,
        pinned: 'right',
        headerCheckboxSelection: true,
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: true,
        field: 'checkbox'
      }]
  }

  cols;
  colsDetail;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  closeModal() {
    this.saveSend.emit({
      data: 'hide',
      run_act: 0,
    });
  }

  handleDelete(e) {
    this.confirmationService.confirm({
      message: `${CONSTANTS.CONFIRM.DELETE}`,
      accept: () => {
        const queryParams = queryString.stringify({ id: e.rowData.userId });
        this.apiService.delNotifyPush(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xoá thành công' });
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

  displaySend = false
  storeNotify() {
    this.saveStore.emit();
  }

  sendNotify() {
    this.send.emit();
  }

  appUsers = [];
  selectRow(event) {
    this.appUsers = event;
  }

  saveSendNotify() {
    if (this.appUsers.length > 0) {
      this.saveSend.emit({
        data: this.appUsers,
        run_act: 0,
      });
    } else {
      this.saveSend.emit({
        data: this.items.dataList.data,
        run_act: 0,
      });
    }
  }

  deleteMultipleApartment() {
    this.deleteRooms.emit(this.appUsers)
  }

  reSendNotify() {
    
    if (this.appUsers.length > 0) {
      this.saveSend.emit({
        data: this.appUsers,
        run_act: 2,
      });
    } else {
      this.saveSend.emit({
        data: this.items.dataList.data,
        run_act: 2,
      });
    }
  }

}
