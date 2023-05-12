import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  selector: 'app-quan-he-lao-dong-c',
  templateUrl: './quan-he-lao-dong-c.component.html',
  styleUrls: ['./quan-he-lao-dong-c.component.scss']
})
export class QuanHeLaoDongCComponent implements OnInit {
  detailInfo = null;
  @Input() empId = null;
  @Input() dataEmployeeStatus = null;
  @Output() reloadEdit = new EventEmitter<any>();
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
  codeStaff = ''
  listViews = [];
  listViewsForm = [];
  status = [];
  selectedStatus = null;
  getEmployeeInfo(): void {
    this.spinner.show();
    this.listViews = [];
    // this.listViewsForm = [];
    this.detailInfo = null;
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpByContract(queryParams)
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
        this.detailInfo = results.data;
        if(this.detailInfo.actions && this.detailInfo.actions.length > 0) {
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
  
  callActions(code) {
    this[code]()
  }

  optionsButon = [];
  menuActions = [];
  initButton() {
    // this.optionsButon = this.detailInfo.actions.map(item => {
    //   return {
    //     label: item.name,
    //     value: item.code,
    //     icon: item.icon
    //   }
    // });

    this.menuActions = this.detailInfo.actions.map((item, index) => {
      return {
        label: item.name,
        value: item.code,
        styleClass: index === 0 ? 'hidden' : '',
        icon: item.icon,
        command: () => {
          this.callActions(item.code);
        }
      }
    });
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  cancelSave() {
    this.getEmployeeInfo();
    this.reloadEdit.emit();
  }


  setEmployeeInfo(data) {
    const params = {
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
  optionsButtonsPopup = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Xác nhận', value: 'Update', class: 'btn-accept' }
  ]


}


