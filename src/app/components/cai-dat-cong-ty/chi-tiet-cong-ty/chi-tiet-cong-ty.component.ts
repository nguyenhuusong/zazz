import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import queryString from 'query-string';
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
  selector: 'app-chi-tiet-cong-ty',
  templateUrl: './chi-tiet-cong-ty.component.html',
  styleUrls: ['./chi-tiet-cong-ty.component.scss']
})
export class ChiTietCongTyComponent implements OnInit, OnChanges, OnDestroy {
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
  companyId = null
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
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách công ty', routerLink: '/cai-dat/cai-dat-cong-ty' },
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
      this.companyId = this.paramsObject.params.companyId;
      this.getCompanyInfo();
    });
  };
  detailInfo = null;
  listsData = []
  columnDefs
  getCompanyInfo() {
    this.listViews = [];
    this.listsData = [];
    const queryParams = queryString.stringify({ companyId: this.companyId });
    this.apiService.getCompanyInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.listsData = cloneDeep(this.detailInfo.authorizes);
        this.columnDefs = [...AgGridFn(this.detailInfo.gridflexs || []), {
          headerName: '',
          field: 'button',
          filter: '',
          pinned: 'right',
          width: 60,
          cellRenderer: 'buttonAgGridComponent',
          cellClass: ['border-right'],
          cellRendererParams: params => this.showButton()
        }];
      }
    })
  }

  showButton() {
    return {
      buttons: [
        {
          onClick: this.OnClick.bind(this),
          label: 'Chỉnh sửa',
          icon: 'fa fa-edit',
          key: 'CHINHSUA',
          class: 'btn-primary mr-1',
        },
        {
          onClick: this.OnClick.bind(this),
          label: 'Xóa',
          key: 'DELETE',
          icon: 'pi pi-trash',
          class: 'btn-danger',
        },

      ]
    };
  }

  OnClick(event) {
    if (event.event.item.key === 'CHINHSUA') {
      this.modelComAuthorizeInfo = {
        auth_id: event.rowData.auth_id,
        companyId: this.companyId,
        cif_no: ''
      }
      this.getComAuthorizeInfo();

    } else {
      this.delComAuthorizeInfo(event);
    }
  }

  delComAuthorizeInfo(event) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        this.spinner.show();
        const queryParams = queryString.stringify({ auth_id: event.rowData.auth_id });
        this.apiService.delComAuthorizeInfo(queryParams)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(results => {
            if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Xoá thành công' });
              this.getCompanyInfo();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
              this.spinner.hide();
            }
          });
      }
    });
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setCompanyInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setCompanyInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        this.goBack()
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
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

  goBack() {
    if (this.titlePage) {
      this.router.navigate(['/cai-dat/cai-dat-cong-ty']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getCompanyInfo();
    }else {
      this.goBack();
    }
  }

  addComAuthorizeInfo() {
    this.displaysearchUserMaster = true;
  }

  callbackformSearch(data) {
    this.displaysearchUserMaster = false
    this.modelComAuthorizeInfo.cif_no = data.cif_No;
    this.modelComAuthorizeInfo.companyId = this.companyId;
    this.getComAuthorizeInfo();
  }

  modelComAuthorizeInfo = {
    auth_id: 0,
    companyId: null,
    cif_no: ''
  }

  getComAuthorizeInfo() {
    this.spinner.show();
    this.listViewsForm = [];
    const queryParams = queryString.stringify(this.modelComAuthorizeInfo);
    this.apiService.getComAuthorizeInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViewsForm = cloneDeep(results.data.group_fields);
        this.detailComAuthorizeInfo = results.data;
        this.displayScreemForm = true;
        this.spinner.hide();
      }
    })
  }

  cancelAuthor(data) {
    if(data === 'CauHinh') {
      this.getComAuthorizeInfo();
    }else {
      this.displayScreemForm =false;
    }
  }

  setComAuthorizeInfo(data) {
    const params = {
      ...this.detailComAuthorizeInfo, group_fields: data
    };
    this.apiService.setComAuthorizeInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayScreemForm = false;
        this.getCompanyInfo();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  searchUserMasterClose(e){
  }
}


