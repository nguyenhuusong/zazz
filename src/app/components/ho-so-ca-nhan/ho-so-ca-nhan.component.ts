import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import * as FileSaver from 'file-saver';
const MAX_SIZE = 100000000;
import { cloneDeep } from 'lodash';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { ValidationEmail, ValidationPhoneNumber } from 'src/app/common/edit-detail/validation';
@Component({
  selector: 'app-ho-so-ca-nhan',
  templateUrl: './ho-so-ca-nhan.component.html',
  styleUrls: ['./ho-so-ca-nhan.component.scss']
})
export class HoSoCaNhanComponent implements OnInit, AfterViewChecked {

  listsData: any[] = [];
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  displayApprovedProfile = false;
  constructor(
    private apiService: ApiHrmService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
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

  public modules: Module[] = AllModules;
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
  getRowHeight;
  query = {
    filter: '',
    is_worked: 1,
    keyType: '',
    keyName: '',
    offSet: 0,
    pageSize: 20,
  }
  idRow = null;
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  isSearchEmp : boolean = false;
  loading = false;
  selectedValue: any = '';
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  tabIndex: number = 0
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadjs = 0;
  heightGrid = 0;
  dataRowSelected: any = [];
  optionsButtonDB: any = [];
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 30;
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
      is_worked: this.query.is_worked,
      keyType: '',
      keyName: '',
      offSet: 0,
      pageSize: 20,
    }
    this.load();
  }

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.load();
  }

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  handleChange(index) {
    this.tabIndex = index;
    this.query.is_worked = this.tabIndex === 0 ? 1 : 2;
    this.load()
  }

  load() {
    this.columnDefs = []
    let params: any = { ... this.query };
    const queryParams = queryString.stringify(params);
    this.apiService.getCustSearch(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.listsData = results.data.dataList.data;
          this.gridKey = results.data.dataList.gridKey;
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
          this.countRecord.currentRecordStart = this.query.offSet + 1;
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
          onClick: this.ViewDetail.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
        },
        {
          onClick: this.approved.bind(this),
          label: 'Xác minh tài khoản',
          icon: 'pi pi-check',
          class: 'btn-primary mr5',
          hide: this.tabIndex === 0
        },
        {
          onClick: this.ChangePhone.bind(this),
          label: 'Thay đổi số điện thoại',
          icon: 'pi pi-phone',
          class: 'btn-primary mr5',
          hide: this.tabIndex === 0
        },
        {
          onClick: this.ChangeEmail.bind(this),
          label: 'Thay đổi tài khoản email',
          icon: 'pi pi-inbox',
          class: 'btn-primary mr5',
          hide: this.tabIndex === 0
        },
        {
          onClick: this.delRow.bind(this),
          label: 'Xóa giấy tờ',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          hide: this.tabIndex === 1
        },
      ]
    };
  }

  modelApproved = {
    cif_no: '',
    comments: '',
    name: '',
    typeChange :"Approved",
    emailChange: '',
    phoneChange: '',
  }

  ChangeEmail({rowData}) {
    this.idRow = rowData.custId;
    this.displayApprovedProfile = true;
    this.modelApproved.cif_no = rowData.custId;
    this.modelApproved.comments = '';
    this.modelApproved.name = rowData.full_name;
    this.modelApproved.typeChange = "Email";
  }

  ChangePhone({rowData}) {
    this.idRow = rowData.custId;
    this.displayApprovedProfile = true;
    this.modelApproved.cif_no = rowData.custId;
    this.modelApproved.comments = '';
    this.modelApproved.name = rowData.full_name;
    this.modelApproved.typeChange = "Phone";
  }

  approved({rowData}) {
    this.idRow = rowData.custId;
    this.displayApprovedProfile = true;
    this.modelApproved.cif_no = rowData.custId;
    this.modelApproved.comments = '';
    this.modelApproved.name = rowData.full_name;
    this.modelApproved.typeChange = "Approved";
  }

  saveApproved() {
    if(this.modelApproved.typeChange === 'Approved') {
      const params = {cif_no: this.modelApproved.cif_no, comments: this.modelApproved.comments};
      this.apiService.setCustProfileVerified(params)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.displayApprovedProfile = false;
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xác minh thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
    }else if(this.modelApproved.typeChange === 'Phone') {
      const objectError = ValidationPhoneNumber(this.modelApproved.phoneChange)
      if(objectError.error) {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: objectError.message });
        return
      }
      const params = {cif_no: this.modelApproved.cif_no, comments: this.modelApproved.comments, phone: this.modelApproved.phoneChange};
      this.apiService.setCustPhoneChanged(params)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thay đổi số điện thoại thành công' });
            this.displayApprovedProfile = false;
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
    }else {
      // bắt lỗi
      const objectError = ValidationEmail(this.modelApproved.emailChange)
      if(objectError.error) {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: objectError.message });
        return
      }
      const params = {cif_no: this.modelApproved.cif_no, comments: this.modelApproved.comments, email: this.modelApproved.emailChange};
      this.apiService.setCustEmailChanged(params)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            this.displayApprovedProfile = false;
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thay đổi email thành công' });
            this.load();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
    }
   
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if (dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.create()
        });
      }
    }, 300);
  }

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        // headerComponentParams: {
        //   template:
        //     `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        // },
        filter: '',
        width: 60,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]

  }

  delRow({rowData}) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa giấy tờ cá nhân?',
      accept: () => {
        const queryParams = queryString.stringify({ custId: rowData.custId});
        this.apiService.delCustProfile(queryParams)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(results => {
            if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Xóa giấy tờ thành công' });
              this.load();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
            }
          });
      }
    });
  }

  ViewDetail({rowData}) {
    const params = {
      custId: rowData.custId,
      type: this.tabIndex === 0 ? true : false
    }
    this.router.navigate(['/tuyen-dung/ho-so-ca-nhan/chi-tiet-ho-so-ca-nhan'], { queryParams: params });
  }

  editRow({ rowData }) {
    const params = {
      custId: rowData.custId,
      type: true
    }
    this.router.navigate(['/tuyen-dung/ho-so-ca-nhan/chi-tiet-ho-so-ca-nhan'], { queryParams: params });
  }

  onCellClicked(event) {
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = { rowData: event.data })
    }
  }

  create() {
    const params = {
      custId: null
    }
    this.router.navigate(['/tuyen-dung/ho-so-ca-nhan/them-moi-ho-so-ca-nhan'], { queryParams: params });
  }

  find() {
    this.load();
  }

  changePageSize() {
    this.load();
  }


  ngOnInit() {
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Quan hệ lao động' },
      { label: 'Danh sách hồ sơ cá nhân' },
    ];
    this.load();
    this.optionsButtonDB = [
      // {
      //   label: 'Import kế hoạch',
      //   code: 'import',
      //   icon: 'fa fa-download',
      //   // disabled: CheckHideAction(MENUACTIONROLEAPI.getRecruitPlanPage.url, ACTIONS.EXPORT),
      //   command: () => {
      //     this.import();
      //   }
      // },
      // {
      //   label: 'Export',
      //   code: 'export',
      //   icon: 'fa fa-download',
      //   command: () => {
      //     this.export();
      //   }
      // },

    ]
  }

  import() {
    this.router.navigate(['/tuyen-dung/ke-hoach-tuyen-dung/import-ke-hoach-tuyen-dung']);
  }

  export() {
    let params: any = { ... this.query };
    const queryParams = queryString.stringify(params);
    this.apiService.setRecruitPlanExport(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.type === 'application/json') {
          this.spinner.hide();
        } else {
          var blob = new Blob([results], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          FileSaver.saveAs(blob, `Danh sách kế hoạch tuyển dụng` + ".xlsx");
          this.spinner.hide();
        }
      })

  }


  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm ml-2 height-56 addNew', icon: 'pi pi-plus' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger ml-2 height-56 addNew', icon: 'pi pi-times' },
  ];

  getRecruitPlanFilter() {
    this.apiService.getRecruitPlanFilter()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.cloneListViewsFilter = cloneDeep(listViews);
          this.listViewsFilter = [...listViews];
          const params = getParamString(listViews)
          this.query = { ...this.query, ...params };
          this.load();
          this.detailInfoFilter = results.data;
        }
      });
  }

  filterLoad(event) {
    this.query = { ...this.query, ...event.data };
    this.load();
  }

  close({ event, datas }) {
    if (event !== 'Close') {
      const listViews = cloneDeep(this.cloneListViewsFilter);
      this.listViewsFilter = cloneDeep(listViews);
      const params = getParamString(listViews)
      this.query = { ...this.query, ...params };
      this.load();
    } else {
      this.listViewsFilter = cloneDeep(datas);
    }
  }

  searchProfile() {
    this.isSearchEmp = true;
  }
  
  seachEmValue(event) {
    const params = {
      custId: event.value,
      type: false
    }
    if(event.value) {
      this.router.navigate(['/tuyen-dung/ho-so-ca-nhan/chi-tiet-ho-so-ca-nhan'], { queryParams: params });
    }else{
      this.isSearchEmp = false;
    }
  }


}
