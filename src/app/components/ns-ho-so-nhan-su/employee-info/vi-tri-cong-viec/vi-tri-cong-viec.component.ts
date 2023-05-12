import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import {  getFieldOfItems, getFieldValueAggrid } from 'src/app/utils/common/function-common';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-vi-tri-cong-viec',
  templateUrl: './vi-tri-cong-viec.component.html',
  styleUrls: ['./vi-tri-cong-viec.component.scss']
})
export class ViTriCongViecComponent implements OnInit, AfterViewInit {
  detailInfo = null;
  @Input() empId = null;
  @Input() dataEmployeeStatus = null;
  @Output() reloadEdit = new EventEmitter<any>();
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]

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

  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  ngAfterViewInit(): void {

  }

  onBack() {
    this.router.navigate(['/nhan-su/ho-so-nhan-su']);
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.getTerminateReasons();
    this.getEmployeeInfo();
    this.getEmployeeStatus();
    this.initMenuPopup();
  }

  itemsMenuPopup = []
  initMenuPopup() {
    this.itemsMenuPopup = [
      {
        label: 'Nghỉ việc',
        icon: 'pi pi-directions',
        command: () => {
          this.fnNghiViec();
        }
      },
      {
        label: 'Đổi người quản lý',
        icon: 'pi pi-arrow-left',
        command: () => {
          this.changeMg();
        },
        visible: false
      },
   
    ]
  }
  columnDefs1 = [];
  listsData1 = [];
  gridKey1 = '';
  columnDefs = [];
  listsData = [];
  gridKey = '';

  onClick() {
    console.log("sdsd")
  }

  getTerminateReasons() {
    this.apiService.getTerminateReasons()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.terminateReasons = results.data;
      }
    })
  }

  optionsButtonsView = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-save' },
    // { label: 'Xuất hồ sơ', value: 'xuatHoSo', class: '', icon: 'pi file-excel' },
  ]

  cancelSave() {
    this.getEmployeeInfo();
  }
 
  codeStaff = ''
  listViews = [];
  listViewsForm = [];
  status = [];
  selectedStatus = null;
  getEmployeeInfo(): void {
    this.spinner.show();
    this.listViews = [];
    this.listViewsForm = [];
    this.detailInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpWorkJob(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        // if (!this.codeStaff) { không hiểu thêm vào để làm gì (manh)
        //   this.codeStaff = getFieldValueAggrid(results.data, 'code');
        // }

        this.status = results.data.flowStatuses;
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.listViewsForm = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.initButton();

        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
    // this.gridApi.sizeColumnsToFit();
  }

  recruiUpdateStatus() {

  }
  
  callActions(code) {
      this[code]()
  }

  optionsButon = [];
  menuActions = [];
  initButton() {
    this.menuActions = this.detailInfo.actions.map((item, index) => {
      return {
        label: item.name,
        value: item.code,
        styleClass: index === 0 ? 'hidden' : '',
        icon: item.icon,
        command: () => {
          this[item.code]();
        }
      }
    });
  }
 
  displayuploadcontract = false;
  record = null;
  uploadContract(event) {
    this.displayuploadcontract = true;
    this.record = event.rowData;
  }

  setEmployeeInfo(data) {
    const  params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmployeeInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
      
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Cập nhật thông tin thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  cancelUpdate(button) {
     if (button === 'CauHinh') {
      this.getEmployeeInfo();
    } else {

    }
  }
  titleForm = {
    type: '',
    title: ''
  };
  keyParamGetInfo ='';
  displayDialog= false;
  noDisableInput= true;
  detailInfoForm = null
  getEmployeeChangeInfo() {
    this.listViewsForm = []
    const queryParams = queryString.stringify({ empId: this.empId });

    // change old api this.apiService.getEmployeeData(this.keyParamGetInfo, queryParams).subscribe(results => {
    this.apiService.getEmployeeChangeInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViewsForm = cloneDeep(results.data.group_fields || []);
        this.detailInfoForm = results.data;
        this.detailInfoForm.empId = this.detailInfo.empId;
      }
    }, error => {
      this.spinner.hide();
    });
  }
  displayFormTerminate = false;
  fnNghiViec() {
    this.modelDuyet.empId = this.dataEmployeeStatus.empId;
    this.modelDuyet.full_name = this.dataEmployeeStatus.fullName;
    this.titleForm.title = 'Xác nhận nhân viên nghỉ việc';
    this.titleForm.type = 'NghiViec';
    this.displayFormTerminate = true;
    this.noDisableInput = false;
    if(this.checkIsChangeMg) {
      this.messageService.add(
        { severity: 'warn', 
          summary: 'Thông báo', 
          detail: 'Vui lòng đổi người quản lý' 
        });
    }
  }

  cancelViewMgInfo(event) {
    this.isShowInfoMg = false
  }

  cols: any[];
  // danh sách nhân viên theo người quản lý
  getEmployeePageByManager() {
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
            if (noData) { noData.innerHTML = 'Không có kết quả phù hợp' }
          }, 100);
        }
      }
    });
  }

  initGrid() {
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
  }

  paginate(event: any) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows === 4 ? 100000000 : event.rows;
    this.getEmployeePageByManager();
  }

  empSeleted = []
  listData = [];
  heightGridPopup = 400;
  rowSelected(event) {
    this.empSeleted = event;
  }

  closeChangeMa() {
    this.isShowInfoMg = false;
  }

  setEmpManagerChange(data) {

    let reportTo = getFieldOfItems(data, 'reportTo')
    let gd = []
      if(this.empSeleted.length > 0) {
        gd = this.empSeleted.map( d => {
          return {
            gd: d.empId
          }
        });
      }
      const queryParam:any = {
        reportTo: reportTo,
        empIds: gd
      }
      this.apiService.setEmpManagerChange(queryParam)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message:  'Cập nhật thông tin thành công' });
          this.isShowInfoMg = false;
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: results.message
          });
        }
      }, error => {
      });
    // else{
    //   this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn nhân viên' });
    // }
  }

  
  isShowInfoMg = false;
  listViewsFormMgInfo = [];
  detailMgInfo = null;
  btnMgInfoDetail = [
    { label: 'Đóng', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', icon: 'pi pi-check' }
  ]

  changeMg() {
    this.isShowInfoMg = true;
    // this.router.navigate(['/nhan-su/nguoi-quan-ly/']);
    this.spinner.show();
    this.listViewsFormMgInfo = [];
    this.detailMgInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpManagerChange(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViewsFormMgInfo = cloneDeep(results.data.group_fields || []);
        this.detailMgInfo = results.data;
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });

    this.getEmployeePageByManager();
  }

  columnDefsMgChange = [];

  modelDuyet = {
    empId: "",
    workDt: new Date(),
    exprire_date: new Date(),
    comments: "",
    full_name: "",
    reason_id: 0
  }

  xacNhan(event) {
    let parmas: any = { ...this.modelDuyet };
    parmas.workDt = moment(new Date(parmas.workDt)).format('DD/MM/YYYY');
    delete parmas.reason_id;
    delete parmas.exprire_date;
    parmas.group_fields = cloneDeep(event);
    this.setEmployeeChange(parmas);

  }

  setEmployeeChange(parmas) {
    // change old api this.apiService.setEmployeeChange(parmas).subscribe((results: any) => {
    this.apiService.insurSetEmployeeChange(parmas)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayDialog = false;
        // this.manhinh = 'Edit';
        this.getEmployeeInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận duyệt thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  isSubmitSave = false;
  onChangeButtonSave(event) {
    if (event === 'Save') {
      let parmas: any = { ...this.modelDuyet };
      delete parmas.full_name;
      parmas.workDt = moment(new Date(parmas.workDt)).format('DD/MM/YYYY');
      parmas.exprire_date = moment(new Date(parmas.exprire_date)).format('DD/MM/YYYY');
      this.isSubmitSave = true;
      if (!this.modelDuyet.exprire_date) {
        return
      }
      this.setEmployeeTermilate(parmas);
    } else {
      this.displayDialog = false;
    }
  }

  terminateReasons = [];
  setEmployeeTermilate(parmas) {
    this.apiService.setEmployeeTermilate(parmas)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayDialog = false;
        this.getEmployeeInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận nghỉ việc thành công' });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  cancelViewsForm(data) {
    if (data === 'CauHinh') {
      this.getEmployeeInfo();
    } else {
      this.displayDialog = false;
    }
  }


  dataDetailInfo = [];
 
  isEditDetail = false;
  cancelSetDetail(event) {
    this.isEditDetail = false;
    this.displayFormTerminate = false;
    this.getEmployeeInfo();
    // this.reloadEdit.emit();
  }

  actView() {
    this.isEditDetail = true;
  }

  checkIsChangeMg = false;
  getEmployeeStatus() {
    this.apiService.getEmployeeStatus()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.checkIsChangeMg = results.statusCode;
        if(results.statusCode) {
          this.itemsMenuPopup[1].visible = true;
        }
      }
    })
  }

}

