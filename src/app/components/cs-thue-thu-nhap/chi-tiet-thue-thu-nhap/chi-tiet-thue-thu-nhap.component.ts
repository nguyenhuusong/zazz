import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-chi-tiet-thue-thu-nhap',
  templateUrl: './chi-tiet-thue-thu-nhap.component.html',
  styleUrls: ['./chi-tiet-thue-thu-nhap.component.scss']
})
export class ChiTietThueThuNhapComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'Edit';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Sửa', value: 'Edit', class: CheckHideAction(MENUACTIONROLEAPI.GetIncomeTaxPage.url, ACTIONS.EDIT) ? 'hidden' : ''
}, { label: 'Quay lại', value: 'Back' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) { }
  displayScreemForm = false;
  displaysearchUserMaster = false;
  listViewsForm = [];
  detailComAuthorizeInfo = null;
  id = null
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
  detailInfo = null;
  listsData = []
  columnDefs
  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  items = [];
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Chính sách' },
      { label: 'Danh sách thuế thu nhập', routerLink: '/chinh-sach/thue-thu-nhap' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
      this.handleParams()
  }

  handleParams() {
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.id = this.paramsObject.params.id;
        this.getIncomeTaxInfo();
    });
  };

  getIncomeTaxInfo() {
    this.listViews = [];
    this.listsData = [];
    this.apiService.getIncomeTaxInfo(this.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setAccountInfo(data): void {
    const params = { ...this.detailInfo, group_fields: data };
    this.apiService.setIncomTaxInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
      if (results.status === 'success') {
        this.goBack();
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
      this.messageService.add({
        severity: 'error', summary: 'Thông báo', detail:error
      });
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
      this.router.navigate(['/chinh-sach/thue-thu-nhap']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh'){
      this.getIncomeTaxInfo();
    }else {
      this.router.navigate(['/chinh-sach/thue-thu-nhap']);
    }
  }

}




