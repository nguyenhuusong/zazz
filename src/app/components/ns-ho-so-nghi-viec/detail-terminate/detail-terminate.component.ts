import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { AgGridFn } from 'src/app/common/function-common/common';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
@Component({
  selector: 'app-detail-terminate',
  templateUrl: './detail-terminate.component.html',
  styleUrls: ['./detail-terminate.component.scss']
})
export class DetailTerminateComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() empId = null;
  @Input() id = null;
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
    terminateId: null,
    empId: null
  }
  ngOnInit(): void {
    this.getCustObjectListNew();
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    this.itemsMenu =  [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Danh sách hồ sơ nghỉ việc', routerLink: '/nhan-su/ho-so-nghi-viec' },
      { label: `${this.titlePage}` },
    ]
    if(this.isDialog) {
      this.modelEdit.terminateId = this.id
      this.modelEdit.empId = this.empId;
      this.getTerminateInfo();
    }else {
      this.handleParams();
    }
  }
  paramsObject = null;

  handleParams(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelEdit.terminateId = this.paramsObject.params.terminateId || null
      this.modelEdit.empId = this.paramsObject.params.empId || null
      this.getTerminateInfo();
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
          stepS[i].classList.value = `p-steps-item icon-${i}`;
        }
      }
    }
  }
  cancel(data) {
    if (data === 'CauHinh') {
      this.getTerminateInfo() 
    } else if (data === 'BackPage') {
      this.listViews = [];
      this.getTerminateInfo(this.flowCurrent === 1 ? this.flowCurrent: this.flowCurrent -1)
    } else if (data === 'NghiViec') {
      this.xulybangiao();
    } else {
     this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/ho-so-nghi-viec']);
    }
  }

  setTerminateInfo(data) {
    this.listViews = [];
    const params = {
      ...this.detailInfo, group_fields: data, flow_cur: this.flowCurrent
    }
    this.cloneListViews = cloneDeep(this.listViews); 
    this.listViews = [];
    this.callApiInfo(params)
   
  }
  cloneListViews = []
  callBackForm(event) {
    const params = {
      ...this.detailInfo, group_fields: event.data, flow_cur: event.type === 'Submit' ?  this.flowCurrent : this.flowCurrent -1
    }
    this.cloneListViews = cloneDeep(event.data); 
    this.listViews = [];
    this.callApiInfo(params, event.type)
  }

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setTerminateInfo(params).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur;
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
            this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/ho-so-nghi-viec'])
          }, 200);
        }
      } else {
        this.listViews = cloneDeep(this.cloneListViews);
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }

  getTerminateInfo(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ terminateId: this.modelEdit.terminateId, flow_cur: flow_cur });
    this.apiService.getTerminateInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur;
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
      }
    })
  }

  displayChangeStatus = false;
  modelPheDuyet = {
    id: '',
    status_key: '',
    status: 1,
    comment: '',
    status_dt: new Date()
  }
  listTerminateKey = [];

  xulybangiao() {
    this.modelPheDuyet = {
      id: this.modelEdit.terminateId,
      status_key: this.listTerminateKey.length > 0 ? this.listTerminateKey[0].value : '',
      status: 1,
      comment: '',
      status_dt: new Date()
    }
    this.displayChangeStatus = true;
  }

  getCustObjectListNew() {
    // const opts1 = { params: new HttpParams({ fromString: `objKey=terminate_key` }) };
    // this.apiService.getObjectGroup(opts1.params.toString()).subscribe(results => {
    //   this.listTerminateKey = results.data.map(d => {
    //     return {
    //       name: d.name,
    //       code: d.value
    //     }
    //   });

    //   this.listTerminateKey = [...this.listTerminateKey]
    // });
  }

  xacnhan() {
          this.getTerminateInfo();
        this.displayChangeStatus = false;
    // this.spinner.show();
    // const params: any = { ...this.modelPheDuyet };
    // params.lst_status_key = [];
    // if(typeof params.status_key === 'object'){
    //   params.lst_status_key = params.status_key.map(d => d.code);
    // }
    // delete params.status;
    // delete params.status_key;
    // params.status_dt = moment(new Date(this.modelPheDuyet.status_dt)).format('DD/MM/YYYY');
    // this.apiService.setTerminateStatus(params).subscribe(results => {
    //   if (results.status === 'success') {
    //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Thay đổi trạng thái thành công' });
    //     this.getTerminateInfo();
    //     this.displayChangeStatus = false;
    //     this.spinner.hide();
    //   } else {
    //     this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
    //     this.spinner.hide();
    //   }
    // });
  }
  
}

  
  


