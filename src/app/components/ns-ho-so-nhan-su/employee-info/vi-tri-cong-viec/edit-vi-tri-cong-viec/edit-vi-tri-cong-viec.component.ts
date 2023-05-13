import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-edit-vi-tri-cong-viec',
  templateUrl: './edit-vi-tri-cong-viec.component.html',
  styleUrls: ['./edit-vi-tri-cong-viec.component.scss']
})
export class EditViTriCongViecComponent implements OnInit {
  @Input() empId = null;
  @Input() isEditDetail: boolean = false;
  @Output() cancelSave = new EventEmitter<any>();
  detailInfo = null;
  listViews = [];
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    ) { }
    optionsButtonsView = [
      { label: 'Bỏ qua', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-times' },
      { label: 'Xác nhận', value: 'Update', class: 'btn-accept' },
      // { label: 'Tiếp tục', value: 'Update', class: 'btn-accept' }
    ]
  ngOnInit(): void {
    this.getDetail();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  status = [];
  selectedStatus = null;
  activeIndex = 0;
  steps = [];
  getDetail() {
    this.spinner.show();
    this.detailInfo = null;
    const query = { empId: this.empId, edit_is: true }
    this.apiService.getEmpWorkJob(queryString.stringify(query))
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.status = results.data.flowStatuses;
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        this.initButton();
      };
    }, error => {
      this.spinner.hide();
      console.log('error', error);
    });
  }

  UpdateStatus() {
    this.getDetail(); 

    // check lại xem cần gửi lên trạng thái không
  }
  
  callActions(code) {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }
  menuActions = [];
  initButton() {
    this.optionsButtonsView = this.detailInfo.actions.map(item => {
      return {
        label: item.name,
        value: item.code,
        icon: item.icon
      }
    });

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


  callBackForm(event) {
    const params = {
      ...this.detailInfo, group_fields: event.data
    }
    this.callApiInfo(params)
    if(event.type === 'Submit' || event.type === 'SaveNhap') {
      setTimeout(() => {
        this.cancelSave.emit();
      }, 200);
    }
  }

  setDetail(data) {
    const  params = {
      ...this.detailInfo, group_fields: data
    };
    this.callApiInfo(params)
  
  }

  callApiInfo(params) {
    this.spinner.show();
    this.apiService.setEmpWorkJob(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.cancelSave.emit();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Cập nhật thông tin thành công' });
      } else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  canceDetail(data) {
    if (data === 'CauHinh') {
      this.getDetail()
    } else if (data === 'BackPage') {
      this.listViews = [];
      const params = {
        ...this.detailInfo, flow_st: this.activeIndex - 1
      }
      this.callApiInfo(params)
    } else {
      this.cancelSave.emit();
    }
  }
}
