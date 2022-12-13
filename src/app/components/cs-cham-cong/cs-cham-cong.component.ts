import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { cloneDeep } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { FormFilterComponent } from 'src/app/common/form-filter/form-filter.component';
@Component({
  selector: 'app-cs-cham-cong',
  templateUrl: './cs-cham-cong.component.html',
  styleUrls: ['./cs-cham-cong.component.scss']
})
export class CsChamCongComponent implements OnInit {
  dataChamCong: any;
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private organizeInfoService: OrganizeInfoService,
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
  columnDefs: any = [];
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
    organizeId: null,
    // fromDate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
    // toDate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
    filter: '',
    offSet: 0,
    pageSize: 15,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    organizeIds: '',
    companyIds: [],
  }

  queryCheckInOut = {
    filter: '',
    pageSize: 15,
    fromdate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
    todate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
    offSet: 0,
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
  itemsToolOfGrid: any[] = [];
  companies = [];
  
  listViewsFilter = [];
  cloneListViewsFilter = [];
detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancel() {
    this.query = {
      organizeId: null,
      // fromDate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
      // toDate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).format()),
      filter: '',
      offSet: 0,
      pageSize: 15,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      organizeIds: this.query.organizeIds,
      companyIds: this.query.companyIds,
    }
    if(this.companies.length > 0) {
      this.query.companyIds = this.companies[0].value;
    }
    this.load();
  }

  Export() {
    let params: any = {... this.query};
    // delete params.organizeId
    delete params.fromDate
    delete params.toDate
    // params.FromDate = moment(new Date(this.query.fromDate)).format('YYYY-MM-DD')
    // params.ToDate = moment(new Date(this.query.toDate)).format('YYYY-MM-DD')

    const queryParams = queryString.stringify(params);
    this.spinner.show();
    this.apiService.getExportReport('ExportBangLuongThang',queryParams).subscribe(results => {
      if (results.type === 'application/json') {
        this.spinner.hide();
      } else {
        var blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, `Danh sách chấm công tháng ${this.query.month}` + ".xlsx");
        this.spinner.hide();
      }
    })
  }

  ExportCheckInOut() {
    this.router.navigate(['/chinh-sach/cham-cong/xem-cong']);
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  listsData = []
  load() {
    this.columnDefs = []
    this.spinner.show();
    let params: any = {... this.query};
    let companyIds =  this.query.companyIds.toString();
    params.companyIds = companyIds;
    // params.fromDate = moment(new Date(this.query.fromDate)).format('YYYY-MM-DD')
    // params.toDate = moment(new Date(this.query.toDate)).format('YYYY-MM-DD')
    const queryParams = queryString.stringify(params);
    this.apiService.getEmployeeSalaryMonthPage(queryParams).subscribe(
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
          onClick: this.XemChiTiet.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetEmployeeSalaryMonthPage.url, ACTIONS.VIEW)

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
        maxWidth: 90,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
  }

  XemChiTiet(event) {
    const params = {
      empId: event.rowData.empId,
      salary_month: this.query.month,
      salary_year: this.query.year
    }
    this.router.navigate(['/chinh-sach/cham-cong/chi-tiet-cham-cong'], { queryParams: params });
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
          // this.load();
          // this.getOrgRoots();
          this.getCompany();
        }
    });
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách chấm công' },
    ];
    this.itemsToolOfGrid = [
      {
        label: 'Check in/out',
        code: 'Import',
        icon: 'pi pi-sign-in',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetEmployeeSalaryMonthPage.url, ACTIONS.IMPORT),
        command: () => {
          this.ExportCheckInOut();
        }
      },
      {
        label: 'Export chấm công',
        code: 'Import',
        icon: 'pi pi-download',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetEmployeeSalaryMonthPage.url, ACTIONS.EXPORT),
        command: () => {
          this.Export();
        }
      },
    ];
    this.getFilter();
  }


  getCompany() {
    const query = { organizeIds: this.query.organizeIds}
    this.apiService.getUserCompanies(queryString.stringify(query)).subscribe(
      (results: any) => {
        if(results.status === "success"){
          this.companies = results.data
            .map(d => {
              return {
                label: d.name,
                value: d.value
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

  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v1/timekeeping/GetTimekeepingFilter').subscribe(results => {
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
          this.apiService.getFilter('/api/v1/timekeeping/GetTimekeepingFilter').subscribe(results => {
            if (results.status === 'success') {
              const listViews = cloneDeep(results.data.group_fields);
              this.cloneListViewsFilter = cloneDeep(listViews);
this.listViewsFilter = [...listViews];
const params =  getParamString(listViews)
this.query = { ...this.query, ...params};
this.load();
              this.detailInfoFilter = results.data;
              this.showFilter()
            }
          });

        } else if (event.type === 'Reset') {
          const listViews = cloneDeep(this.detailInfoFilter.group_fields);
          this.listViewsFilter = cloneDeep(listViews);
          this.cancel();
        }
      }
    });
  }

  getOrgRoots() {
    this.apiService.getOrgRoots().subscribe(results => {
      if (results.status === 'success') {
        this.listOrgRoots = results.data.map(d => {
          return {
            label: d.org_name,
            value: `${d.orgId}`
          }
        });
        this.listOrgRoots = [{ label: 'Tất cả', value: null }, ...this.listOrgRoots];
        // this.query.organizeId = this.listOrgRoots[0].value
        this.load();
      }
    })
  }


}




