
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-chi-tiet-xu-ly-qt-cong-tac',
  templateUrl: './chi-tiet-xu-ly-qt-cong-tac.component.html',
  styleUrls: ['./chi-tiet-xu-ly-qt-cong-tac.component.scss']
})
export class ChiTietXuLyQtCongTacComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() empId = null;
  @Input() displayFormEditDetail: boolean = false;
  @Input() processId = null;
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
    processId: null,
    empId: null
  }
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    this.itemsMenu =  [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Danh sách xử lý quá trình công tác', routerLink: '/nhan-su/xu-ly-qua-trinh-cong-tac' },
      { label: `${this.titlePage}` },
    ]
    if(this.isDialog) {
      this.modelEdit.processId = this.processId
      this.modelEdit.empId = this.empId;
      this.getEmpProcessInfo();
    }else {
      this.handleParams();
    }
  }
  paramsObject = null;

  handleParams(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelEdit.processId = this.paramsObject.params.processId || null
      this.modelEdit.empId = this.paramsObject.params.empId || null
      this.getEmpProcessInfo();
    });
  }
  indexTab = 0;
  handleChange(index) {
    this.indexTab = index;
  }

  cancel(data) {
    if (data === 'CauHinh') {
      this.getEmpProcessInfo() 
    } else if (data === 'BackPage') {
      this.listViews = [];
      this.getEmpProcessInfo(this.flowCurrent === 1 ? this.flowCurrent: this.flowCurrent -1)
    } else {
     this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/xu-ly-qua-trinh-cong-tac']);
    }
  }

  setDetail(data) {
    this.listViews = [];
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.cloneListViews = cloneDeep(data); 
    this.listViews = [];
    this.callApiInfo(params)
  }
  cloneListViews = []
  callBackForm(event) {
    const params = {
      ...this.detailInfo
      , group_fields: event.data
    }
    this.cloneListViews = cloneDeep(event.data);
    this.listViews = []
    this.callApiInfo(params, event.type)
  }

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setEmpProcessInfo(params).subscribe(results => {
      if (results.status === 'success') {
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        if(type === 'Submit' || type === 'SaveNhap') {
          setTimeout(() => {
            this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/xu-ly-qua-trinh-cong-tac'])
          }, 200);
        }
      } else {
        // this.listViews = cloneDeep(this.cloneListViews);
        // this.spinner.hide();
        // setTimeout(() => {
        //   this.stepActivated();
        //  }, 100);
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
  selectedStatus= null;
  getEmpProcessInfo(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ processId: this.modelEdit.processId, flow_cur: flow_cur, empId: this.modelEdit.empId });
    this.apiService.getEmpProcessInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.flowCurrent = results.data.flow_cur;
        this.modelEdit.processId = results.data.processId;
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);
        this.status = results.data.flowStatuses;
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        if(this.detailInfo.actions &&this.detailInfo.actions.length > 0) {
          this.initButton();
        }
        this.spinner.hide();
      }else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
        this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/xu-ly-qua-trinh-cong-tac'])
      }
    })
  }

  onBack() {
    this.router.navigate(['/nhan-su/xu-ly-qua-trinh-cong-tac'])
  }
  
  UpdateStatus() {
    this.getEmpProcessInfo(this.selectedStatus.value);
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
}

  
  


