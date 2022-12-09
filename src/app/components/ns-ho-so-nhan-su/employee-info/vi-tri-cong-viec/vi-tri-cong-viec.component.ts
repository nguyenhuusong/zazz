import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { AgGridFn, getFieldValueAggrid } from 'src/app/utils/common/function-common';
import { NgxSpinnerService } from 'ngx-spinner';
import { API_PROFILE } from 'src/app/common/constants/constant';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-vi-tri-cong-viec',
  templateUrl: './vi-tri-cong-viec.component.html',
  styleUrls: ['./vi-tri-cong-viec.component.scss']
})
export class ViTriCongViecComponent implements OnInit, AfterViewInit {
  detailInfo = null;
  @Input() empId = null;
  @Input() dataEmployeeStatus = null;
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
  constructor(
    private apiService: ApiHrmService,
    private apiCoreService: ApiCoreService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  ngAfterViewInit(): void {
  //  setTimeout(() => {
  //   var dragTarget = document.getElementById('view_hrm_emp_process_page');
  //   const click$ = fromEvent(dragTarget, 'click');
  //   click$.subscribe( event => {
  //     console.log(event)
  //   });
  //  }, 500);
  }

  ngOnInit(): void {
    this.getTerminateReasons();
    this.getEmployeeInfo();
    this.initMenuPopup();
 
  }

  itemsMenuPopup = []
  initMenuPopup() {
    this.itemsMenuPopup = [
      // {
      //   label: 'Chuyển công tác',
      //   icon: 'pi pi-arrow-down-right',
      //   command: () => {
      //     this.chuyenCongTac();
      //   }
      // },
      {
        label: 'Nghỉ việc',
        icon: 'pi pi-directions',
        command: () => {
          this.fnNghiViec();
        }
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
    this.apiService.getTerminateReasons().subscribe(results => {
      if (results.status === 'success') {
        this.terminateReasons = results.data;
      }
    })
  }

  optionsButtonsView = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-save' },
    { label: 'Xuất hồ sơ', value: 'xuatHoSo', class: '', icon: 'pi file-excel' },
  ]

  cancelSave() {
    this.getEmployeeInfo();
  }
 
  codeStaff = ''
  listViews = [];
  listViewsForm = [];
  getEmployeeInfo(): void {
    this.spinner.show();
    this.listViews = [];
    this.listViewsForm = [];
    this.detailInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpWorkJob(queryParams).subscribe(results => {
      if (results.status === 'success') {
        if (!this.codeStaff) {
          this.codeStaff = getFieldValueAggrid(results.data, 'code');
        }
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.listViewsForm = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
    // this.gridApi.sizeColumnsToFit();
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
    this.apiService.setEmployeeInfo(params).subscribe((results: any) => {
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
    this.apiService.getEmployeeChangeInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsForm = cloneDeep(results.data.group_fields || []);
        this.detailInfoForm = results.data;
        this.detailInfoForm.empId = this.detailInfo.empId;
      }
    }, error => {
      this.spinner.hide();
    });
  }

  fnNghiViec() {
    this.modelDuyet.empId = this.detailInfo.empId;
    this.modelDuyet.full_name = this.detailInfo.fullName;
    this.titleForm.title = 'Xác nhận nhân viên nghỉ việc';
    this.titleForm.type = 'NghiViec';
    this.displayDialog = true;
    this.noDisableInput = false;
  }
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
    this.apiService.insurSetEmployeeChange(parmas).subscribe((results: any) => {
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
    this.apiService.setEmployeeTermilate(parmas).subscribe((results: any) => {
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
  }

  editDetail() {
    this.isEditDetail = true;
  }


}

