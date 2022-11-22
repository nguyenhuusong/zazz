import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
const MAX_SIZE = 100000000;

@Component({
  selector: 'app-ds-tiem-nang',
  templateUrl: './ds-tiem-nang.component.html',
  styleUrls: ['./ds-tiem-nang.component.scss']
})
export class DsTiemNangComponent implements OnInit {

  listsData: any[] = [];
  items = []
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
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
      avatarRendererFull: AvatarFullComponent,
    };
  }
  pagingComponent = {
    total: 0
  }
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  columnDefs = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  gridApi: any;
  clientWidth: any;
  gridColumnApi: any;
  gridflexs: any;
  getRowHeight;
  query = {
    vacancyId: 0,
    can_st: null,
    organizeId: null,
    positionCd: null,
    filter: '',
    offSet: 0,
    pageSize: 15,
    organizeIds: '',
    fromDate: '',
    toDate: '',
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
  listVacancy = [];
  recruitmentStatus = [
    
  ]
  recruitmentStatusSelected = '1';
  dataRowSelected: any = []
  isSendMail = false;
  mailInputValue: any = [];
  buttonTiemNang = []
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  loadjs = 0;
  heightGrid = 450;

  // the value for check disabled 'Chuyển vòng radio'
  canSttValue = null
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }

  cancel() {
    this.query = {
      vacancyId: 0,
      can_st: null,
      organizeId: null,
      positionCd: null,
      filter: '',
      offSet: 0,
      pageSize: 15,
      fromDate: '',
      toDate: '',
      organizeIds: this.query.organizeIds,
    }
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.dataRowSelected = [];
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getCandidatePotentialPage(queryParams).subscribe(
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
          onClick: this.viewRow.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetCandidatePage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.xoatuyendung.bind(this),
          label: 'Xóa ',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetCandidatePage.url, ACTIONS.DELETE)
        },
      ]
    };
  }

  viewRow(event) {
    const params = {
      canId: event.rowData.canId,
      view: true
    }
    this.router.navigate(['/tuyen-dung/ds-tuyen-dung/chi-tiet-tuyen-dung'], { queryParams: params });
  }

  xoatuyendung(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tuyển dụng?',
      accept: () => {
        const queryParams = queryString.stringify({ canId: event.rowData.canId });
        this.apiService.delCandidateInfo(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa tuyển dụng thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: '',
        filter: '',
        width: 60,
        pinned: 'left',
        cellClass: ['border-right', 'no-auto'],
        field: 'checkbox2',
        headerCheckboxSelection: false,
        suppressSizeToFit: true,
        suppressRowClickSelection: true,
        showDisabledCheckboxes: true,
        checkboxSelection: true,
        // rowSelection: 'single'
      },
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),{
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

  rowSelected(event) {
    this.getReRound();
    this.dataRowSelected = event;
    this.recruitmentStatusSelected = this.dataRowSelected.map( d => d.can_st).toString();
    this.canSttValue = this.dataRowSelected.sort((a,b)=>a.can_st-b.can_st)[this.dataRowSelected.length - 1];
    // check role for set tiem nang
  }

  getOrgPositions() {
    this.positions = [];
    let items = this.listOrgRoots.filter(d => d.value === this.query.organizeId)
    const queryParams = queryString.stringify({ orgId: items[0].code });
    this.apiService.getOrgPositions(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.positions = results.data.map(d => {
          return { label: d.positionName, value: d.positionCd }
        });
        this.positions = [{ label: 'Tất cả', value: '' }, ...this.positions]
      }
    })
  }

  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }

  ngOnInit() {
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results && results.length>0){
          this.query.organizeIds = '';
          this.listsData = []
          this.load();
        }
    });

    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Nhân sự' },
      { label: 'Danh sách tuyển dụng', routerLink: '/tuyen-dung/ds-tuyen-dung' },
      { label: 'Danh sách tiềm năng' },
    ];
    this.getJobTitles();
    this.getOrgRoots();
    this.getObjectList();
    this.getStatus();
    this.getVacancyPage();
  }

  getOrgRoots() {
    this.apiService.getOrgRoots().subscribe(results => {
      if (results.status === 'success') {
        this.listOrgRoots = results.data.map(d => {
          return {
            label: d.org_name + '-' + d.org_cd,
            value: `${d.orgId}`,
            code: `${d.orgId}`,
          }
        });

        this.listOrgRoots = [{ label: 'Tất cả', value: null }, ...this.listOrgRoots];
      }
    })
  }

  getObjectList() {
    const queryParams = queryString.stringify({ objKey: 'positiontype_group' });
    this.apiService.getCustObjectListNew(false, queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.positiontypes = results.data.map(d => {
          return {
            label: d.objName,
            value: d.objCode
          }
        });
        this.positiontypes = [{ label: 'Tất cả', value: null }, ...this.positiontypes]
      }
    })
  }

  listOrgRoots = [];
  positiontypes = [];
  listJobTitles = [];
  positions = [{ label: 'Tất cả', value: null }];
  getJobTitles() {
    this.apiService.getJobTitles().subscribe(results => {
      if (results.status === 'success') {
        this.listJobTitles = results.data.map(d => {
          return {
            label: d.job_name,
            value: d.jobId
          }
        });
        this.listJobTitles = [{ label: 'Tất cả', value: null }, ...this.listJobTitles]
      }
    })
  }

  listStatus = []
  getStatus() {
    const queryParams = queryString.stringify({ objKey: 'recruitment_round' });
    this.apiService.getCustObjectListNew(false, queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listStatus = results.data.map(d => {
          return {
            label: d.objName,
            value: d.objCode
          }
        });
        this.listStatus = [{ label: 'Tất cả', value: null }, ...this.listStatus];
        this.recruitmentStatus = results.data.map(d => {
          return {
            label: d.objName,
            code: d.objCode
          }
        });
      }
    })
  }

  getReRound() {
    this.recruitmentStatus = []
    const queryParams = queryString.stringify({ objKey: 'recruitment_round' });
    this.apiService.getCustObjectListNew(false, queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.recruitmentStatus = results.data.map(d => {
          return {
            label: d.objName,
            code: parseInt(d.objCode)
          }
        });
      }
    })
  }
    
  getVacancyPage() {
    const queryParams = queryString.stringify({
      // jobId: this.query.jobId,
      active_st: 1
    });
    this.apiService.getVacancyPage(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listVacancy = results.data.dataList.data.map(d => {
          return {
            label: d.job_name,
            value: d.vacancyId
          }
        })
      }
    })
  }

  changeRecruStatus() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn chuyển vòng?',
      accept: () => {
        let dataUpdateStatus = this.dataRowSelected.map( d => d.canId).toString();
        let vacancyId = this.dataRowSelected.map( d => d.vacancyId).toString();
        const query = {
          canId: dataUpdateStatus,
          can_st: this.recruitmentStatusSelected,
          vacancyId: vacancyId
        }
        this.apiService.recruiUpdateStatus(queryString.stringify(query)).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Chuyển thành công!' });
            this.dataRowSelected = [];
            this.load();
            this.recruitmentStatusSelected = null;
            this.isSendMail = true;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      },
    });
  }

}

