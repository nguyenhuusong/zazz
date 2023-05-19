import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import {  getFieldValueAggrid } from 'src/app/utils/common/function-common';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-thue-bao-hiem',
  templateUrl: './thue-bao-hiem.component.html',
  styleUrls: ['./thue-bao-hiem.component.scss']
})
export class ThueBaoHiemComponent implements OnInit {
  detailInfo = null;
  @Input() empId = null
  @Input() dataEmployeeStatus = null
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
    this.getEmpByInsurance();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  optionsButtonsView = [
    // { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-save' },
    // { label: 'Xuất hồ sơ', value: 'xuatHoSo', class: '', icon: 'pi file-excel' },
  ]
  codeStaff = ''
  listViews = [];
  listViewsForm = [];
  status = [];
  selectedStatus = null;
  getEmpByInsurance(): void {
    this.spinner.show();
    this.listViews = [];
    this.detailInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId, isEdit : false });
    this.apiService.getEmpByInsurance(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        // if (!this.codeStaff) { //không hiểu thêm vào làm gì 
        //   this.codeStaff = getFieldValueAggrid(results.data, 'code');
        // }
        if(results.data.flowStatuses) {
          this.status = results.data.flowStatuses;
        }
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        if (this.detailInfo.actions && this.detailInfo.actions.length > 0) {
          this.initButton();
        }
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
    // this.gridApi.sizeColumnsToFit();
  }

  
  recruiUpdateStatus() {

  }
  
  callActions(e) {

  }

  optionsButon = [];
  menuActions = [];
  initButton() {
    this.optionsButon = this.detailInfo.actions.map(item => {
      return {
        label: item.name,
        value: item.code,
        icon: item.icon
      }
    });

    // this.menuActions = this.detailInfo.actions.map((item, index) => {
    //   return {
    //     label: item.name,
    //     value: item.code,
    //     styleClass: index === 0 ? 'hidden' : '',
    //     icon: item.icon,
    //     command: () => {
    //       this.callActions(item.code);
    //     }
    //   }
    // });
  }
 

 
  displayuploadcontract = false;
  record = null;
  uploadContract(event) {
    this.displayuploadcontract = true;
    this.record = event.rowData;
  }

  setEmpByInsuranceInfo(data) {
    const  params = {
      ...this.detailInfo, group_fields: data.datas
    };
    this.apiService.setEmpByInsuranceInfo(params)
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
      this.getEmpByInsurance();
    } else {

    }
  }
  columnDefs = [];
  gridKey = '';
  listsData = [];

  detailFormInfo = null;
  vitri = 0;
  titleEmpTrain = '';
  idFrom = null;
  displayFormEditDetail = false;


  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]
  gridKeyForm = {
    index: 0,
    gridKey: ''
  }


  //cấu hình

  CauHinh(type) {

  }

  isEditDetail = false;
  editDetail() {
    this.isEditDetail = true;
  }

  cancelSetDetail(event) {
    this.isEditDetail = false;
    this.getEmpByInsurance();
  }

}

