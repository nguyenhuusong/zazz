
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-chi-tiet-ke-hoach-tuyen-dung',
  templateUrl: './chi-tiet-ke-hoach-tuyen-dung.component.html',
  styleUrls: ['./chi-tiet-ke-hoach-tuyen-dung.component.scss']
})
export class ChiTietKeHoachTuyenDungComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() empId = null;
  @Input() vacancyId = null;
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
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
    vacancyId: null,
    empId: null
  }
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    this.itemsMenu =  [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Danh sách kế hoạch tuyển dụng', routerLink: '/tuyen-dung/ke-hoach-tuyen-dung' },
      { label: `${this.titlePage}` },
    ]
    if(this.isDialog) {
      this.modelEdit.vacancyId = this.vacancyId
      this.modelEdit.empId = this.empId;
      this.getRecruitPlan();
    }else {
      this.handleParams();
    }
  }
  paramsObject = null;

  handleParams(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelEdit.vacancyId = this.paramsObject.params.vacancyId || null
      this.modelEdit.empId = this.paramsObject.params.empId || null
      this.getRecruitPlan();
    });
  }
  indexTab = 0;
  handleChange(index) {
    this.indexTab = index;
  }

  stepActivated(): void {
    const stepS = document.querySelectorAll('.steps-contract .p-steps-item');
    if (stepS.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        if (i <= this.flowCurrent) {
          stepS[i].className +=  ` p-highlight ${i< this.activeIndex ? 'active' : 'remove-active'} ${i< this.flowCurrent && this.flowCurrent !== 1 ? 'active-confirm' : 'remove-active-confirm'}`;
        } else {
          stepS[i].className +=  ` p-highlight ${i< this.activeIndex ? 'active' : 'remove-active'} ${i< this.flowCurrent && this.flowCurrent !== 1 ? 'active-confirm' : 'remove-active-confirm'}`;
        }
      }
    }
  }
  cancel(data) {
    if (data === 'CauHinh') {
      this.getRecruitPlan() 
    } else if (data === 'BackPage') {
      this.listViews = [];
      this.getRecruitPlan(this.flowCurrent === 1 ? this.flowCurrent: this.flowCurrent -1)
    } else {
     this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ke-hoach-tuyen-dun']);
    }
  }

  setDetail(data) {
    if(this.flowCurrent >= this.activeIndex) {
      this.listViews = [];
      const params = {
        ...this.detailInfo, group_fields: data, flow_cur: this.flowCurrent, action: 'next'
      }
      this.cloneListViews = cloneDeep(data); 
      this.listViews = [];
      this.callApiInfo(params)
    }else {
      this.getRecruitPlan(this.flowCurrent + 1);
    }
   
  }
  cloneListViews = []
  callBackForm(event) {
    if(this.flowCurrent >= this.activeIndex) {
      const params = {
        ...this.detailInfo
        , group_fields: event.data
        , flow_cur: event.type === 'Submit' ?  this.flowCurrent : this.flowCurrent -1
        , action: event.type === 'Submit' ? 'submit' : 'save'
      }
      this.cloneListViews = cloneDeep(event.data);
      this.listViews = []
      this.callApiInfo(params, event.type)
      }else {
        const params = {
          ...this.detailInfo
          , group_fields: event.data
          , flow_st: this.detailInfo.flow_cur
          , action: event.type === 'Submit' ? 'submit' : 'save'
        }
        this.cloneListViews = cloneDeep(event.data);
        this.listViews = []
        this.callApiInfo(params, event.type)
      }

  }

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setRecruitPlan(params).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur;
        this.modelEdit.vacancyId = results.data.vacancyId;
        this.listViews = cloneDeep(results.data.group_fields);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.detailInfo = results.data;
        this.optionsButtonsView =[
          { label: 'Quay lại', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left',  },
          { label: 'Tiếp tục', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });

        if(type === 'Submit' || type === 'SaveNhap') {
          setTimeout(() => {
            this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ke-hoach-tuyen-dun'])
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
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }

  getRecruitPlan(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ vacancyId: this.modelEdit.vacancyId, flow_cur: flow_cur, empId: this.modelEdit.empId });
    this.apiService.getRecruitPlan(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur;
        this.modelEdit.vacancyId = results.data.vacancyId;
        this.steps = results.data.flowStatuses.map(d => {
          return {
            label: d.flow_name,
            value: d.flow_st
          }
        });
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);
        setTimeout(() => {
          this.stepActivated();
        }, 100);
        this.optionsButtonsView =[
          { label: 'Quay lại', value: 'BackPage', class: `p-button-secondary ${results.data.prev_st ? '' : 'hidden'}`, icon: 'pi pi-caret-left',  },
          { label: 'Tiếp tục', value: 'Update', class: `btn-accept ${results.data.next_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-caret-right' },
          { label: 'Lưu tạm', value: 'SaveNhap', class: `btn-accept ${results.data.save_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Xác nhận', value: 'Submit', class: `btn-accept ${results.data.submit_st ? '' : 'hidden'} ml-1`, icon: 'pi pi-check' },
          { label: 'Đóng', value: 'Close', class: `p-button-danger ml-1`, icon: 'pi pi-times' }
        ]
        this.spinner.hide();
      }else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
        this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ke-hoach-tuyen-dun'])
      }
    })
  }

}

  
  

