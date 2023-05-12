import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-detail-terminate',
  templateUrl: './detail-terminate.component.html',
  styleUrls: ['./detail-terminate.component.scss']
})
export class DetailTerminateComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog: boolean = false;
  @Input() isEditDetail: boolean = false;
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
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
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
    if(this.flowCurrent >= this.activeIndex) {
      this.listViews = [];
      const params = {
        ...this.detailInfo, group_fields: data, flow_cur: this.flowCurrent, action: 'next'
      }
      this.cloneListViews = cloneDeep(data); 
      this.listViews = [];
      this.callApiInfo(params)
    }else {
      this.getTerminateInfo(this.flowCurrent + 1);
    }
   
  }
  cloneListViews = []
  callBackForm(event) {
    if(this.flowCurrent >= this.activeIndex) {
      const params = {
        ...this.detailInfo
        , group_fields: event.data
        , flow_cur: event.type === 'Submit' ?  this.flowCurrent : this.flowCurrent
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

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setTerminateInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        if(type === 'Submit' || type === 'SaveNhap') {
          setTimeout(() => {
            this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/ho-so-nghi-viec'])
          }, 200);
        }
      } else {
      
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
  status = [];
  selectedStatus = null;
  getTerminateInfo(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ terminateId: this.modelEdit.terminateId, flow_cur: flow_cur, empId: this.modelEdit.empId });
    this.apiService.getTerminateInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.modelEdit.terminateId = results.data.terminateId;
        this.detailInfo = results.data;
        this.status = results.data.flowStatuses;
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        if(results.data.actions && results.data.actions.length > 0) {
          this.initButton();
        }
        this.listViews = cloneDeep(results.data.group_fields);
        this.spinner.hide();
      }else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
        this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/ho-so-nghi-viec'])
      }
    })
  }

   
  UpdateStatus() {
    this.getTerminateInfo(this.selectedStatus.value);
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

  
  


