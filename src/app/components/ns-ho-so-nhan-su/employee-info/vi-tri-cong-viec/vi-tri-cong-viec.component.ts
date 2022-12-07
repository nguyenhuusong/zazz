import { Component, Input, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-vi-tri-cong-viec',
  templateUrl: './vi-tri-cong-viec.component.html',
  styleUrls: ['./vi-tri-cong-viec.component.scss']
})
export class ViTriCongViecComponent implements OnInit {
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

  ngOnInit(): void {
    this.getTerminateReasons();
    this.getEmployeeInfo();
    this.getEmpProcessPageByEmpId();
    this.getEmpWorkingPageByEmpId();
    this.initMenuPopup()
  }

  itemsMenuPopup = []
  initMenuPopup() {
    this.itemsMenuPopup = [
      {
        label: 'Chuyển công tác',
        icon: 'pi pi-arrow-down-right',
        command: () => {
          this.chuyenCongTac();
        }
      },
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
  gridKeyForm = {
    index: 0,
    gridKey: ''
  }

  displaySetting = false;
  CauHinh(type) {
    this.gridKeyForm = {
      index: type,
      gridKey: type === 0 ? this.gridKey : this.gridKey1
    }
    this.displaySetting = true;
  }

  reloadGetEmpProfilePage() {
    this.gridKeyForm.index === 0 ? this.getEmpProcessPageByEmpId() : this.getEmpWorkingPageByEmpId();
  }

  getEmpProcessPageByEmpId() {
    this.spinner.show();
    this.columnDefs = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpProcessPageByEmpId(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.columnDefs = [
          ...AgGridFn(repo.data.gridflexs || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  // {
                  //   onClick: this.editRow.bind(this),
                  //   label: 'Xem chi tiết',
                  //   icon: 'fa fa-edit editing',
                  //   key: 'view-job-detail',
                  //   class: 'btn-primary mr5',
                  // },

                  // {
                  //   onClick: this.deleteRow.bind(this),
                  //   label: 'Xóa',
                  //   icon: 'pi pi-trash',
                  //   key: 'delete-qua-trinh-hop-dong',
                  //   class: 'btn-danger',
                  // },
                ]
              };
            },
          }
        ];
        this.listsData = repo.data.dataList.data || [];

      } else {
        this.spinner.hide();
      }
    })
  }
  getEmpWorkingPageByEmpId() {
    this.spinner.show();
    this.columnDefs1 = [];
    const queryParams = queryString.stringify({ empId: this.empId, offSet: 0, pageSize: 10000 });
    this.apiService.getEmpWorkingPageByEmpId(queryParams).subscribe(repo => {
      if (repo.status === 'success') {
        if (repo.data.dataList.gridKey) {
          this.gridKey1 = repo.data.dataList.gridKey;
        }
        this.spinner.hide();
        this.columnDefs1 = [
          ...AgGridFn(repo.data.gridflexs || []),
          {
            headerName: '',
            field: 'gridflexdetails1',
            cellClass: ['border-right', 'no-auto'],
            pinned: 'right',
            width: 70,
            cellRenderer: 'buttonAgGridComponent',
            cellRendererParams: params => {
              return {
                buttons: [
                  {
                    onClick: this.editRowTimeWork.bind(this),
                    label: 'Xem chi tiết',
                    icon: 'fa fa-edit editing',
                    key: 'view-job-detail',
                    class: 'btn-primary mr5',
                  },

                  {
                    onClick: this.deleteRow.bind(this),
                    label: 'Xóa',
                    icon: 'pi pi-trash',
                    key: 'delete-qua-trinh-hop-dong',
                    class: 'btn-danger',
                  },

                ]
              };
            },
          }
        ];
        this.listsData1 = repo.data.dataList.data || [];

      } else {
        this.spinner.hide();
      }
    })
  }

  editRowTimeWork(event) {
    this.vitri = 1;
    this.addTimeWork(event.rowData.empId, event.rowData.gd);
  }

  deleteRow(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa thời gian làm việc này?',
      accept: () => {
        const queryParams = queryString.stringify({gd: event.rowData.gd});
        this.apiService.delEmpWorking(queryParams).subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xóa thành công' });
            this.getEmpWorkingPageByEmpId();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
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
  chuyenCongTac() {
    this.modelDuyet.empId = this.detailInfo.empId;
    this.modelDuyet.full_name = this.detailInfo.fullName;
    this.titleForm.title = 'Chuyển công tác';
    this.keyParamGetInfo = API_PROFILE.CHUYEN_CONG_TAC
    this.getEmployeeChangeInfo();
    this.titleForm.type = 'ChuyenCongTac';
    this.displayDialog = true;
    this.noDisableInput = true;
  }

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
  vitri = 0;
  addTimeWork(empId = this.detailInfo.empId, gd = null) {
    this.vitri = 1;
    const queryParams = queryString.stringify({ empId: empId, gd: gd });
    this.getEmpWorking(queryParams);
  }
  addProcess(empId = this.detailInfo.empId, gd = null) {
    this.vitri = 0;
    const queryParams = queryString.stringify({ empId: empId, gd: gd });
    // this.getEmpWorking(queryParams);
  }


  listViewsDetail = [];
  dataDetailInfo = [];
  displayFormEditDetail = false;;
  getEmpWorking(query) {
    this.listViewsDetail = [];
    this.apiService.getEmpWorking(query).subscribe(results => {
      if (results.status === 'success') {
        this.listViewsDetail = cloneDeep(results.data.group_fields);
        this.dataDetailInfo = results.data;
        this.displayFormEditDetail = true;
      }
    })
  }

  cancelDetailInfo(data) {
    if (data === 'CauHinh') {
      const queryParams = queryString.stringify({ empId: this.detailInfo.empId, gd: null });
      this.getEmpWorking(queryParams);
    } else {
      this.displayFormEditDetail = false;
    }
  }

  setDetailInfo(data) {
    if(this.vitri === 1) {
      const param = {
        ...this.dataDetailInfo, group_fields: data
      }
      this.apiService.setEmpWorking(param).subscribe(results => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Thêm mới thành công' });
          this.displayFormEditDetail = false;
          this.getEmpWorkingPageByEmpId();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        }
      })
    }
  
  }
}

