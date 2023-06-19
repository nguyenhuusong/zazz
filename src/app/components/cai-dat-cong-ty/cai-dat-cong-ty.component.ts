
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import queryString from 'query-string';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { cloneDeep } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-cai-dat-cong-ty',
  templateUrl: './cai-dat-cong-ty.component.html',
  styleUrls: ['./cai-dat-cong-ty.component.scss']
})
export class CaiDatCongTyComponent implements OnInit, AfterViewChecked {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  dataCompanys: any;
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef,
    public dialogService: DialogService,
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
  pagingComponent = {
    total: 0
  }

  titleForm = {
    label: 'Thêm mới tài khoản',
    value: 'Add'
  }

  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  items = [];
  columnDefs;
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
    }
    this.load();
  }
  
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +30;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  listsData = [];
  load() {
    this.columnDefs = []
    // this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getCompanyPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey
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
          label: 'Xem',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetCompanyPage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa công ty',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetCompanyPage.url, ACTIONS.DELETE)
        },
      ]
    };
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
        width: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
  }

  delRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa công ty?',
      accept: () => {
        const queryParams = queryString.stringify({ companyId: event.rowData.companyId });
        this.apiService.delCompanyInfo(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công ty thành công' });
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
      companyId: rowData.companyId
    }
    this.router.navigate(['/cai-dat/cai-dat-cong-ty/chi-tiet-cong-ty'], { queryParams: params });
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  addCongTy() {
    const params = {
      companyId: null
    }
    this.router.navigate(['/cai-dat/cai-dat-cong-ty/them-moi-cong-ty'], { queryParams: params });
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
  itemsToolOfGrid = [];
  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách công ty' },
    ];

    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-upload',
        command: () => {
          this.importFileExel();
        }
      },
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        command: () => {
          this.exportExel();
        }
      },
    ]
    this.getFilter();
  }

  importFileExel() {
    this.router.navigate(['/cai-dat/cai-dat-cong-ty/import-cong-ty']);
  }

  exportExel() {
    this.spinner.show();
    this.query.pageSize = 1000000;
    const query = { ...this.query };
    const queryParams = queryString.stringify(query);
    this.apiService.setCompanyExport(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {

        if (results.type === 'application/json') {
          this.spinner.hide();
        } else if (results.type === 'application/octet-stream') {
          var blob = new Blob([results], { type: 'application/msword' });
          FileSaver.saveAs(blob, `Danh sách công ty` + ".xlsx");
          this.spinner.hide();
        }
      },
      error => {
        this.spinner.hide();
      });
  }

  quanlyloaihopdong() {
    this.router.navigate(['/cai-dat/quan-ly-hop-dong']);
  }

  listViewsFilter = [];
  cloneListViewsFilter = [];
detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm  addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger  addNew', icon: 'pi pi-times' },
  ];

  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v2/compay/GetCompanyFilter')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
        this.load();
        this.detailInfoFilter = results.data;
      }
    });
  }

   filterLoad(event) {
this.listViewsFilter =  cloneDeep(event.listViewsFilter);
    this.query = { ...this.query, ...event.data };
    this.load();
  }

  close({event, datas}) {
    if(event !== 'Close') {
      const listViews = cloneDeep(this.cloneListViewsFilter);
      this.listViewsFilter = cloneDeep(listViews);
      const params =  getParamString(listViews)
      this.query = { ...this.query, ...params};
      this.load();
      this.FnEvent();
    }else {
      this.listViewsFilter =  cloneDeep(datas);
    }
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
          this.addCongTy()
        });
      }
    }, 300);
  }
}



