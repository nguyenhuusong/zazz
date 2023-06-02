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
import { cloneDeep } from 'lodash';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { ApiService } from 'src/app/services/api.service';
import { DialogService } from 'primeng/dynamicdialog';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { map, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-dang-ky-lich-lam-viec',
  templateUrl: './dang-ky-lich-lam-viec.component.html',
  styleUrls: ['./dang-ky-lich-lam-viec.component.scss']
})
export class DangKyLichLamViecComponent implements OnInit {
  dataChamCong: any;
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetEmpWorkingPage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check' }
  ]
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private apiServiceCore: ApiService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
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
    pageSize: 20,
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

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

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

  modelChangeStatus: any = {
    empIds: [
      {
        gd: null
      }
    ],
    organizeId: null,
    full_name: null,
    work_cd: null,
    start_dt: moment(new Date()).format('DD/MM/YYYY'),
    timekeeping_special_is: true,
    timekeeping_special_code: ""

  }
  displayChangeStatus = false;
  organizes = [];
  departmentFiltes = [];
  typeFeedBacks = [];
  listUsers = [];
  isTheOrganToMove = false;
  listDataSelect = [];
  columnDefsMoveOrgan = [];
  listWorkCds = [];
  listAppSt = [];
  listIsFlexible = [];
  listsData = [];

  displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  load() {
    this.columnDefs = []
    // this.spinner.show();
    let params: any = { ... this.query };
    const queryParams = queryString.stringify(params);
    this.apiService.getEmpWorkingPage(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (results: any) => {
          this.listsData = results.data.dataList.data;
          this.gridKey = results.data.dataList.gridKey;
          if (this.query.offSet === 0) {
            this.cols = results.data.gridflexs;
            this.colsDetail = results.data.gridflexdetails ? results.data.gridflexdetails : [];
          }
          // if(!this.query.organizeId && results.data && results.data.dataList.data.length > 0) {
          //   this.query.organizeId = results.data.dataList.data[0].organizeId;
          //   this.getOrganizeTree();
          //   this.getWorkTime();
          // }
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
          onClick: this.editRow.bind(this),
          label: 'Xem',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetEmpWorkingPage.url, ACTIONS.VIEW)
        },
        {
          onClick: this.doiLichLamViec.bind(this),
          label: 'Đổi lịch làm việc',
          icon: 'pi pi-trash',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetEmpWorkingPage.url, ACTIONS.DOI_LICH_LAM_VIEC)
        }
      ]
    };
  }
  modelEdit = {
    empId: null,
    gd: null
  }
  displayFormEditDetail = false
  editRow({ rowData }) {
    this.modelEdit.empId = rowData.empId;
    this.modelEdit.gd = rowData.gd;
    this.displayFormEditDetail = true;
  }

  onCellClicked(event) {
    if (event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = { rowData: event.data })
    }
  }

  doiLichLamViec(event) {
    this.modelChangeStatus = {
      empIds: [
        {
          gd: null
        }
      ],
      organizeId: null,
      full_name: event.rowData.fullName,
      work_cd: event.rowData.work_cd,
      start_dt: moment(new Date()).format('DD/MM/YYYY'),
      timekeeping_special_is: true,
      timekeeping_special_code: ""
    }
    this.listUsers = [{ empId: event.rowData.empId }]
    this.displayChangeStatus = true;
  }

  timekeepingSpecials = [];
  getTimekeepingSpecials() {
    this.apiServiceCore.getObjectList('object_refer_st')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response.status === 'success') {
          this.timekeepingSpecials = response.data.map(d => {
            return {
              name: d.objName,
              code: d.objCode
            }
          });
        }
      })
  }

  timekeepingSpecialCode = [];
  getTimekeepingSpecialCode() {
    this.apiServiceCore.getObjectList('timekeeping_special')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response.status === 'success') {
          this.timekeepingSpecialCode = response.data.map(d => {
            return {
              name: d.objName,
              code: d.objCode
            }
          });
        }
      })
  }

  getModuleList() {
    // const queryParams = queryString.stringify({ filter: '' });
    // this.apiService.getOrganizations(queryParams).subscribe(results => {
    //   if (results.status === 'success') {
    //     const moduleLists = results.data.map(d => {
    //       return {
    //         label: `${d.organizationName}`,
    //         value: d.organizeId,
    //         ...d
    //       }
    //     });
    //     this.organizes = moduleLists
    //   }
    // })
  }

  handleChangeOrganize(): void {
    // this.query.orgId = '';
    // this.getOrganizeTree();
    // this.getWorkTime();
    // this.find();
  }

  getOrganizeTree(): void {
    // const queryParams = queryString.stringify({ parentId: this.query.organizeIds });
    // this.apiService.getOrganizeTree(queryParams)
    //   .subscribe((results: any) => {
    //     if (results && results.status === 'success') {
    //       this.departmentFiltes = results.data;
    //     }
    //   },
    //     error => { });
  }

  onChangeTree(a): void {
    this.find();
  }

  getWorkTime() {
    this.apiService.getWorktimeList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listWorkCds = results.data.map(d => {
            return { label: d.name, value: d.value }
          });
        }
      })
  }

  saveForm() {
    if (!this.modelChangeStatus.work_cd) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chọn lịch làm việc' });
      return;
    }
    if (this.listUsers.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa có bản ghi nào được cài đặt' });
      return;
    }
    let params = { ...this.modelChangeStatus };
    params.timekeeping_special_code = this.modelChangeStatus.timekeeping_special_code.code
    params.timekeeping_special_is = this.modelChangeStatus.timekeeping_special_is.code ? true : false;
    delete params.organizeId;
    delete params.full_name;
    params.start_dt = typeof params.start_dt === 'object' ? moment(new Date(params.start_dt)).format('DD/MM/YYYY') : params.start_dt;
    params.empIds = this.listUsers.map(d => {
      return {
        gd: d.empId
      }
    });
    this.apiService.setEmpWorkingChanges(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Đổi lịch công việc thành công' });
          this.load();
          this.displayChangeStatus = false;
          this.isTheOrganToMove = false;
        } else if (results.status === 'error') {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message ? results.message : 'Đổi lịch công việc thất bại' });
        }

      })
  }

  getCustObjectListNew(params) {
    const queryParams = queryString.stringify({ objKey: params });
    this.apiService.getCustObjectListNew(true, queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (params === 'empworking_app_st') {
          this.listAppSt = results.data.map(d => {
            return {
              label: d.objName,
              value: d.objValue
            }
          });
        } else {
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
        maxWidth: 140,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        suppressSizeToFit: true,
        field: 'checkbox'
      }
    ]
  }

  // XemChiTiet(event) {
  //   const params = {
  //     reason_code: event.rowData.reason_code,
  //   }
  //   this.router.navigate(['/cai-dat/ly-do-nghi/chi-tiet-ly-do-nghi'], { queryParams: params });
  // }

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
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Quan hệ lao động' },
      { label: 'Danh sách đăng ký lịch làm việc' },
    ];
    const state = this.activatedRoute.queryParams
    .subscribe((params: any) => {
      const apiParam = params;
      if(apiParam) {
        this.query = {...this.query, ...apiParam};
        this.load();
        this.getEmpWorkingFilter(false);
      }else {
        this.getEmpWorkingFilter(true);
      }
    })
    this.getWorkTime();
  }

  getFeedbackType() {
    this.apiService.getFeedbackType()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.typeFeedBacks = results.data.map(d => {
            return {
              label: d.feedbackTypeName,
              value: d.feedbackTypeId
            }
          });
          this.typeFeedBacks = [{ label: 'Tất cả', value: null }, ...this.typeFeedBacks]
        }
      })
  }

  changeStatus(event) {
    let params = { ...this.modelChangeStatus };
    params.empIds = event.appUsers.map(d => {
      return {
        gd: d.userId
      }
    });
    this.apiService.setEmpWorkingChanges(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Đổi lịch công việc thành công' });
          this.load();
          this.displayChangeStatus = true;
        }
      })

  }

  getColumnDefsMoveOrgan() {
    this.columnDefsMoveOrgan = [
      {
        headerName: 'Stt',
        filter: '',
        maxWidth: 90,
        pinned: 'left',
        cellRenderer: params => {
          return params.rowIndex + 1
        },
        cellClass: ['border-right', 'no-auto'],
      },
      {
        headerName: 'Mã NV',
        filter: '',
        cellClass: ['border-right'],
        field: 'code',
        width: 100
      },
      {
        headerName: 'Họ tên',
        filter: '',
        cellClass: ['border-right'],
        field: 'fullName',
      },
      {
        headerName: 'Số ĐT',
        filter: '',
        cellClass: ['border-right'],
        field: 'phone',
      },
      {
        headerName: 'Tổ chức',
        filter: '',
        cellClass: ['border-right'],
        field: 'org_name',
      },
      {
        headerName: 'Thao tác',
        filter: '',
        maxWidth: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons2(params),
        field: 'button'
      }
    ]
  }

  showButtons2(params) {
    return {
      buttons: [
        {
          onClick: this.delStaffinDataOraMove.bind(this),
          label: 'Xóa',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
        },
      ]
    };
  }
  delStaffinDataOraMove(data) {
    this.listUsers = this.listUsers.filter(a => a.rowid != data.rowData.rowid);
  }


  taolichlamviec() {
    this.getColumnDefsMoveOrgan();
    this.modelChangeStatus = {
      empIds: [
        {
          gd: null
        }
      ],
      organizeId: null,
      work_cd: null,
      full_name: null,
      start_dt: moment(new Date()).format('DD/MM/YYYY'),
      timekeeping_special_is: true,
      timekeeping_special_code: ""
    }
    if (this.listDataSelect.length > 0) {
      this.listUsers = cloneDeep(this.listDataSelect);
      this.isTheOrganToMove = true;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng nhân sự' });
    }
    this.getTimekeepingSpecials();
    this.getTimekeepingSpecialCode();
  }

  rowSelected(data) {
    this.listDataSelect = data
  }

  companies = []

  getCompany() {
    // const query = { organizeIds: this.query.organizeIds}
    // this.apiService.getUserCompanies(queryString.stringify(query)).subscribe(
    //   (results: any) => {
    //     if(results.status === "success"){
    //       this.companies = results.data
    //         .map(d => {
    //           return {
    //             label: d.name,
    //             value: d.value
    //           };
    //         });
    //         if(this.companies.length > 0) {
    //           this.query.companyIds = this.companies[0].value;
    //         }
    //         this.load();
    //     }
    //   }),
    //   error => { };
  }

  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm ml-2  addNew', icon: 'pi pi-plus' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger ml-2  addNew', icon: 'pi pi-times' },
  ];

  getEmpWorkingFilter(reload: boolean = false) {
    this.apiService.getEmpWorkingFilter()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.cloneListViewsFilter = cloneDeep(listViews);
          this.listViewsFilter = [...listViews];
          const params = getParamString(listViews)
          this.query = { ...this.query, ...params };
          if(reload) this.load();
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

  saveWoking() {
    this.displayFormEditDetail = false;
    this.load();
  }

}




