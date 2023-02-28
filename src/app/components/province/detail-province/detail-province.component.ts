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
  selector: 'app-detail-province',
  templateUrl: './detail-province.component.html',
  styleUrls: ['./detail-province.component.scss']
})
export class DetailProvinceComponent implements OnInit, OnChanges, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Lưu', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetTimekeepingWifiPage.url, ACTIONS.EDIT) ? 'hidden' : ''
}, { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  provinceId = null
  listViews = []
  paramsObject = null
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
      { label: 'Danh sách tỉnh thành', routerLink: '/cai-dat/tinh-thanh' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.provinceId = this.paramsObject.params.provinceId;
      this.getProvinceInfo();
    });
  };
  detailInfo = null;
  listsData = []
  columnDefs
  getProvinceInfo() {
    this.listViews = [];
    this.listsData = [];
    const queryParams = queryString.stringify({ provinceId: this.provinceId });
    this.apiService.getProvinceInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }

  setProvinceInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setProvinceInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.goBack()
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }

  goBack() {
    if (this.titlePage) {
      this.router.navigate(['/cai-dat/tinh-thanh']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getProvinceInfo();
    }else {
      this.goBack();
    }
  }

}


