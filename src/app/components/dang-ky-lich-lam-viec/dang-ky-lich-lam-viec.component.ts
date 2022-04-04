import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import * as moment from 'moment';
@Component({
  selector: 'app-dang-ky-lich-lam-viec',
  templateUrl: './dang-ky-lich-lam-viec.component.html',
  styleUrls: ['./dang-ky-lich-lam-viec.component.scss']
})
export class DangKyLichLamViecComponent implements OnInit {
  dataChamCong: any;
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
  modelAdd = {
    date: new Date(),
    organizeId: ''
  }
  listOrgRoots = [];
  displayFrom = false;
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
    pageSize: 15,
    organizeId: null,
    orgId: null,
    work_cd: null,
    app_st: null,
    is_flexible: null
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".breadcrumb");
    const d: any = document.querySelector(".filterInput");
    // const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight  + 45;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancel() {
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 15,
      organizeId: null,
      orgId: null,
      work_cd: null,
      app_st: null,
      is_flexible: null
    }
    this.load();
  }

  modelChangeStatus ={
    empIds: [
      {
        gd: null
      }
    ],
    work_cd: null,
    start_dt: moment(new Date()).format('DD/MM/YYYY')
  }
  displayChangeStatus = false;

  listsData = []
  load() {
    this.columnDefs = []
    this.spinner.show();
    let params: any = {... this.query};
    const queryParams = queryString.stringify(params);
    this.apiService.getEmpWorkingPage(queryParams).subscribe(
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
        // {
        //   onClick: this.XemChiTiet.bind(this),
        //   label: 'Xem chi tiết',
        //   icon: 'fa fa-eye',
        //   class: 'btn-primary mr5',
        // },
        {
          onClick: this.doiLichLamViec.bind(this),
          label: 'Đổi lịch làm việc',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
        }
      ]
    };
  }

  doiLichLamViec(event) {
    this.modelChangeStatus ={
      empIds: [
        {
          gd: null
        }
      ],
      work_cd: event.rowData.work_cd,
      start_dt: moment(new Date()).format('DD/MM/YYYY')
    }
    this.displayChangeStatus = true;
  }
  organizes = []
  getModuleList() {
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        const moduleLists = results.data.map(d => {
          return {
            label: `${d.organizationName}`,
            value: d.organizeId,
            ...d
          }
        });
        this.organizes = moduleLists
      }
    })
  }

  handleChangeOrganize(): void {
    this.query.orgId = '';
    this.getOrganizeTree();
    this.find();
  }
  departmentFiltes = [];
  getOrganizeTree(): void {
    const queryParams = queryString.stringify({ parentId: this.query.organizeId});
    this.apiService.getOrganizeTree(queryParams)
      .subscribe((results: any) => {
        if (results && results.status === 'success') {
          this.departmentFiltes = results.data;
        }
      },
        error => { });
  }

  onChangeTree(a): void {
    this.find();
  }

  listWorkCds = [];
  listAppSt = [];
  listIsFlexible = [];
  getWorkTime() {
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getWorktimePage(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listWorkCds = results.data.dataList.data.map(d => {
          return { label: d.work_times + '-' + d.work_cd, value: d.work_cd }
        });
      }
    })
  }

  getCustObjectListNew(params) {
    const queryParams = queryString.stringify({ objKey: params});
    this.apiService.getCustObjectListNew(true, queryParams).subscribe(results => {
      if(params === 'empworking_app_st') {
        this.listAppSt = results.data.map(d => {
          return {
            label: d.objName,
            value: d.objValue
          }
        });
      }else {
        this.listIsFlexible = results.data.map(d => {
          return {
            label: d.objName,
            value: d.objValue
          }
        });
      }
   
    });
  }

  initGrid() {
    this.columnDefs = [ 
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerName: 'Thao tác',
        filter: '',
        maxWidth: 90,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }
      ]
  }

  XemChiTiet(event) {
    const params = {
      reason_code: event.rowData.reason_code,
    }
    this.router.navigate(['/cai-dat/ly-do-nghi/chi-tiet-ly-do-nghi'], { queryParams: params });
  }

  create() {
    const params = {
      reason_code: null,
    }
    this.router.navigate(['/cai-dat/ly-do-nghi/them-moi-ly-do-nghi'], { queryParams: params });
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
    this.getCustObjectListNew('empworking_app_st');
    this.getCustObjectListNew('worktimes_flexible');
    this.getModuleList();
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Góp ý' },
    ];
    this.load();
    this.getFeedbackType();
  }
  typeFeedBacks = [];
  getFeedbackType() {
    this.apiService.getFeedbackType().subscribe(results => {
      if(results.status === 'success') {
        this.typeFeedBacks = results.data.map(d => {
          return {
            label: d.feedbackTypeName,
            value: d.feedbackTypeId
          }
        });
        this.typeFeedBacks = [{label: 'Tất cả', value: null}, ...this.typeFeedBacks]
      }
    })
  }
  
  changeStatus(event) {
    console.log(event)
    let params = {...this.modelChangeStatus};
    params.empIds = event.appUsers.map(d => {
      return {
        gd: d.userId
      }
    });
      this.apiService.setEmpWorkingChanges(params).subscribe(results => {
         if(results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Đổi lịch công việc thành công' });
          this.load();
          this.displayChangeStatus = true;
         }
      })

  }

}




