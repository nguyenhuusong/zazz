import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
@Component({
  selector: 'app-chi-tiet-loai-giay-to',
  templateUrl: './chi-tiet-loai-giay-to.component.html',
  styleUrls: ['./chi-tiet-loai-giay-to.component.scss']
})
export class ChiTietLoaiGiayToComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Lưu', value: 'Update' },
  { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  recordTypeId = null
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage : string = '';
  url: string = '';

  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();

  ngOnChanges() {

  }
  items = [];
  ngOnInit(): void {
    this.titlePage =  this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách chức danh', routerLink: '/cai-dat/chuc-danh' },
      { label: `${this.titlePage}` },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
    this.handleParams();

  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.recordTypeId = this.paramsObject.params.recordTypeId || null;
      this.getEmpRecordTypeInfo();
    });
  };

  detailInfo = null;
  getEmpRecordTypeInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({recordTypeId: this.recordTypeId	});
    this.apiService.getEmpRecordTypeInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  SetEmpRecordTypeInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setEmpRecordTypeInfo(params).subscribe((results: any) => {
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
   if(this.titlePage) {
    this.router.navigate(['/cai-dat/chuc-danh']);
   }else {
    this.back.emit();
   }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getEmpRecordTypeInfo();
    }else {
      this.goBack();
    }
  }


}


