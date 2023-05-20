import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { getValueOfField } from 'src/app/utils/common/function-common';

@Component({
  selector: 'app-chi-tiet-ho-so-ca-nhan',
  templateUrl: './chi-tiet-ho-so-ca-nhan.component.html',
  styleUrls: ['./chi-tiet-ho-so-ca-nhan.component.scss']
})
export class ChiTietHoSoCaNhanComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() displayCustomerProfile: boolean = false;
  @Input() custId = null;
  @Input() canId = null;
  @Input() hideButton: boolean = false;
  tabIndex: number = 0;
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
    custId: null,
    edit_is: false
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
      { label: 'Danh sách hồ sơ cá nhân', routerLink: '/tuyen-dung/ho-so-ca-nhan' },
      { label: `${this.titlePage}` },
    ]
    if(this.isDialog) {
      this.modelEdit.custId = this.custId;
      if(this.custId || this.custId != "") {
        this.getCustFields();
      }else {
        // this.setCustFromCanId();
      }
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
      this.modelEdit.custId = this.paramsObject.params.custId || null
      this.modelEdit.edit_is = this.paramsObject.params.type || null
      this.getCustFields();
    });
  }

 
  cancel(data) {
    if (data === 'CauHinh') {
      this.getCustFields() 
    } else if (data === 'BackPage') {
      this.listViews = [];
      this.getCustFields(this.flowCurrent === 1 ? this.flowCurrent: this.flowCurrent -1)
    } else if( data === 'Close') {
      this.router.navigate(['/tuyen-dung/ds-tuyen-dung'])
    } else {
     this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ho-so-ca-nhan']);
    }
  }

  setSchemeInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data.datas
    }
    this.callApiInfo(params)
  }
  
  onBack() {
    this.router.navigate(['/tuyen-dung/ho-so-ca-nhan'])
  }

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setCustFields(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ho-so-ca-nhan'])
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
  getCustFields(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ custId: this.modelEdit.custId, flow_cur: flow_cur, edit_is: this.modelEdit.edit_is });
    this.apiService.getCustFields(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.listViews = cloneDeep(results.data.group_fields || []);
        this.detailInfo = results.data;
        this.status = results.data.flowStatuses || [];
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        if(results.data.actions && results.data.actions.length > 0) {
          this.initButton();
        }
      }else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
        this.isDialog ? this.callback.emit() : this.router.navigate(['/tuyen-dung/ho-so-ca-nhan'])
      }
    })
  }

   
  UpdateStatus() {
    this.getCustFields(this.selectedStatus.value);
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


  handleChange(index) {
    this.tabIndex = index;
  }

  displayAddCCCD = false;
  detailPopup() {
    this.displayAddCCCD = true;
  }

  saveCCCD(event) {
    this.displayAddCCCD =false;
    this.getCustFields();
  }

  
}