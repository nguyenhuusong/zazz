
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn, getFieldValueAggrid } from 'src/app/utils/common/function-common';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-tien-ich',
  templateUrl: './tien-ich.component.html',
  styleUrls: ['./tien-ich.component.scss']
})
export class TienIchComponent implements OnInit {
  detailInfo = null;
  @Input() empId = null
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
    this.getEmployeeInfo();

  }
  optionsButtonsView = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-save' },
    // { label: 'Xuất hồ sơ', value: 'xuatHoSo', class: '', icon: 'pi file-excel' },
  ]
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    this.apiService.getEmpOtherInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
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

 
  setEmpOtherInfo(data) {
    const  params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmpOtherInfo(params)
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


}

