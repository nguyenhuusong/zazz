  import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
declare var $: any;
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-page-mau-thong-bao',
  templateUrl: './page-mau-thong-bao.component.html',
  styleUrls: ['./page-mau-thong-bao.component.css']
})
export class PageMauThongBaoComponent implements OnInit, OnDestroy, AfterViewChecked {
  agGridFn = AgGridFn;
  public modules: Module[] = AllModules;
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiHrmService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
   ) {
    this.defaultColDef = {
      resizable: true,
    };
    this.frameworkComponents = {
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarFullComponent: AvatarFullComponent,
    };
    this.getRowHeight = function (params) {
      return 50;
    };
  }
  items: any = [];
  model: any = {};
  totalRecord = 0;
  projects = [];
  query = {
    organizeId: '',
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 15
  }
  cols
  colsDetail;
  objectActionDetail
  dataNotifyTemp
  destroy$: Subject<boolean> = new Subject<boolean>();
  columnDefs;
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  gridColumnApi: any;
  gridflexdetails: any;
  objectAction: any;
  objectActionDetails: any;
  getRowHeight;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  clientWidth = 0;
  pagingComponent = {
    total: 0
  }
  first = 0;
  
  handleReset() {
    this.query = {
      organizeId: '',
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15
    }
  }

  changePageSize() {
    this.load();
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách thông báo', url: '/cai-dat/thong-bao' },
      { label: 'Danh sách mẫu thông báo' },
    ];
    this.model.filter = '';
    this.load();
  }


  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }
  listsData = []

  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getNotifyTempPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
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
        {
          onClick: this.handleEdit.bind(this),
          label: 'Sửa',
          icon: 'fa fa-edit',
          class: 'btn-dropbox text-white',
        },
        {
          onClick: this.handleDelete.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-google text-white',
        }
      ]
    };
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".breadcrumb");
    const d: any = document.querySelector(".filterInput");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 45;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }


  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        width: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
  }

  handleDelete(e) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        this.spinner.show();
        const queryParams = queryString.stringify({ tempId: e.rowData.tempId });
        this.apiService.delNotifyTemp(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
            this.spinner.hide();
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  handleEdit(event) {
    const params = {
      tempId: event.rowData.tempId,
    }
    this.router.navigate(['/cai-dat/thong-bao/mau-thong-bao/chi-tiet-mau-thong-bao'], { queryParams: params });
  }

  addNotifyTemp() {
    const params = {
      tempId: '',
    }
    this.router.navigate(['/cai-dat/thong-bao/mau-thong-bao/them-moi-mau-thong-bao'], { queryParams: params });
  }
 
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  handleFilter() {
    this.load();
  }
}
