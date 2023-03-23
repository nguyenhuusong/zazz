import { NotificationService } from 'src/app/services/notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ExportFileService } from 'src/app/services/export-file.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import * as queryString from 'querystring';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { EmployeeCardList } from 'src/app/models/cardinfo.model';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { cloneDeep } from 'lodash';
import { DialogService } from 'primeng/dynamicdialog';
import { FormFilterComponent } from 'src/app/common/form-filter/form-filter.component';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pq-the-nhan-vien',
  templateUrl: './pq-the-nhan-vien.component.html',
  styleUrls: ['./pq-the-nhan-vien.component.scss']
})
export class PqTheNhanVienComponent implements OnInit {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  loading = false;
  columnDefs;
  detailRowHeight;
  defaultColDef;
  detailEmployee;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  objectAction: any;
  gridflexs: any;
  getRowHeight;
  cards: EmployeeCardList[] = [];
  organizes = [];
  departmentFiltes = [];
  listStatus = [
    { label: 'Tất cả', value: -1 },
    { label: 'Mới tạo', value: 0 },
    { label: 'Hoạt động', value: 1 },
    { label: 'Khóa thẻ', value: 3 },
  ];
  first = 0;
  model = {
      filter: '',
      offSet: 0,
      pageSize: 20,
  };
  totalRecord = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  gridColumnApi;
  pagingComponent = {
    total: 0
  };
  itemsToolOfGrid: any[] = [];
  listViewsFilter = [];
  cloneListViewsFilter = [];
  detailInfoFilter = null;
  optionsButonFilter = [
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];
  isSearchEmp = false;
  constructor(
    private apiService: ApiHrmService,
    private fileService: ExportFileService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    
    private router: Router,
    private notificationService: NotificationService,
    public dialogService: DialogService,
  ) {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: '',
      cellClass: ['border-right'],
    };
    this.getRowHeight = (params) => {
      return 38;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
    };
    this.initFilter();
  }

  
    private readonly unsubscribe$: Subject<void> = new Subject();
    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

  items = []
  ngOnInit(): void {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Phân quyền' },
      { label: 'Danh sách thẻ nhân viên' },
    ];
    this.itemsToolOfGrid = [
      {
        label: 'Import file',
        code: 'Import',
        icon: 'pi pi-upload',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetEmployeeCardPage.url, ACTIONS.IMPORT),
        command: () => {
          this.importFileExel();
        }
      },
      {
        label: 'Export file',
        code: 'Import',
        icon: 'pi pi-download',
        disabled: CheckHideAction(MENUACTIONROLEAPI.GetEmployeeCardPage.url, ACTIONS.EXPORT),
        command: () => {
          this.exportexcel();
        }
      },
    ]
    this.getFilter();
  }

  initFilter(): void {
    this.model = {
      filter: '',
      offSet: 0,
      pageSize: 20,
    };
  }

  handleChangeOrganize(): void {
    // this.model.orgId = '';
    // this.getOrganizeTree();
    // // this.find();
  }

  exportexcel(): void {
    this.spinner.show();
    const query = { ...this.model };
    query.offSet = 0;
    query.pageSize = 1000000;
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeeCardPage(queryParams)
      .subscribe((results: any) => {
        const dataExport = [];
        results.data.dataList.data.forEach(element => {
          const data: any = {};
          data['Mã thẻ'] = element.cardCd || '';
          data['Tên nhân viên'] = element.fullName || '';
          data['Tổ chức'] = element.orgName || '';
          data['Phòng'] = element.departmentName || '';
          data['Số điện thoại'] = element.phone || '';
          data['Ngày tạo thẻ'] = element.issueDate || '';
          data['Tài khoản tạo thẻ'] = element.created_by || '';
          data['Trạng thái'] = element.status === 3 ? 'Khóa' : (element.status === 1 ? 'Hoạt động' : '');
          data['Số lượng xe'] = element.countVehicle || '0';
          dataExport.push(data);
        });
        this.fileService.exportAsExcelFile(dataExport, 'Danh sách thẻ nhân viên - ' + new Date());
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.error(error);
      });
  }

  importFileExel() {
    this.router.navigate(['/phan-quyen/the-nhan-vien/import']);
  }


	displaySetting = false;
  gridKey = ''
  cauhinh() {
    this.displaySetting = true;
  }

  listsData = [];
  load() {
    this.columnDefs = []
    // this.spinner.show();
    const query: any = { ...this.model };
    const queryParams = queryString.stringify(query);
    this.apiService.getEmployeeCardPage(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (results: any) => {
        this.listsData = results.data.dataList.data;
        this.gridKey= results.data.dataList.gridKey;
        if (this.model.offSet === 0) {
          this.gridflexs = results.data.gridflexs;
        }
        this.initGrid();
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
        this.countRecord.currentRecordStart = results.data.dataList.recordsTotal === 0 ? this.model.offSet = 0 :  this.model.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.model.offSet) > this.model.pageSize) {
          this.countRecord.currentRecordEnd = this.model.offSet + Number(this.model.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
          setTimeout(() => {
            const noData = document.querySelector('.ag-overlay-no-rows-center');
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp'}
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
          onClick: this.lockCard.bind(this),
          label: 'Khóa',
          icon: 'fa fa-lock',
          class: 'btn-primary mr5',
          hide: this.CheckHidelockCard(event)
        },
        {
          onClick: this.unlockCard.bind(this),
          label: 'Mở khóa',
          icon: 'fa fa-unlock',
          class: 'btn-primary mr5',
          hide: this.CheckHideunlockCard(event)
        },
        {
          onClick: this.deleteCard.bind(this),
          label: 'Xóa thẻ',
          icon: 'fa fa-trash',
          class: 'btn-primary mr5',
          hide: this.CheckHidedeleteCard(event)
        }
      ]
    };
  }

  CheckHidelockCard(event) {
    let checkValue = CheckHideAction(MENUACTIONROLEAPI.GetEmployeeCardPage.url, ACTIONS.LOCK_CARD);
    if(checkValue) {
      return true;
    }else {
      if(event.data.status === 3) {
        return true;
      }else {
        return false;
      }
    }
  }
  CheckHideunlockCard(event) {
    let checkValue = CheckHideAction(MENUACTIONROLEAPI.GetEmployeeCardPage.url, ACTIONS.UNLOCK_CARD);
    if(checkValue) {
      return true;
    }else {
      if(event.data.status !== 3) {
        return true;
      }else {
        return false;
      }
    }
  }
  CheckHidedeleteCard(event) {
    let checkValue = CheckHideAction(MENUACTIONROLEAPI.GetEmployeeCardPage.url, ACTIONS.DELETE);
    if(checkValue) {
      return true;
    }else {
      if(event.data.status !== 3) {
        return true;
      }else {
        return false;
      }
    }
  }
  

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.gridflexs.filter((d: any) => !d.isHide)),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        filter: '',
        width: 70,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]
  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  paginate(event): void {
    this.model.offSet = event.first;
    this.first = event.first;
    this.model.pageSize = event.rows;
    this.load();
  }


  getOrganize(): void {
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getOrganizations(queryParams)
      .subscribe(
        (results: any) => {
          this.organizes = results.data
            .map(d => {
              return {
                label: d.organizationName || d.organizationCd,
                value: d.organizeId
              };
            });
          this.organizes = [{ label: 'Chọn tổ chức', value: '' }, ...this.organizes];
        }),
        error => { };
  }

  getOrganizeTree(): void {
    // const queryParams = queryString.stringify({ parentId: this.model.organizeId});
    // this.apiService.getOrganizeTree(queryParams)
    //   .subscribe((results: any) => {
    //     if (results && results.status === 'success') {
    //       this.departmentFiltes = results.data;
    //     }
    //   },
    //     error => { });
  }

  dataPositionList = []
  getPositionList() {
    const queryParams = queryString.stringify({ objKey: 'positiontype_group' });
    this.apiService.getCustObjectListNew(false, queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.dataPositionList = results.data.map(d => {
          return {
            label: d.objName,
            value: d.objCode
          }
        });
      }
    })
  }

  workplaceOptions = []
  getWorkplaces() {
    this.apiService.getWorkplaces()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.workplaceOptions = results.data.map(d => {
          return {
            label: d.workplaceName,
            value: d.workplaceId
          }
        });
      }
    })
  }

  lockCard(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Khóa thẻ này?',
      accept: () => {
     this.spinner.show();
        this.apiService.lockCardNV(event.rowData.cardCd)
          .subscribe(results => {
            this.load();
            this.FnEvent();
            this.spinner.hide();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Khóa thẻ thành công' });
          }, error => this.handlerError(error));
      }
    });

  }

  handlerError(error): void {
    console.log(error);
    this.spinner.hide();
    if (error.status === 401) {
      this.router.navigate(['/home']);
    }
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
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight +10;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      }else {
        this.loadjs = 0;
      }
    }
  }

  unlockCard(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện Mở khóa thẻ này?',
      accept: () => {
        this.spinner.show();
        this.apiService.unlockCardNV(event.rowData.cardCd)
          .subscribe(results => {
            this.load();
            this.FnEvent();
            this.spinner.hide();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Mở khóa thẻ thành công' });
          }, error => this.handlerError(error));
      }
    });
  }

  deleteCard(event): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện xóa thẻ xe này?',
      accept: () => {
       this.spinner.show();
       const queryParams = queryString.stringify({ cardCd: event.rowData.cardCd});
        this.apiService.deleteCard(queryParams)
          .subscribe(results => {
            this.load();
            this.FnEvent();
            this.spinner.hide();
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xóa thẻ xe thành công' });
          }, error => this.handlerError(error));
      }
    });
  }

  find(): void {
    this.load();
  }

  cancel(): void {
    this.initFilter();
    this.load();
  }

  changePageSize(): void {
    this.load();
  }
  displaythenv = false;
  handleAdd(): void {
    // this.displaythenv = true;
    this.isSearchEmp = true;
    // const params = {
    //   canId: null
    // }
    // this.router.navigate(['/phan-quyen/the-nhan-vien/them-moi-the-nhan-vien'], { queryParams: params });
  }

  seachEmValue(event) {
    this.spinner.show();
    const params = {
      canId: null,
      empId: event.value
    }
    if(event.data) {
      let queryParams = {
        custId: event.data.CustId,
        avatar_url: event.data.avatar_url,
        birthday: event.data.birthday,
        email1: event.data.email1,
        full_name: event.data.full_name,
        phone1: event.data.phone1,
        sex: event.data.sex,
        userId: event.data.userId,
        cif_no: event.data.cif_no,
        idcard_no: event.data.idcard_no,
        idcard_issue_dt: event.data.idcard_issue_dt,
        idcard_issue_plc: event.data.idcard_issue_plc,
        res_add: event.data.res_add,
        res_cntry: event.data.res_cntry
      }
      this.apiService.setCustomerResident(queryParams).pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.spinner.hide();
          this.router.navigate(['/phan-quyen/the-nhan-vien/them-moi-the-nhan-vien'], { queryParams: params });
        }else{

        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'error' });
        this.spinner.hide();
      })
    }
    // if(event.value) {
    // }else{
    //   this.isSearchEmp = false;
    // }
  }

  onChangeTree(a): void {
    // this.find();
  }

  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v2/cardvehicle/GetEmpCardFilter')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if(results.status === 'success') {
        const listViews = cloneDeep(results.data.group_fields);
        this.cloneListViewsFilter = cloneDeep(listViews);
        this.listViewsFilter = [...listViews];
        const params =  getParamString(listViews)
        this.model = { ...this.model, ...params};
        this.load();
        this.detailInfoFilter = results.data;
      }
    });
  }

   filterLoad(event) {
    this.model = { ...this.model, ...event.data };
    this.load();
  }

  close({event, datas}) {
    if(event !== 'Close') {
      const listViews = cloneDeep(this.cloneListViewsFilter);
      this.listViewsFilter = cloneDeep(listViews);
      const params =  getParamString(listViews)
      this.model = { ...this.model, ...params};
      this.load();
    }else {
      this.listViewsFilter =  cloneDeep(datas);
    }
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
          this.model = { ...this.model, ...event.data };
          this.load();
        } else if (event.type === 'CauHinh') {
          this.apiService.getFilter('/api/v2/cardvehicle/GetEmpCardFilter')
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(results => {
            if (results.status === 'success') {
              const listViews = cloneDeep(results.data.group_fields);
              this.listViewsFilter = [...listViews];
              const params =  getParamString(listViews)
              this.model = { ...this.model, ...params};
              this.load();
              this.detailInfoFilter = results.data;
              this.showFilter()
            }
          });

        } else if (event.type === 'Reset') {
          const listViews = cloneDeep(this.cloneListViewsFilter);
          this.listViewsFilter = cloneDeep(listViews);
         const params =  getParamString(listViews)
        this.model = { ...this.model, ...params};
        this.load();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.handleAdd()
        });
      }
    }, 3000);
  }
}

