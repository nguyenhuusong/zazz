
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-chi-tiet-qt-thay-doi-luong',
  templateUrl: './chi-tiet-qt-thay-doi-luong.component.html',
  styleUrls: ['./chi-tiet-qt-thay-doi-luong.component.scss']
})
export class ChiTietQTThayDoiLuongComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() displayFormEditDetail: boolean = false;
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

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelEdit.salaryInfoId = this.paramsObject.params.salaryInfoId || null
      this.modelEdit.empId = this.paramsObject.params.empId || null
      this.getSalaryInfoDevM();
    });
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
    const params = {
      ...this.detailInfo
      , group_fields: data.datas
    }
    this.callApiInfo(params)
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
    } 
  }

  setSalaryDraft(params) {
    this.spinner.show();
    this.apiService.setSalaryDraft(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.modelEdit.salaryInfoId = results.data.salaryInfoId;
        this.listViews = results.data.group_fields;
        this.detailInfo = results.data;
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
      } else {
        this.listViews = cloneDeep(this.cloneListViews);
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
    this.apiService.setSalaryInfoNew(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.modelEdit.salaryInfoId = results.data.salaryInfoId;
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/qua-trinh-thay-doi-luong'])
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
  }
  status = [];
  selectedStatus =null;
  getSalaryInfoDevM(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({...this.modelEdit, flow_cur: flow_cur });
    this.apiService.getSalaryInfoNew(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.modelEdit.salaryInfoId = results.data.salaryInfoId;
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.status = results.data.flowStatuses || [];
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        if( this.detailInfo.actions) {
           this.initButton();
        }
        this.spinner.hide();
      }else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    })
  }

  UpdateStatus() {
    this.getSalaryInfoDevM(this.selectedStatus.value);
  }
  menuActions = []

  callActions(code) {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }

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
          this.callActions(item.code);
        }
      }
    });
  }
  
}

  
  
