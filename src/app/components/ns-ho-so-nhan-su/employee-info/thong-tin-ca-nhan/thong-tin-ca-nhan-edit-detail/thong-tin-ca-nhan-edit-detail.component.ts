import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-thong-tin-ca-nhan-edit-detail',
  templateUrl: './thong-tin-ca-nhan-edit-detail.component.html',
  styleUrls: ['./thong-tin-ca-nhan-edit-detail.component.scss']
})
export class ThongTinCaNhanEditDetailComponent implements OnInit {
  @Input() empId = null;
  @Input() isEditDetail = false;
  @Output() cancelSave = new EventEmitter<any>();
  detailInfo = null;
  listViews = [];
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    ) { }
   optionsButtonsView = [
      { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-caret-left' },
      { label: 'Tiếp tục', value: 'Update', class: 'btn-accept', icon: 'pi pi-caret-right' },
      { label: 'Lưu tạm', value: 'SaveNhap', class: 'btn-accept', icon: 'pi pi-caret-right' },
      { label: 'Xác nhận', value: 'Submit', class: 'btn-accept', icon: 'pi pi-check' },
      { label: 'Đóng', value: 'Close', class: 'btn-accept', icon: 'pi pi-times' }
    ]
  ngOnInit(): void {
    this.getDetail();
  }
  activeIndex = 0;
  flowCurrent = 0;
  steps = [];

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  status = [];
  selectedStatus = null;
  getDetail(flow_cur = null) {
    this.spinner.show();
    this.listViews = [];
    const query = { empId: this.empId, edit_is: true, flow_cur: flow_cur }
    this.apiService.getEmpProfile(queryString.stringify(query))
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
    this.getDetail(this.selectedStatus.value);
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


  cloneListViews = [];
  callBackForm(event) {
    if(this.flowCurrent >= this.activeIndex) {
      const params = {
        ...this.detailInfo, group_fields: event.data
        , flow_cur: event.type === 'Submit' ? this.flowCurrent : this.flowCurrent
        , action: event.type === 'Submit' ? 'submit' : 'save'
      }
      this.cloneListViews = cloneDeep(event.data);
      this.listViews = [];
      this.callApiInfo(params, event.type);
    }else {
      const params = {
        ...this.detailInfo, group_fields: event.data
        , flow_st: this.detailInfo.flow_cur
        , action: event.type === 'Submit' ? 'submit' : 'save'
      }
      this.cloneListViews = cloneDeep(event.data);
      this.listViews = [];
      this.callApiInfo(params, event.type);
    }

    // const params = {
    //   ...this.detailInfo, group_fields: event.data, flow_cur: event.type === 'Submit' ?  this.flowCurrent : this.flowCurrent -1
    // }
    //  this.cloneListViews = cloneDeep(event.data);
    // this.listViews = [];
    // this.callApiInfo(params, event.type)
  }

  stepActivated(): void {
    console.log(this.flowCurrent)
    const stepS = document.querySelectorAll('.steps-contract .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        if (i <= this.flowCurrent) {
          console.log(i,i<= this.flowCurrent && i !== 0)
          // console.log(i !== 1)
          stepS[i].className +=  ` p-highlight ${i<= this.activeIndex ? 'active' : 'remove-active'} ${i<= this.flowCurrent && this.flowCurrent !== 1 ? 'active-confirm' : 'remove-active-confirm'}`;
        } else {
          stepS[i].classList.value = `p-steps-item icon-${i}`;
        }
      }
    }
  }

  setDetail(data) {
    if(this.flowCurrent >= this.activeIndex) {
      const params = {
        ...this.detailInfo, group_fields: data.datas, flow_cur: this.flowCurrent, action: 'next'
      };
      this.cloneListViews = cloneDeep(data);
      this.listViews = [];
      this.callApiInfo(params)
    }else {
      this.getDetail(this.flowCurrent + 1);
    }

    // const  params = {
    //   ...this.detailInfo, group_fields: data, flow_cur: this.flowCurrent
    // };
    // this.cloneListViews = cloneDeep(data);
    // this.listViews = [];
    // this.callApiInfo(params)
  
  }

  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setEmpProfile(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message : 'Cập nhật thông tin thành công' });
        if(type === 'Submit' || type === 'SaveNhap') {
          setTimeout(() => {
            this.cancelSave.emit();
          }, 200);
        }
      } else {
        this.listViews = cloneDeep(this.cloneListViews);
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
      this.getDetail(this.flowCurrent === 1 ?this.flowCurrent: this.flowCurrent - 2)
    } else {
      this.cancelSave.emit();
    }
  }
}
