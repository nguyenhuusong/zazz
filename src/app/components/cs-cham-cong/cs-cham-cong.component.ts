import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import queryString from 'query-string';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { cloneDeep } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { Subject, takeUntil } from 'rxjs';
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
  query: any = {
    filter: '',
    offSet: 0,
    pageSize: 20,
  }

  queryCheckInOut = {
    filter: '',
    pageSize: 20,
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
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm  addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger  addNew', icon: 'pi pi-times' },
  ];
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

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  Export() {
    let params: any = {... this.query};
    delete params.fromDate
    delete params.toDate
    const queryParams = queryString.stringify(params);
    // this.spinner.show();
    this.apiService.getExportReport('ExportTimeKeepingInfo',queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.type === 'application/json') {
        this.spinner.hide();
      } else {
        var blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, `Danh sách chấm công tháng ${this.query.month}` + ".xlsx");
        this.spinner.hide();
      }
    })
  }

  tongQuan() {
    this.router.navigate(['/chinh-sach/cham-cong/tong-quan']);
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
    const queryParams = queryString.stringify(params);
    this.apiService.getEmployeeSalaryMonthPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
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
          onClick: this.editRow.bind(this),
          label: 'Xem',
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
        maxWidth: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
  }

  editRow({rowData}) {
    const params = {
      empId: rowData.empId,
      salary_month: this.query.month,
      salary_year: this.query.year
    }
    this.router.navigate(['/chinh-sach/cham-cong/chi-tiet-cham-cong'], { queryParams: params });
  }

  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
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
      }
    ];
    this.getFilter();
  }


  getCompany() {
    
  }

  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v1/timekeeping/GetTimekeepingFilter')
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


  getOrgRoots() {
    this.apiService.getOrgRoots()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
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




