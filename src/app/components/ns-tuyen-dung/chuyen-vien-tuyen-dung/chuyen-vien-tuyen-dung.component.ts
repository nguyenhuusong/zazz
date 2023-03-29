import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { Subject, takeUntil, fromEvent } from 'rxjs';
const MAX_SIZE = 100000000;
@Component({
  selector: 'app-chuyen-vien-tuyen-dung',
  templateUrl: './chuyen-vien-tuyen-dung.component.html',
  styleUrls: ['./chuyen-vien-tuyen-dung.component.scss']
})
export class ChuyenVienTuyenDungComponent implements OnInit, AfterViewChecked {

  listsData: any[] = [];
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS;
  selectedNode;
  listAgencyMap: TreeNode[];
  organizeList = []
  detailOrganizeMap = null;

  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    
    private router: Router) {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 40;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  items = [];
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  objectAction: any;
  objectActionDetail: any;
  gridflexs: any;
  getRowHeight;
  isHrDiagram: boolean = false
  query = {
    filter: '',
    offSet: 0,
    pageSize: 20,
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  loading = false;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +10;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
    }
    this.load();
  }

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    // this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getUserHiringPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey;
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
          this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        if (this.query.pageSize === MAX_SIZE) {
          this.query.pageSize = this.countRecord.totalRecord;
        }
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = this.query.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.query.offSet) > this.query.pageSize) {
          this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp'}
          }, 100);
        }
        this.spinner.hide();
        this.FnEvent();
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
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          // hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.VIEW_TINH_LUONG_THANH_PHAN_LUONG)
        },
        {
          onClick: this.trinhDuyet.bind(this),
          label: 'Trình duyệt',
          icon: 'fa fa-check',
          class: 'btn-primary mr5',
          hide: event.data.role_st !== 0
          // hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.DELETE_TINH_LUONG_THANH_PHAN_LUONG)
        },
        {
          onClick: this.CloseRow.bind(this),
          label: 'Đóng',
          icon: 'fa fa-check',
          class: 'btn-primary mr5',
          hide: event.data.role_st !== 1
          // hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.DELETE_TINH_LUONG_THANH_PHAN_LUONG)
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          // hide: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.DELETE_TINH_LUONG_THANH_PHAN_LUONG)
        },
      ]
    };
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  displayApprove = false;
  modelApprove = {
    id: '',
    comment: '',
    reportTo: null
  }

  managerLists: any = null;
  getManagerList() {
    const queryParams = queryString.stringify({ admin_st: 1 });
    this.apiService.getUsersByAdmin(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.managerLists = results.data.map(d => {
          return {
            label: d.name,
            value: d.value
          }
        });
      }
    })
  }

  trinhDuyet(event) {
    this.modelApprove.id =  event.rowData.id;
    this.displayApprove = true;
  }

  saveApprove() {
    this.apiService.setUserHiringSubmit({...this.modelApprove})
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Trình duyệt thành công' });
        this.load();
        this.displayApprove = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
      }
    });
  }

  CloseRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn đóng chuyên viên tuyển dụng?',
      accept: () => {
        const queryParams = queryString.stringify({ Id: event.rowData.id });
        this.apiService.setUserHiringClose(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa chuyên viên tuyển dụng thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa chuyên viên tuyển dụng?',
      accept: () => {
        const queryParams = queryString.stringify({ Id: event.rowData.id });
        this.apiService.delUserHiring(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa chuyên viên tuyển dụng thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  editRow({rowData}) {
    const params = {
      id:rowData.id
    }
    this.router.navigate(['/tuyen-dung/chuyen-vien-tuyen-dung/chi-tiet-chuyen-vien-tuyen-dung'], { queryParams: params });
  }


  callbackSave() {
    // this.displayAdd = false;
    this.load();
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        filter: '',
        width: 70,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }
    ]

  }
  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Tuyển dụng'},
      { label: 'Vị trí tuyển dụng',  routerLink: '/tuyen-dung/vi-tri-tuyen-dung'},
      { label: 'Chuyên viên tuyển dụng' },
    ];
    this.getManagerList();
    this.load();
  }
 
 
  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addItem()
        });
      }
    }, 300);
  }

  isSearchEmp = false;
  addItem() {
    const params = {
      id: null
    }
    this.router.navigate(['/tuyen-dung/chuyen-vien-tuyen-dung/them-moi-chuyen-vien-tuyen-dung'], { queryParams: params });
  }

  seachEmValue(event) {
    if(event.value) {
      
    }else{
      this.isSearchEmp = false;
    }
  }

}
