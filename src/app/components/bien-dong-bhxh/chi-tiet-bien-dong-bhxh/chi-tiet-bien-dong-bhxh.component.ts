import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-chi-tiet-bien-dong-bhxh',
  templateUrl: './chi-tiet-bien-dong-bhxh.component.html',
  styleUrls: ['./chi-tiet-bien-dong-bhxh.component.scss']
})
export class ChiTietBienDongBHXHComponent implements OnInit {
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  @Input() isDialog = false;
  @Input() empId = null;
  @Input() insuranceId = null;
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  optionsButtonsView = []
  displayuploadcontract = false;
  metafile = null;
  displaySetting = false;
  gridKeyForm = '';
  detailInfo = null;
  listViews = [];
  steps = [];
  activeIndex = 0;
  titlePage = '';
  url = '';
  itemsMenu = [];
  modelEdit = {
    insuranceId: null,
    empId: null
  }
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.url = this.activatedRoute.data['_value'].url;
    this.itemsMenu = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Danh sách biến động BHXH', routerLink: '/nhan-su/bien-dong-bhxh' },
      { label: `${this.titlePage}` },
    ]
    if (this.isDialog) {
      this.modelEdit.insuranceId = this.insuranceId
      this.modelEdit.empId = this.empId;
      this.getInsuranceInfo();
    } else {
      this.handleParams();
    }
  }
  paramsObject = null;

  handleParams(): void {
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.modelEdit.insuranceId = this.paramsObject.params.insuranceId || null
      this.modelEdit.empId = this.paramsObject.params.empId || null
      this.getInsuranceInfo();
    });
  }
  indexTab = 0;
  handleChange(index) {
    this.indexTab = index;
  }

  cancel(data) {
    if (data === 'CauHinh') {
      this.getInsuranceInfo()
    } else if (data === 'BackPage') {
      this.listViews = [];
      this.getInsuranceInfo(this.flowCurrent === 1 ? this.flowCurrent : this.flowCurrent - 1)
    } else if (data === 'NghiViec') {
    } else {
      this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/bien-dong-bhxh']);
    }
  }

  setInsuranceInfo(data) {
    this.listViews = [];
    const params = {
      ...this.detailInfo, group_fields: data.datas
    }
    this.cloneListViews = cloneDeep(data);
    this.listViews = [];
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
      this.setInsuranceDraft(params);
    } 
  }

  callActions(code) {
    setTimeout(() => {
      const s: HTMLElement = document.getElementById(code);
      s.click();
    }, 400);
  }

  setInsuranceDraft(params) {
    this.spinner.show();
    this.apiService.setInsuranceDraft(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.activeIndex = results.data.flow_st;
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.modelEdit.insuranceId = results.data.insuranceId
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
        this.spinner.hide();
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error });
      this.spinner.hide();
    })
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
          this.callActions(item.code);
        }
      }
    });
  }

  flowCurrent = 0
  callApiInfo(params, type = 'Update') {
    this.spinner.show();
    this.apiService.setInsuranceInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.modelEdit.insuranceId = results.data.insuranceId;
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/bien-dong-bhxh'])
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

  backPgae() {
    this.isDialog ? this.callback.emit() : this.router.navigate(['/nhan-su/bien-dong-bhxh'])
  }

  UpdateStatus() {
    this.getInsuranceInfo(this.selectedStatus.value);
  }

  status = [];
  selectedStatus = null;
  getInsuranceInfo(flow_cur = null) {
    this.detailInfo = null;
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ insuranceId: this.modelEdit.insuranceId, flow_cur: flow_cur, empId: this.modelEdit.empId });
    this.apiService.getInsuranceInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.modelEdit.insuranceId = results.data.insuranceId;
    
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);
        this.status = results.data.flowStatuses || [];
        if(results.data.status) {
          this.status.push(results.data.status);
        }
        this.selectedStatus = results.data.status;
        if( this.detailInfo.actions) {
           this.initButton();
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    })
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}





