import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { cloneDeep } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { FormFilterComponent } from 'src/app/common/form-filter/form-filter.component';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-page-notify',
  templateUrl: './page-notify.component.html',
  styleUrls: ['./page-notify.component.css']
})
export class PageNotifyComponent implements OnInit, OnDestroy {
  agGridFn = AgGridFn;
  public modules: Module[] = AllModules;
  loading = false;
  Actions = {
    label: 'Danh sách thông báo',
    value: 'Lists'
  }
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiHrmService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private organizeInfoService: OrganizeInfoService,
    public dialogService: DialogService,
    private router: Router
  ) {
    this.defaultColDef = {
      resizable: true,
    };
    this.frameworkComponents = {
      buttonRendererMutiComponent: ButtonAgGridComponent,
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
    pageSize: 20,
  }
  cols
  colsDetail;
  objectActionDetail
  dataNotifi
  destroy$: Subject<boolean> = new Subject<boolean>();
  columnDefs = [];
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
  menuItem = [];
  listViewsFilter = [];
  cloneListViewsFilter = [];
detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];
  handleReset() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 20,
    }
  }

  changePageSize() {
    this.load();
    this.FnEvent()
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +10;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  
  cancel() {
    this.query = {
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 20,
    }
    this.load();
    this.FnEvent()
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách thông báo' },
    ];
    this.menuItem = [
      {
        label: 'Loại thông báo',
        icon: 'pi pi-refresh',
        command: () => {
          this.router.navigate(['/cai-dat/thong-bao/loai-thong-bao'])
        }
      },
      {
        label: 'Mẫu thông báo',
        icon: 'pi pi-refresh',
        command: () => {
          this.router.navigate(['/cai-dat/thong-bao/mau-thong-bao'])
        }
      },
    ]
    this.model.filter = '';
    this.getNotifyTempList();
    this.getFilter();
  }

  notifyTempList = [];
  getNotifyTempList() {
    this.apiService.getNotifyTempList().subscribe(results => {
      if (results.status === 'success') {
        this.notifyTempList = results.data.map(res => {
          return {
            label: `${res.tempName}`,
            value: res.tempId
          }
        });
      }
    });
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
    this.FnEvent()
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  listsData = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getAppNotifyPage(queryParams).subscribe(
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
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
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
          label: 'Sửa',
          icon: 'fa fa-edit',
          class: 'btn-dropbox text-white',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetAppNotifyPage.url, ACTIONS.VIEW)
        },
        // {
        //   onClick: this.handleAdd.bind(this),
        //   label: 'Lưu thông báo',
        //   icon: 'fa fa-check',
        //   class: 'btn-dropbox text-white',
        //   hide: CheckHideAction(MENUACTIONROLEAPI.GetAppNotifyPage.url, ACTIONS.LUU_THONG_BAO)
        // },
        {
          onClick: this.handleChangeStatus.bind(this),
          label: event.data.isPublish ? 'Hủy công bố' : 'Công bố',
          icon: 'fa fa-check',
          class: 'btn-dropbox text-white',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetAppNotifyPage.url, ACTIONS.CONG_BO)
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-google text-white',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetAppNotifyPage.url, ACTIONS.DELETE)
        }
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
        width: 70,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
  }


  handleAdd(e) {
    const params = {
      tempId: null,
      n_id: e.rowData.n_id,
      external_sub: null
    }
    this.router.navigate(['/cai-dat/thong-bao/mau-thong-bao/them-moi-mau-thong-bao'], { queryParams: params });
  }

  handleChangeStatus(e) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        this.spinner.show();
        this.apiService.setNotifyStatus({ n_id: e.rowData.n_id, status: !e.rowData.isPublish }).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
            this.spinner.hide();
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
            this.spinner.hide();
          }
        });
      }
    });
  }

  delRow(e) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        this.spinner.show();
        const queryParams = queryString.stringify({ n_id: e.rowData.n_id });
        this.apiService.delNotifyInfo(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.spinner.hide();
            this.load();
            this.FnEvent()
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
            this.spinner.hide();
          }
        });
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.items && this.items.dataList && this.items.dataList.data.length > 0) {
      this.gridApi.setRowData(this.items.dataList.data);
    }
  }

  editRow({rowData}) {
    this.modelAddNotifi.notiId = rowData.n_id
    this.Actions.value = 'Info';
    this.Actions.label = 'Sửa thông báo';
    this.router.navigate(['/cai-dat/thong-bao/chi-tiet-thong-bao'], 
    { queryParams: { notiId: rowData.n_id, external_sub: rowData.external_sub } });
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  createNotify() {

  }


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  handleFilter() {
    this.load();
  }

  displayNotify = false;
  AddNotify() {
    this.router.navigate(['cai-dat/thong-bao/them-moi-thong-bao'], 
    { queryParams: { 
      notiId: null, 
      external_sub: null, 
      tempId: null, 
      external_name: '' } 
    });
  }

  addNotifytoProject() {
    this.displayNotify = false;
    this.displaySelectRoom = false;
    // let items = this.moduleList.filter(d => d.value === this.modelAddNotifi.external_sub);
    this.router.navigate(['cai-dat/thong-bao/them-moi-thong-bao'], 
    { queryParams: { 
      notiId: null, 
      external_sub: this.modelAddNotifi.external_sub, 
      tempId: this.modelAddNotifi.tempId, 
      external_name: ''
      // external_name: items[0].label // bỏ tổ chức
    } 
    });
  }

  modelAddNotifi = {
    notiId: null,
    external_sub: '',
    ord_code: '',
    custId: '',
    tempId: null
  }

  rooms = [];
  displaySelectRoom = false;

  saveNotify(data) {
    this.Actions.value = 'Lists'
  }

  saveAddRoom(data) {
    console.log(data)
  }

  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v1/notify/GetNotifyFilter').subscribe(results => {
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


showFilter() {
    const ref = this.dialogService.open(FormFilterComponent, {
      header: 'Tìm kiếm nâng cao',
      width: '40%',
      contentStyle: "",
      data: {
        listViews: this.listViewsFilter,
        detailInfoFilter: this.detailInfoFilter,
        buttons: this.optionsButonFilter
      }
    });

    ref.onClose.subscribe((event: any) => {
      if (event) {
        this.listViewsFilter = cloneDeep(event.listViewsFilter);
        if (event.type === 'Search') {
          this.query = { ...this.query, ...event.data };
          this.load();
        } else if (event.type === 'CauHinh') {
          this.apiService.getFilter('/api/v1/notify/GetNotifyFilter').subscribe(results => {
            if (results.status === 'success') {
              const listViews = cloneDeep(results.data.group_fields);
              this.listViewsFilter = [...listViews];
              const params =  getParamString(listViews)
              this.query = { ...this.query, ...params};
              this.load();
              this.detailInfoFilter = results.data;
              this.showFilter()
            }
          });

        } else if (event.type === 'Reset') {
          const listViews = cloneDeep(this.cloneListViewsFilter);
          this.listViewsFilter = cloneDeep(listViews);
         const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
        this.load();
        }
      }
    });
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
          this.AddNotify()
        });
      }
    }, 3000);
  }
}
