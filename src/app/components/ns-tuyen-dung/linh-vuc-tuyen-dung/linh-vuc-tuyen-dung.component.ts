import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
const MAX_SIZE = 100000000;
@Component({
  selector: 'app-linh-vuc-tuyen-dung',
  templateUrl: './linh-vuc-tuyen-dung.component.html',
  styleUrls: ['./linh-vuc-tuyen-dung.component.scss']
})
export class LinhVucTuyenDungComponent implements OnInit, AfterViewChecked {

  listsData: any;
  constructor(
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
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
  pagingComponent = {
    total: 0
  }

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
  orgRoots = [];
  positiontypes = [];
  listJobTitles = [];
  getRowHeight;
  query = {
    jobId: -1,
    filter: '',
    offSet: 0,
    pageSize: 15,
    gridWidth: 1300,
    organizeId: null,
    positionTypeCd: null,
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

  }

  cancel() {
    this.query = {
      jobId: -1,
      positionTypeCd: null,
      filter: '',
      offSet: 0,
      pageSize: 15,
      gridWidth: 1300,
      organizeId: null,
    }
    this.load();
  }



  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }


  load() {
    this.columnDefs = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.query);
    this.apiService.getJobPage(queryParams).subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
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
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.query.offSet = 0 : this.query.offSet + 1;
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
          onClick: this.XemChiTiet.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.xoalinhvuc.bind(this),
          label: 'Xóa ',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
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

  xoalinhvuc(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện xóa Chuyên môn này !',
      accept: () => {
        const queryParams = queryString.stringify({ jobId: event.rowData.jobId });
        this.apiService.delJobInfo(queryParams).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa Chuyên môn thành công' });
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
      jobId: event.rowData.jobId
    }
    this.router.navigate(['/tuyen-dung/chuyen-mon/chi-tiet-linh-vuc-tuyen-dung'], { queryParams: params });
  }

  addJob() {
    const params = {
      jobId: 0
    }
    this.router.navigate(['/tuyen-dung/chuyen-mon/them-moi-linh-vuc-tuyen-dung'], { queryParams: params });
  }

  find() {
    this.load();
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Tuyển dụng', },
      { label: 'Danh sách Chuyên môn tuyển dụng' },
    ];
    this.getJobTitles();
    this.getObjectList();
    this.getOrgRoots();
    this.load();
  }

  getOrgRoots() {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.orgRoots = results.data.map(d => {
          return {
            label: d.organizationName + '-' + d.organizationCd,
            value: `${d.organizeId}`
          }
        });
        this.orgRoots = [{label: 'Tất cả', value: null}, ...this.orgRoots]
      }
    })
  }

  getObjectList() {
    const queryParams = queryString.stringify({ objKey: 'positiontype_group' });
    this.apiService.getCustObjectListNew(false,queryParams).subscribe(results => {
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

  getJobTitles() {
    this.apiService.getJobTitles().subscribe(results => {
      if (results.status === 'success') {
        this.listJobTitles = results.data.map(d => {
          return {
            label: d.job_name,
            value: d.jobId
          }
        });
        this.listJobTitles = [{ label: 'Tất cả', value: -1 }, ...this.listJobTitles]
      }
    })
  }


}

