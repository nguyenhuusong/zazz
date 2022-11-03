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
    organizeId: null,
    request_status: '',
    reason_code: '',
    filter: '',
    year: '',
    month: '',
    offSet: 0,
    pageSize: 15,
    fromdate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
    todate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
    organizeIds: '',
  }
  totalRecord = 0;
  DriverId = 0;
  first = 0;
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  loadjs = 0;
  heightGrid = 0
  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    const d: any = document.querySelector(".bread-crumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs ++ 
    if (this.loadjs === 5) {
      if(b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 25;
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
      organizeId: null,
      request_status: '',
      reason_code: '',
      filter: '',
      year: '',
      month: '',
      offSet: 0,
      pageSize: 15,
      fromdate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).add(-1,'months').format()),
      todate: new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).format()),
      organizeIds: this.query.organizeIds
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
    queryParams.fromdate = typeof this.query.fromdate === 'object' ? moment(new Date(this.query.fromdate)).format('YYYY-MM-DD') : this.query.fromdate;
    queryParams.todate = typeof this.query.todate === 'object' ? moment(new Date(this.query.todate)).format('YYYY-MM-DD') : this.query.todate;
    // if (this.time) {
    //   queryParams.year = this.time.getFullYear();
    //   queryParams.month = this.time.getMonth() + 1;
    // }
    if (typeof queryParams.request_status !== 'string') {
      queryParams.request_status = queryParams.request_status.code;
    }
    if (typeof queryParams.reason_code !== 'string') {
      queryParams.reason_code = queryParams.reason_code.code;
    }
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
      },
      error => {
        this.spinner.hide();
       });
  }

  // set kỳ công
  defauDateFilter() {
    let currentDay = new Date().getDate();
    if(currentDay >= 25 && currentDay <= 31){
      this.query.month = this.query.month + 1;
      this.query.fromdate = new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 25)).format())
      this.query.todate = new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 24)).add( +1 ,'months').format())
    }
  }
  
  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.XemChiTiet.bind(this),
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

  XemChiTiet(event) {
    // const params = {
    //   id: event.rowData.id
    // }
    // this.router.navigate(['/chinh-sach/nghi-phep/chi-tiet-nghi-phep'], { queryParams: params });
    this.getLeaveInfo(event.rowData.id);

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
    this.defauDateFilter();
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results && results.length>0){
          this.query.organizeIds = results;
          this.query.organizeId = results;
          this.getLeaveReasons();
        }
    });
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Giải trình công' },
    ];
    this.getOrgRoots();
    this.getRequestStatus();
  }

  getLeaveReasons() {
    this.apiBaseService.getLeaveReasons()
    .subscribe(response => {
      if(response.status === 'success'){
        this.leaveReasons = response.data.map( d => {
          return {
            name: d.name,
            code: d.code
          }
        });
        this.leaveReasons = [{ name: 'Tất cả', code: ''}, ...this.leaveReasons]
        if (this.leaveReasons.length) {
          this.query.reason_code = this.leaveReasons[0];
          this.load();
        }
      }
    })
  }
  
  getRequestStatus() {
    this.apiBaseService.getObjectList('hrm_leave_status')
    .subscribe(response => {
      this.listStatus = response.data;
      // if (this.listStatus.length) {
      //   this.query.request_status = this.listStatus[0];
      //   this.load();
      // }
      if(response.status === 'success'){
        this.listStatus = response.data.map( d => {
          return {
            name: d.objName,
            code: d.objCode
          }
        });
        this.listStatus = [{ name: 'Tất cả', code: ''}, ...this.listStatus]
        this.query.request_status = this.listStatus[0];
        this.load();
      }
    })
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
    // const params = {
    //   id: ''
    // }
    // this.router.navigate(['/chinh-sach/nghi-phep/chi-tiet-nghi-phep'], { queryParams: params });
    this.getLeaveInfo();
  }

  listViews = []
  detailInfo = []
  getLeaveInfo(id = null) {
    this.listViews = []
    this.addEdit = true;
    this.leaveId = id;
    const queryParams = queryString.stringify({ id: id });
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





  quaylai(event){
    this.addEdit = false
  }
}


