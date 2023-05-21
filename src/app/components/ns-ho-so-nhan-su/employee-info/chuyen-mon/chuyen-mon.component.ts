import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { AgGridFn, getFieldValueAggrid } from 'src/app/utils/common/function-common';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-chuyen-mon',
  templateUrl: './chuyen-mon.component.html',
  styleUrls: ['./chuyen-mon.component.scss']
})
export class ChuyenMonComponent implements OnInit {
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
    this.getEmpQualification();
  }
  optionsButtonsView = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-save' },
    // { label: 'Xuất hồ sơ', value: 'xuatHoSo', class: '', icon: 'pi file-excel' },
  ];

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  codeStaff = ''
  listViews = [];
  listViewsForm = [];
  status = [];
  selectedStatus = null;
  getEmpQualification(): void {
    this.spinner.show();
    this.listViews = [];
    this.listViewsForm = [];
    this.detailInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpQualification(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        // if (!this.codeStaff) {
        //   this.codeStaff = getFieldValueAggrid(results.data, 'code');
        // }
        this.status = results.data.flowStatuses || [];
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
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

  setEmpQualification(data) {
    const params = {
      ...this.detailInfo, group_fields: data.datas
    };
    this.apiService.setEmpQualification(params)
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
      this.getEmpQualification();
    } else {

    }
  }

  columnDefs = [];

  isEditDetail = false;
  cancelSetDetail(event) {
    this.isEditDetail = false;
    this.getEmpQualification();
    // this.reloadEdit.emit();
  }

  editDetail() {
    this.isEditDetail = true;
  }

}



