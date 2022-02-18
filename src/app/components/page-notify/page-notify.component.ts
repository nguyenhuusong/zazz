import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-page-notify',
  templateUrl: './page-notify.component.html',
  styleUrls: ['./page-notify.component.css']
})
export class PageNotifyComponent implements OnInit, OnDestroy, AfterViewChecked {
  agGridFn = AgGridFn;
  public modules: Module[] = AllModules;
  loading = false;
  Actions = {
    label: 'Danh sách thông báo',
    value: 'Lists'
  }
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
    prod_cd: '',
    filter: '',
    gridWidth: 0,
    offSet: 0,
    pageSize: 15
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
  handleReset() {
    this.query = {
      prod_cd: '',
      filter: '',
      gridWidth: 0,
      offSet: 0,
      pageSize: 15
    }
  }

  changePageSize() {
    this.load();
  }


  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".breadcrumb");
    const d: any = document.querySelector(".filterInput");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 45;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
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
    this.getModuleList();
    this.getNotifyTempList();
    this.load();
    // this.pagingComponent.pageSize = this.filter.pageSize;
  }
  moduleList = [];
  notifyTempList = [];
  getModuleList() {
    this.apiService.getModuleList().subscribe(results => {
      if (results.status === 'success') {
        this.moduleList = results.data.map(res => {
          return {
            label: `${res.org_name} (${res.org_cd})`,
            value: res.org_cd
          }
        });
      }
    });
  }

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
  }

  listsData = [];
  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getAppNotifyPage(queryParams).subscribe(
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
          onClick: this.handleAdd.bind(this),
          label: 'Lưu thông báo',
          icon: 'fa fa-check',
          class: 'btn-dropbox text-white',
        },
        {
          onClick: this.handleChangeStatus.bind(this),
          label: event.data.isPublish ? 'Hủy công bố' : 'Công bố',
          icon: 'fa fa-check',
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

  handleDelete(e) {
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

  handleEdit(data) {
    this.modelAddNotifi.notiId = data.rowData.notiId
    this.Actions.value = 'Info';
    this.Actions.label = 'Sửa thông báo';
    this.router.navigate(['/cai-dat/thong-bao/chi-tiet-thong-bao'], { queryParams: { notiId: data.rowData.n_id, external_sub: data.rowData.external_sub } });
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
    this.displayNotify = true;
    this.modelAddNotifi = {
      external_sub: this.moduleList.length > 0 ? this.moduleList[0].value : '',
      notiId: 0,
      ord_code: '',
      custId: '',
      tempId: null
    };
  }

  addNotifytoProject() {
    this.displayNotify = false;
    this.displaySelectRoom = false;
    let items = this.moduleList.filter(d => d.value === this.modelAddNotifi.external_sub);
    this.router.navigate(['cai-dat/thong-bao/them-moi-thong-bao'], { queryParams: { notiId: null, external_sub: this.modelAddNotifi.external_sub, tempId: this.modelAddNotifi.tempId, external_name: items[0].label } });
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
}
