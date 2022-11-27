  import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
  import * as queryString from 'querystring';
  import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
  import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
  import { NgxSpinnerService } from 'ngx-spinner';
  import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
  import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
  import { ExportFileService } from 'src/app/services/export-file.service';
  import { cloneDeep } from 'lodash';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
  @Component({
    selector: 'app-tab-cap-bac-bang-luong',
    templateUrl: './tab-cap-bac-luong.component.html',
    styleUrls: ['./tab-cap-bac-luong.component.scss']
  })
  export class TabCapBacLuongComponent implements OnInit {
    @Output() idOutPut = new EventEmitter<any>();
    pagingComponent = {
      total: 0
    };
    projects = []
    public modules: Module[] = AllModules;
    public agGridFn = AgGridFn;
    cols: any[];
    colsDetail: any[];
    items = [];
    columnDefs = [];
    detailRowHeight;
    defaultColDef;
    gridApi: any;
    clientWidth: any;
    gridColumnApi: any;
    objectAction: any;
    objectActionDetail: any;
    gridflexs: any;
    listsData = null;
    totalRecord = 0;
    first = 0;
    gridKey = ''
  displaySetting = false
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
    countRecord: any = {
      totalRecord: 0,
      currentRecordStart: 0,
      currentRecordEnd: 0
    }
    constructor(
      private apiService: ApiHrmService,
      private spinner: NgxSpinnerService,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private fileService: ExportFileService,
      private organizeInfoService: OrganizeInfoService,
      private changeDetector: ChangeDetectorRef,) {
  
      }
    query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15,
      organizeIds: '',
    }
  
    cancel() {
      this.query = {
        filter: '',
        gridWidth: 0,
        offSet: 0,
        pageSize: 15,
        organizeIds: this.query.organizeIds
      }
      this.load();
    }
  
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    }
  
    load() {
      this.columnDefs = [];
      this.spinner.show();
      const queryParams = queryString.stringify(this.query);
      this.apiService.getPayrollBasePage(queryParams).subscribe(
        (results: any) => {
          this.listsData = results.data.dataList.data;
          this.gridKey= results.data.dataList.gridKey;
          if (this.query.offSet === 0) {
            this.cols = results.data.gridflexs;
          }
          this.initGrid();
          this.countRecord.totalRecord = results.data.dataList.recordsTotal;
          this.countRecord.totalRecord = results.data.dataList.recordsTotal;
          this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
          if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
            this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
          } else {
            this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
            setTimeout(() => {
              const noData = document.querySelector('.ag-overlay-no-rows-center');
              if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
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
          {
            onClick: this.editRow.bind(this),
            label: 'Xem chi tiết',
            icon: 'pi pi-tablet',
            class: 'btn-primary mr5',
            hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.VIEW_TINH_LUONG_CAP_BAC_LUONG)
          },
          {
            onClick: this.deleteRow.bind(this),
            label: 'Xóa',
            icon: 'fa fa-trash',
            class: 'btn-primary mr5',
            hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.DELETE_TINH_LUONG_CAP_BAC_LUONG)
          },
        ]
      };
    }
  
    editRow(event) {
      this.idOutPut.emit(event)
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
  
    deleteRow(event) {
      this.confirmationService.confirm({
        message: 'Bạn có chắc chắn muốn xóa?',
        accept: () => {
          const query = queryString.stringify({baseId: event.rowData.baseId})
          this.apiService.delPayrollBase(query).subscribe((results: any) => {
            if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
              this.load();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
            }
          });
        }
      });
    }
  
    find() {
      this.load();
    }
  
    changePageSize() {
      this.load();
    }
  
    paginate(event) {
      this.query.offSet = event.first;
      this.first = event.first;
      this.query.pageSize = event.rows;
      this.load();
    }
  
    ngOnInit() {
      this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results && results.length>0){
          this.query.organizeIds = results;
          this.load();
        }
    });
      this.items = [
        { label: 'Trang chủ', routerLink: '/home' },
        { label: 'Lương - thuế' },
      ];
    }
  
    replaceHtmlToText(string) {
      return string.replace(/(<([^>]+)>)/gi, "");
    }
  
    loadjs = 0;
    heightGrid = 300
    ngAfterViewChecked(): void {
      const a: any = document.querySelector(".header");
      const b: any = document.querySelector(".sidebarBody");
      const c: any = document.querySelector(".bread-filter");
      const d: any = document.querySelector(".bread-crumb");
      const e: any = document.querySelector(".paginator");
      this.loadjs++
      if (this.loadjs === 5) {
        if (b && b.clientHeight) {
          const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 75;
          this.heightGrid = window.innerHeight - totalHeight
          this.changeDetector.detectChanges();
        } else {
          this.loadjs = 0;
        }
      }
    }
    cauhinh() {
      this.displaySetting = true;
    }
  
  
  }
  