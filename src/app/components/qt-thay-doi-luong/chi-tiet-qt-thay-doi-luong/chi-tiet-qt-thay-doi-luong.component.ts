
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-chi-tiet-qt-thay-doi-luong',
  templateUrl: './chi-tiet-qt-thay-doi-luong.component.html',
  styleUrls: ['./chi-tiet-qt-thay-doi-luong.component.scss']
})
export class ChiTietQTThayDoiLuongComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() empId = null;
  @Input() salaryInfoId = null;
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  optionsButtonsView = [
    { label: 'Quay lại', value: 'BackPage', class: 'p-button-secondary', icon: 'pi pi-caret-left' },
    { label: 'Tiếp tục', value: 'Update', class: 'btn-accept', icon: 'pi pi-caret-right' },
    { label: 'Lưu tạm', value: 'SaveNhap', class: 'btn-accept', icon: 'pi pi-caret-right' },
    { label: 'Xác nhận', value: 'Submit', class: 'btn-accept', icon: 'pi pi-check' },
    { label: 'Đóng', value: 'Close', class: 'btn-accept', icon: 'pi pi-times' }
  ]
  displayuploadcontract = false;
  metafile = null;
  displaySetting= false;
  gridKeyForm= '';
  detailInfo = null;
  listViews = [];
  steps = [];
  activeIndex = 0;
  titlePage = '';
  url = '';
  itemsMenu = [];
  modelEdit = {
    salaryInfoId: null,
    empId: null
  }
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    this.itemsMenu =  [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Quá trình thay đổi lương', routerLink: '/nhan-su/qua-trinh-thay-doi-luong' },
      { label: `${this.titlePage}` },
    ]
    if(this.isDialog) {
      this.modelEdit.salaryInfoId = this.salaryInfoId
      this.modelEdit.empId = this.empId;
      this.getSalaryInfoDevM();
    }else {
      this.handleParams();
    }
  }
  paramsObject = null;

  handleParams(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelEdit.salaryInfoId = this.paramsObject.params.salaryInfoId || null
      this.modelEdit.empId = this.paramsObject.params.empId || null
      this.getSalaryInfoDevM();
    });
  }

  stepActivated(): void {
    const stepS = document.querySelectorAll('.steps-contract .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        if (i <= this.flowCurrent) {
          stepS[i].className += ` p-highlight ${i < this.activeIndex ? 'active' : 'remove-active'} ${i < this.flowCurrent && this.flowCurrent !== 1 ? 'active-confirm' : 'remove-active-confirm'}`;
        } else {
          stepS[i].className += ` p-highlight ${i < this.activeIndex ? 'active' : 'remove-active'} ${i < this.flowCurrent && this.flowCurrent !== 1 ? 'active-confirm' : 'remove-active-confirm'}`;
        }
      }
    }
  }

  cancel(data) {
    if (data === 'CauHinh') {
      this.getSalaryInfoDevM() 
    } else if (data === 'BackPage') {
      this.getSalaryInfoDevM(this.flowCurrent === 1 ? this.flowCurrent: this.flowCurrent - 1)
    } else {
     this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/qua-trinh-thay-doi-luong']);
    }
  }

  setSalaryInfoDevM(data) {
    this.listViews = [];
    if(this.flowCurrent >= this.activeIndex) {
      const params = {
        ...this.detailInfo
        , group_fields: data
        , flow_cur: this.flowCurrent
        , action: 'next'
      }
      this.cloneListViews = cloneDeep(data); 
      this.listViews = [];
      this.callApiInfo(params)
    }else {
      this.getSalaryInfoDevM(this.flowCurrent + 1);
    }
  }
  cloneListViews = []
  callBackForm(event) {
    if (event.type === 'IsSpecial') {
      const params = {
        ...this.detailInfo, group_fields: event.data
      }
      this.cloneListViews = cloneDeep(event.data);
      this.listViews = [];
      this.setSalaryDraft(params);
    } else {
      if(this.flowCurrent >= this.activeIndex) {
        const params = {
          ...this.detailInfo
          , group_fields: event.data
          , flow_cur: event.type === 'Submit' ? this.flowCurrent : this.flowCurrent - 1
          , action: event.type === 'Submit' ? 'submit' : 'save'
        }
        this.cloneListViews = cloneDeep(event.data);
        this.listViews = [];
        this.callApiInfo(params, event.type);
      }else {
        const params = {
          ...this.detailInfo
          , group_fields: event.data
          , flow_st: this.detailInfo.flow_cur
          , action: event.type === 'Submit' ? 'submit' : 'save'
        }
        this.cloneListViews = cloneDeep(event.data);
        this.listViews = [];
        this.callApiInfo(params, event.type);
      }
    
    }
  }

  setSalaryDraft(params) {
    this.spinner.show();
    this.apiService.setSalaryDraft(params).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.listViews = cloneDeep(results.data.group_fields);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.detailInfo = results.data;
        this.modelEdit.salaryInfoId = results.data.salaryInfoId
        this.flowCurrent = results.data.flow_cur;
        this.optionsButtonsView =[
          { label: 'Quay lại', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left', },
          { label: 'Tiếp tục', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
      } else {
        this.listViews = cloneDeep(this.cloneListViews);
        setTimeout(() => {
          this.stepActivated();
         }, 100);
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setSalaryInfoNew(params).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.modelEdit.salaryInfoId = results.data.salaryInfoId;
        this.listViews = cloneDeep(results.data.group_fields);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.detailInfo = results.data;
        this.flowCurrent = results.data.flow_cur;
        this.optionsButtonsView =[
          { label: 'Quay lại', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left', },
          { label: 'Tiếp tục', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });

        if(type === 'Submit' || type === 'SaveNhap') {
          setTimeout(() => {
            this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/qua-trinh-thay-doi-luong'])
          }, 200);
        }
      } else {
        this.listViews = cloneDeep(this.cloneListViews);
       setTimeout(() => {
        this.stepActivated();
       }, 100);
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }

  getSalaryInfoDevM(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({...this.modelEdit, flow_cur: flow_cur });
    this.apiService.getSalaryInfoNew(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur;
        this.modelEdit.salaryInfoId = results.data.salaryInfoId;
        this.steps = results.data.flowStatuses.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        this.listViews = cloneDeep(results.data.group_fields);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.optionsButtonsView =[
          { label: 'Quay lại', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left', },
          { label: 'Tiếp tục', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
        this.detailInfo = results.data;
        this.spinner.hide();
      }else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    })
  }
  
}

  
  
