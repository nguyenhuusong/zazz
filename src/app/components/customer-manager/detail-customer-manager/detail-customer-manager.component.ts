
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-detail-customer-manager',
  templateUrl: './detail-customer-manager.component.html',
  styleUrls: ['./detail-customer-manager.component.scss']
})
export class DetailCustomerManagerComponent implements OnInit, OnChanges, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [
    { label: 'Lưu', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetCompanyPage.url, ACTIONS.EDIT) ? 'hidden' : '' },
    { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }
  ];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  displayScreemForm = false;
  displaysearchUserMaster = false;
  listViewsForm = [];
  detailComAuthorizeInfo = null;
  id = null;
  empId = null;
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage: string = '';
  url: string = '';

  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges() {

  }
  items = []
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'nhân sự' },
      { label: 'Người quản lý', routerLink: '/nhan-su/nguoi-quan-ly' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.dataRouter = this.paramsObject.params;
        this.id = this.paramsObject.params.id;
        this.empId = this.paramsObject.params.empId;
        this.getEmpManager();
      });
  };
  detailInfo = null;
  listsData = []
  columnDefs
  getEmpManager() {
    this.listViews = [];
    this.listsData = [];
    if (this.id) {
      this.getManagerById();
    } else {
      this.getManagerByEmpId();
    }


  }

  getManagerById() {
    const queryParams = queryString.stringify({ id: this.id, empId: this.empId });
    this.apiService.getEmpManager(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listViews = cloneDeep(results.data.group_fields);
          this.detailInfo = results.data;
        }
      })
  }

  getManagerByEmpId() {
    const queryParams = queryString.stringify({ empId: this.empId });
    this.apiService.getEmpManagerCreate(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          this.listViews = cloneDeep(results.data.group_fields);
          this.detailInfo = results.data;
        }
      })
  }

  setEmpManager(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmpManager(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message ? results.message:  'Cập nhật thông tin thành công' });
          this.router.navigate(['/nhan-su/nguoi-quan-ly']);
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: results.message
          });
        }
      }, error => {
      });
  }

  onChangeButtonView(event) {
    this.manhinh = event.value;
    if (event.value === 'Back') {
      this.goBack();
    }
  }

  callBackForm(event) {

  }

  goBack() {
    if (this.titlePage) {
      this.router.navigate(['/nhan-su/nguoi-quan-ly']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(data) {
    if (data === 'CauHinh') {
      this.getEmpManager();
    } else {
      this.goBack();
    }
  }

}


