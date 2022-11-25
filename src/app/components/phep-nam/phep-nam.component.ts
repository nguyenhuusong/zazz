import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { ExportFileService } from 'src/app/services/export-file.service';
import * as FileSaver from 'file-saver';
const MAX_SIZE = 100000000;

@Component({
  selector: 'app-phep-nam',
  templateUrl: './phep-nam.component.html',
  styleUrls: ['./phep-nam.component.scss']
})
export class PhepNamComponent implements OnInit, AfterViewChecked {

  listsData: any[] = [];
  items = [];
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
    private fileService: ExportFileService,
    private router: Router) {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      avatarRendererFull: AvatarFullComponent,
    };
  }
  frameworkComponents;
  public agGridFn = AgGridFn;
  cols: any[];
  colsDetail: any[];
  columnDefs = [];
  defaultColDef;
  gridApi: any;
  clientWidth: any;
  gridflexs: any;
  query = {
    filter: '',
    offSet: 0,
    pageSize: 15,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    organizeId: '',
    organizeIds: '',
    companyIds: [],
  }
  totalRecord = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  loading = false;

  loadjs = 0;
  heightGrid = 0;
  companies = [];
  months = [];
  years = []
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 25;
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
      offSet: 0,
      pageSize: 15,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      organizeId: '',
      organizeIds: this.query.organizeIds,
      companyIds: this.query.companyIds,
    }
    if(this.companies.length > 0) {
      this.query.companyIds = this.companies[0].value;
    }
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }
  
  load() {
    this.columnDefs = []
    this.spinner.show();
    const params: any = { ...this.query };
    let companyIds = this.query.companyIds.toString();
    params.companyIds = companyIds;
    const queryParams = queryString.stringify(params);
    this.apiService.getAnnualLeavePage(queryParams).subscribe(
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
      ]
    };
  }

  dataInfo: any = []
  isShowInfo = false
  XemChiTiet(event) {
    this.spinner.show();
    this.isShowInfo = true;
    const query = {
      empId: event.rowData.empId,
      year: this.query.year,
      month: this.query.month,
    }
    this.apiService.getLeaveRequestMonthInfo(queryString.stringify(query)).subscribe(
      (results: any) => {
        if(results.status === "success"){
          this.spinner.hide();
          this.dataInfo = results.data
            
        }
      }),
      error => { };
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
          this.query.organizeIds = results;
          this.query.organizeId = results;
          this.getCompany();
        }
    });
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Phép năm' },
    ];
    this.getOrgRoots();
    let currentDay = new Date().getDate();
    if(currentDay >= 25 && currentDay <= 31){
      this.query.month = this.query.month + 1;
    }

    this.getMonthYear();
  }

  goToPhepBu() {
    this.router.navigate(['/chinh-sach/phep-bu']);
  }

  organizeId = ''
  orgRoots = [];
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
        this.orgRoots = [{ label: 'Tất cả', value: null }, ...this.orgRoots]
      }
    })
  }


  getCompany() {
    const query = { organizeIds: this.query.organizeIds}
    this.apiService.getUserCompanies(queryString.stringify(query)).subscribe(
      (results: any) => {
        if(results.status === "success"){
          this.companies = results.data
            .map(d => {
              return {
                label: d.companyName,
                value: d.companyId
              };
            });
            if(this.companies.length > 0) {
              this.query.companyIds = this.companies[0].value;
            }
            this.load();
        }
      }),
      error => { };
  }

  exportData() {
    this.spinner.show();
    this.query.pageSize = 1000000;
    const query = { ...this.query };
    const queryParams = queryString.stringify(query);
      this.apiService.exportAnnualleave(queryParams).subscribe(results => {
        if (results.type === 'application/json') {
          this.spinner.hide();
        } else {
          var blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          FileSaver.saveAs(blob, `Danh sách phép năm` +".xlsx");
          this.spinner.hide();
        }
      })
  }

  replaceHtmlToText(string) {
    return string.replace(/(<([^>]+)>)/gi, "");
  }

  changeMonth(event) {
    if(this.query.month > 12){
      this.query.month = 12;
    }else if(this.query.month < 1){
      this.query.month = 1;
    }
  }

  getMonthYear() {
    this.months = [
      { label: 'Tháng 1', value: 1 },
      { label: 'Tháng 2', value: 2 },
      { label: 'Tháng 3', value: 3 },
      { label: 'Tháng 4', value: 4 },
      { label: 'Tháng 5', value: 5 },
      { label: 'Tháng 6', value: 6 },
      { label: 'Tháng 7', value: 7 },
      { label: 'Tháng 8', value: 8 },
      { label: 'Tháng 9', value: 9 },
      { label: 'Tháng 10', value: 10 },
      { label: 'Tháng 11', value: 11 },
      { label: 'Tháng 12', value: 12 },
    ]

    let minYear = 2000;
    let maxYear = 2040;
    for (let i = minYear; i <= maxYear; i++) {
      this.years.push({ label: 'Năm ' + i, value: i })
    }
  }

}


