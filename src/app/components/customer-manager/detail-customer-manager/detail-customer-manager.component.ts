
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { getFieldOfItems, getFieldValueAggrid } from 'src/app/utils/common/function-common';
@Component({
  selector: 'app-detail-customer-manager',
  templateUrl: './detail-customer-manager.component.html',
  styleUrls: ['./detail-customer-manager.component.scss']
})
export class DetailCustomerManagerComponent implements OnInit, OnChanges, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [
    { label: 'Lưu', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetCompanyPage.url, ACTIONS.EDIT) ? 'hidden' : '' },
    { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }
  ];
  optionsButtonsViewEmChange = [
    { label: 'Lưu', value: 'Update',  },
    { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }
  ];
  first = 0;
  query = {
    filter: '',
    offSet: 0,
    pageSize: 20,
    reportTo: '',
  }
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  }
  cols: any[];

  isEditMgChange = false;
  
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) { }
  displayScreemForm = false;
  displaysearchUserMaster = false;
  listViewsForm = [];
  detailComAuthorizeInfo = null;
  id = null;
  empId = null;
  isDetail = false;
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage: string = '';
  url: string = '';

  // tab 2
  listViewsEmMgChange = [];
  detailInfoEmMgChange = null;

  columnDefs = [];
  columnDefsMgChange = [];
  listData = [];

  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges() {

  }
  items = []
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'nhân sự' },
      { label: 'Người quản lý', routerLink: '/nhan-su/nguoi-quan-ly' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.dataRouter = this.paramsObject.params;
        this.id = this.paramsObject.params.id;
        this.isDetail = this.paramsObject.params.isDetail
        this.empId = this.paramsObject.params.empId;
        this.getEmpManager();
      });
  };
  detailInfo = null;
  listsData = [];
  heightGrid = 600;
  heightGridPopup = 600;
  loadjs = 0;

  getEmpManager() {
    this.listViews = [];
    this.listsData = [];
    if (this.isDetail) {
      this.getManagerById();
    } else {
      this.getManagerByEmpId();
    }


  }

  getManagerById() {
    const queryParams = queryString.stringify({ id: this.id, empId: this.empId });
    this.apiService.getEmpManager(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listViews = cloneDeep(results.data.group_fields);
          this.detailInfo = results.data;
        }
      })
  }

  getManagerByEmpId() {
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpManagerCreate(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listViews = cloneDeep(results.data.group_fields);
          this.detailInfo = results.data;
        }
      })
  }

  setEmpManager(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmpManager(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message:  'Cập nhật thông tin thành công' });
          this.router.navigate(['/nhan-su/nguoi-quan-ly']);
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: results.message
          });
        }
      }, error => {
      });
  }

  onChangeButtonView(event) {
    this.manhinh = event.value;
    if (event.value === 'Back') {
      this.goBack();
    }
  }

  callBackForm(event) {

  }

  goBack() {
    if (this.titlePage) {
      this.router.navigate(['/nhan-su/nguoi-quan-ly']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(data) {
    if (data === 'CauHinh') {
      this.getEmpManager();
    } else {
      this.goBack();
    }
  }

  tabIndex = 0;
  handleChange(e){
    if(this.indexTab === 1) {
      this.getEmployeePageByManager(false);
    }
  }

  getEmpManagerChange(empId) {
    const queryParams = queryString.stringify({ empId: empId });
    this.apiService.getEmpManagerChange(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listViewsEmMgChange = cloneDeep(results.data.group_fields);
          this.detailInfoEmMgChange = results.data;
        }
      })
  }

  setEmpManagerChange(data) {

      let reportTo = getFieldOfItems(data, 'reportTo')
      if(this.empSeleted.length > 0) {
        let gd = this.empSeleted.map( d => {
          return {
            gd: d.empId
          }
        });
        const queryParam:any = {
          reportTo: reportTo,
          empIds: gd
        }
        this.apiService.setEmpManagerChange(queryParam)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message:  'Cập nhật thông tin thành công' });
            this.isEditMgChange = false
          } else {
            this.messageService.add({
              severity: 'error', summary: 'Thông báo', detail: results.message
            });
          }
        }, error => {
        });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn nhân viên' });
      }
    
  }

  // danh sách nhân viên theo người quản lý
  getEmployeePageByManager(isChangeMg) {
    this.query.reportTo = this.empId;
    this.columnDefs = [];
    this.listData = []
    this.apiService.getEmployeePageByManager(queryString.stringify(this.query))
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        if (this.query.offSet === 0) {
          this.cols = results.data.gridflexs;
        }
        this.listData = results.data.dataList.data;
        this.detailInfo = results.data;
        this.initGrid(isChangeMg);
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
      }
    });
  }

  initGrid(isChangeMg) {
    // if isChangeMg: true, is the columnDef for popup
    if(isChangeMg) {
      this.columnDefsMgChange = [
        {
          headerName: '',
          filter: '',
          width: 60,
          pinned: 'left',
          cellClass: ['border-right', 'no-auto'],
          field: 'checkbox2',
          headerCheckboxSelection: true,
          suppressSizeToFit: true,
          suppressRowClickSelection: true,
          showDisabledCheckboxes: true,
          checkboxSelection: true,
          // rowSelection: 'single'
        },
        ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      ]
    }else{
      this.columnDefs = [
        ...AgGridFn(this.cols.filter((d: any) => !d.isHide)),
      ]
    }
  }

  showButtons(event: any) {
    return {
      buttons: [
        {
          onClick: this.editRow.bind(this),
          label: 'Xem chi tiết',
          icon: 'fa fa-edit',
          class: 'btn-primary mr5',
        },
      ]
    }
  }

  editRow(event) {
    this.isEditMgChange = true;
    this.getEmpManagerChange(event.rowData.empId)
  }

  empSeleted = []
  rowSelected(event) {
    this.empSeleted = event;
  }

  changeManagerInfo() {
    this.heightGridPopup = 400;
    this.getEmployeePageByManager(true);
    this.isEditMgChange = true;
    this.getEmpManagerChange(this.empId)
  }

  closeChangeMa() {
    this.getEmployeePageByManager(false);
  }

  cancelUpdatChangeMg(event) {
    this.isEditMgChange = false;
  }

  paginate(event: any, theGrid) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.getEmployeePageByManager(theGrid);
  }

  ngAfterViewChecked(): void {
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const d: any = document.querySelector(".breadcrumb");
    const e: any = document.querySelector(".paginator");
    this.loadjs++
    if (this.loadjs === 5) {
      if (b && b.clientHeight) {
        const totalHeight = a.clientHeight + b.clientHeight + d.clientHeight + e.clientHeight + 110;
        this.heightGrid = window.innerHeight - totalHeight
        this.changeDetector.detectChanges();
      } else {
        this.loadjs = 0;
      }
    }
  }



}


