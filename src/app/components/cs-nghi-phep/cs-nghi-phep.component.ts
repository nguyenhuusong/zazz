import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as queryString from 'querystring';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { CustomTooltipComponent } from 'src/app/common/ag-component/customtooltip.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from 'src/app/common/ag-component/avatarFull.component';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { flatMap, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormFilterComponent } from 'src/app/common/form-filter/form-filter.component';
import { getParamString } from 'src/app/common/function-common/objects.helper';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-cs-nghi-phep',
  templateUrl: './cs-nghi-phep.component.html',
  styleUrls: ['./cs-nghi-phep.component.scss']
})
export class CsNghiPhepComponent implements OnInit, AfterViewChecked {
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetLeavePage.url, ACTIONS.EDIT) ? 'hidden' : ''
    , icon: 'pi pi-check'  }
  ]
  private readonly unsubscribe$: Subject<void> = new Subject();
  dataNghiPhep: any;
  addEdit = false;
  leaveId = '';
  constructor(
    private spinner: NgxSpinnerService,
    private apiService: ApiHrmService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private organizeInfoService: OrganizeInfoService,
    private router: Router,
    public dialogService: DialogService,
    private apiBaseService: ApiService) {

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
    this.getFilter();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  listStatus = [];
  listOrgRoots = [];
  displayFrom = false;
  pagingComponent = {
    total: 0
  }
  leaveReasons = [];
  titleForm = {
    label: 'Thêm mới tài khoản',
    value: 'Add'
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
  // time = null;
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
  companies = []

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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

  cancel() {
    // this.time = null;
    this.query = {
      filter: '',
      offSet: 0,
      pageSize: 20,
    }
    this.load();
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
    const queryParams: any = {...this.query};
    const queryStrings = queryString.stringify(queryParams);
    this.apiService.getLeavePage(queryStrings).subscribe(
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
        this.FnEvent();
      },
      error => {
        this.spinner.hide();
       });
  }

  // set kỳ công
  defauDateFilter() {
    // let currentDay = new Date().getDate();
    // if(currentDay >= 25 && currentDay <= 31){
    //   this.query.month = this.query.month + 1;
    //   this.query.fromdate = new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).format())
    //   this.query.todate = new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).add( +1 ,'months').format())
    // }
  }
  
  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.editRow.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-eye',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetLeavePage.url, ACTIONS.VIEW)

        },
        {
          onClick: this.showHuyDuyet.bind(this),
          label: 'Hủy duyệt',
          icon: 'pi pi-times',
          class: 'btn-primary mr5',
          hide: CheckHideAction(MENUACTIONROLEAPI.GetLeavePage.url, ACTIONS.HUY_DUYET)
        },
        // {
        //   onClick: this.xoaTienLuong.bind(this),
        //   label: 'Xóa',
        //   icon: 'pi pi-trash',
        //   class: 'btn-primary mr5',
        // },
        // {
        //   onClick: this.CloseAccount.bind(this),
        //   label: 'Đóng tài khoản',
        //   icon: 'pi pi-trash',
        //   class: 'btn-primary mr5',
        // },
      ]
    };
  }

  reason_cancel = '';
  isReason = false;
  queryHuyDuyet = {
    gd: '',
    status: 0,
    comment: '',
  }
  showHuyDuyet(event) {
    this.isReason = true;
    this.queryHuyDuyet.gd = event.rowData.id;
    this.queryHuyDuyet.status = 0;
  }

  huyDuyet() {
    this.queryHuyDuyet.comment = this.reason_cancel;
    if(!this.queryHuyDuyet.comment){
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng nhập lý do' });
      return
    }
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn hủy duyệt?',
      accept: () => {
        this.apiService.cancelLeaveStatuses(this.queryHuyDuyet).subscribe(results => {
          if (results.status === 'success') {
            this.isReason = false;
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Hủy duyệt thành công' });
            this.load();
            this.FnEvent();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  

  initGrid() {
    this.columnDefs = [
      ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      {
        headerComponentParams: {
          template:
          `<button  class="btn-button" id="${this.gridKey}"> <span class="pi pi-plus action-grid-add" ></span></button>`,
        },
        filter: '',
        width: 100,
        pinned: 'right',
        cellRenderer: 'buttonAgGridComponent',
        cellClass: ['border-right', 'no-auto'],
        cellRendererParams: (params: any) => this.showButtons(params),
        checkboxSelection: false,
        field: 'checkbox'
      }]

      this.detailCellRendererParams = {
        detailGridOptions: {
          frameworkComponents: {},
          getRowHeight: (params) => {
            return 40;
          },
          columnDefs: [
            ...AgGridFn(this.colsDetail),
          ],

          enableCellTextSelection: true,
          onFirstDataRendered(params) {
            let allColumnIds: any = [];
            params.columnApi.getAllColumns()
              .forEach((column: any) => {
                if (column.colDef.cellClass.indexOf('auto') < 0) {
                  allColumnIds.push(column)
                } else {
                  column.colDef.suppressSizeToFit = true;
                  allColumnIds.push(column)
                }
              });
            params.api.sizeColumnsToFit(allColumnIds);
          },
        },
        getDetailRowData(params) {
          params.successCallback(params.data.Owns);
        },
        excelStyles: [
          {
            id: 'stringType',
            dataType: 'string'
          }
        ],
        template: function (params) {
          var personName = params.data.theme;
          return (
            '<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">' +
            `  <div style="height: 10%; padding: 2px; font-weight: bold;">###### Danh sách (${params.data.Owns.length}) : [` +
            personName + ']' +
            '</div>' +
            '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
            '</div>'
          );
        },
      };
  }

  xoaTienLuong(event) {
    // this.confirmationService.confirm({
    //   message: 'Bạn có chắc chắn muốn thực hiện mở tài khoản?',
    //   accept: () => {
    //     const queryParams = queryString.stringify({ companyId: event.rowData.companyId });
    //     this.apiService.delCompanyInfo(queryParams).subscribe(results => {
    //       if (results.status === 'success') {
    //         this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa công ty thành công' });
    //         this.load();
    //       } else {
    //         this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
    //       }
    //     });
    //   }
    // });
  }

  editRow({rowData}) {
    this.getLeaveInfo(rowData.id);
  }
  
  onCellClicked(event) {
    if(event.colDef.cellClass && event.colDef.cellClass.indexOf('colLink') > -1) {
      this.editRow(event = {rowData: event.data})
    }
  }

  find() {
    this.load();
    this.FnEvent();
  }

  changePageSize() {
    this.load();
    this.FnEvent();
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.load();
    this.FnEvent();
  }

  ngOnInit() {
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Giải trình công' },
    ];
    // this.getOrgRoots();
    // this.getRequestStatus();
  }

  getLeaveReasons() {
    // this.apiBaseService.getLeaveReasons()
    // .subscribe(response => {
    //   if(response.status === 'success'){
    //     this.leaveReasons = response.data.map( d => {
    //       return {
    //         name: d.name,
    //         code: d.code
    //       }
    //     });
    //     this.leaveReasons = [{ name: 'Tất cả', code: ''}, ...this.leaveReasons]
    //     if (this.leaveReasons.length) {
    //       this.query.reason_code = this.leaveReasons[0];
    //       this.load();
    //     }
    //   }
    // })
  }
  
  getRequestStatus() {
    // this.apiBaseService.getObjectList('hrm_leave_status')
    // .subscribe(response => {
    //   this.listStatus = response.data;
    //   // if (this.listStatus.length) {
    //   //   this.query.request_status = this.listStatus[0];
    //   //   this.load();
    //   // }
    //   if(response.status === 'success'){
    //     this.listStatus = response.data.map( d => {
    //       return {
    //         name: d.objName,
    //         code: d.objCode
    //       }
    //     });
    //     this.listStatus = [{ name: 'Tất cả', code: ''}, ...this.listStatus]
    //     this.query.request_status = this.listStatus[0];
    //     this.load();
    //   }
    // })
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
      }
    })
  }

  addNewNghiPhep() {
    this.isSearchEmp = true; 
  }

  listViews = [];
  detailInfo = [];
  empId = null;
  getLeaveInfo(id = null) {
    this.listViews = []
    this.addEdit = true;
    this.leaveId = id;
    const queryParams = queryString.stringify({ id: id, empId: this.empId});
    this.apiService.getLeaveInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }
  setLeaveInfo(data) {
    this.spinner.show();
      const params = {
        ...this.detailInfo, group_fields: data
      }
    this.checkLeaveOverLap(params)
  }

  checkLeaveOverLap(params) {
    this.apiService.checkLeaveOverLap(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        // this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });

        this.confirmationService.confirm({
          message: results.message,
          accept: () => {
            this.setLeaveInfoOver(params);
          }
        });
        this.spinner.hide();
      } else {
        // set immediately
        this.spinner.hide();
        this.setLeaveInfoWhenCheckNoOk(params)
      }
    }), error => {
      this.spinner.hide();
    };
  }

  // lưu khi check 'checkLeaveOverLap' status !== 'success'
  setLeaveInfoWhenCheckNoOk(params) {
    this.apiService.setLeaveInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.addEdit = false
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        this.spinner.hide();
      };
  }

  setLeaveInfoOver(params) {
    this.apiService.setLeaveHrmInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
        this.addEdit = false
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo',
          detail: results.message
        });
        this.spinner.hide();
      }
    }), error => {
      this.spinner.hide();
    };
  }

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
    //           this.query.companyIds = this.companies[0].value
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
    { label: 'Tìm kiếm', value: 'Search', class: 'p-button-sm height-56 addNew', icon: 'pi pi-search' },
    { label: 'Làm mới', value: 'Reset', class: 'p-button-sm p-button-danger height-56 addNew', icon: 'pi pi-times' },
  ];
  //filter 
  getFilter() {
    this.apiService.getFilter('/api/v2/leave/GetLeaveFilter').subscribe(results => {
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
    this.FnEvent();
  }

  close(event) {
    if(event !== 'Close') {
    const listViews = cloneDeep(this.cloneListViewsFilter);
    this.listViewsFilter = cloneDeep(listViews);
    const params =  getParamString(listViews)
    this.query = { ...this.query, ...params};
    this.load();
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
          this.query = { ...this.query, ...event.data };
          this.load();
        } else if (event.type === 'CauHinh') {
          this.apiService.getFilter('/api/v2/leave/GetLeaveFilter').subscribe(results => {
            if (results.status === 'success') {
              const listViews = cloneDeep(results.data.group_fields);
              this.listViewsFilter = [...listViews];
              const params =  getParamString(listViews)
              this.query = { ...this.query, ...params};
              this.load();
              this.detailInfoFilter = results.data;
              this.showFilter()
            }
          });

        } else if (event.type === 'Reset') {
          const listViews = cloneDeep(this.cloneListViewsFilter);
          this.listViewsFilter = cloneDeep(listViews);
         const params =  getParamString(listViews)
        this.query = { ...this.query, ...params};
        this.load();
        }
      }
    });
  }

  quaylai(event){
    this.addEdit = false;
    this.FnEvent();
  }

  ngAfterViewInit(): void {
    this.FnEvent();
  }

  FnEvent() {
    setTimeout(() => {
      var dragTarget = document.getElementById(this.gridKey);
      if(dragTarget) {
        console.log('dragTarget', dragTarget)
        const click$ = fromEvent(dragTarget, 'click');
        click$.subscribe(event => {
          this.addNew()
        });
      }
    }, 3000);
  }

  isSearchEmp: boolean = false
  addNew() {
    this.isSearchEmp = true;
  }

  seachEmValue(event) {
    if(event.value) {
        this.empId = event.value
       this.getLeaveInfo(null);

    }else{
      this.isSearchEmp = false;
    }
  }
}


