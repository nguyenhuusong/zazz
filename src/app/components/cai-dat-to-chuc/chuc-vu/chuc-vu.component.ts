import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { HttpParams } from '@angular/common/http';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
@Component({
  selector: 'app-chuc-vu',
  templateUrl: './chuc-vu.component.html',
  styleUrls: ['./chuc-vu.component.scss']
})
export class ChucVuComponent implements OnInit, AfterViewChecked {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  dataChucVu: any;
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef,
    private organizeInfoService: OrganizeInfoService,
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
    };
  }
  pagingComponent = {
    total: 0
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
  orgLevel;
  query = {
    filter: '',
    offSet: 0,
    pageSize: 15,
    organizeId: 0,
    organizeIds: '',
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
  paramsObject = null

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 15,
      organizeId: 0,
      organizeIds: this.query.organizeIds
    }
    this.load();
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  organizes = []
  getOrrginiaztions() {
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if(results.status === 'success') {
          this.organizes = results.data.map(d => {
            return {
              label: d.organizationName,
              value: `${d.organizeId}`
            }
          });
          this.organizes = [...this.organizes];
      }
    })
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
    this.apiService.getPositionPage(queryParams).subscribe(
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
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 :  this.query.offSet + 1;
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
          onClick: this.XemChiTiet.bind(this),
          label: 'Thông tin chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetPositionPage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.xoacongty.bind(this),
          label: 'Xóa chức vụ',
          icon: 'pi pi-trash',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetPositionPage.url, ACTIONS.DELETE)
        },
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

  xoacongty(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện xóa chức vụ?',
      accept: () => {
        const queryParams = queryString.stringify({ positionId: event.rowData.positionId });
        this.apiService.delPositionInfo(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa chức vụ thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  XemChiTiet(event) {
    const params = {
      positionId: event.rowData.positionId,
      organizeId: this.query.organizeId,
    }
    this.router.navigate(['/cai-dat/chuc-vu/chi-tiet-chuc-vu'], { queryParams: params });
  }

  addChucVu() {
    const params = {
      organizeId: this.query.organizeId,
      positionId: 0
    }
    this.router.navigate(['/cai-dat/chuc-vu/them-moi-chuc-vu'], { queryParams: params });
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
          this.query.organizeId = results;
          this.route.queryParamMap.subscribe((params: any) => {
            this.orgLevel = params.params.org_level;
            // this.query.org_level = params.params.org_level;
            this.load();
          });
        }
    });
    this.getOrrginiaztions();
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách tổ chức', routerLink: '/cai-dat/cai-dat-to-chuc' },
      { label: 'Danh sách chức vụ'},
    ];
    this.getCustObjectListNew();
  }

  listLevers = []
  getCustObjectListNew() {
    const opts1 = { params: new HttpParams({ fromString: `objKey=hrm_org_level` }) };
    this.apiService.getCustObjectListNew(true, opts1.params.toString()).subscribe(results => {
      this.listLevers = results.data.map(d => {
        return {
          label: d.objName,
          value: d.objValue
        }
      });

      this.listLevers = [{ label: 'Tất cả', value: 0 }, ...this.listLevers]
    });
  }
}


