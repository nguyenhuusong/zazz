  import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
declare var $: any;
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import { getParamString } from 'src/app/common/function-common/objects.helper';
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

  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm  addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger  addNew', icon: 'pi pi-times' },
  ];

  private readonly unsubscribe$: Subject<void> = new Subject();
  
  handleReset() {
    this.query = {
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
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách thông báo', routerLink: '/cai-dat/thong-bao' },
      { label: 'Danh sách mẫu thông báo' },
    ];
    this.model.filter = '';
    this.getFilter();
  }

  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v1/notify/GetNotifyTempFilter')
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
    }else {
      this.listViewsFilter =  cloneDeep(datas);
    }
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
  }
  listsData = [];

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getNotifyTempPage(queryParams)
    .pipe(takeUntil(this.destroy$))
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
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +30;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
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
        this.apiService.delNotifyTemp(queryParams)
        .pipe(takeUntil(this.destroy$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
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
