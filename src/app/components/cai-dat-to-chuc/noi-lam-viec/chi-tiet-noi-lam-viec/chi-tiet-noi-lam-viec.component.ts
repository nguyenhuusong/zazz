import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import queryString from 'query-string';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

@Component({
  selector: 'app-chi-tiet-noi-lam-viec',
  templateUrl: './chi-tiet-noi-lam-viec.component.html',
  styleUrls: ['./chi-tiet-noi-lam-viec.component.scss']
})
export class ChiTietNoiLamViecComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [
    { label: 'Lưu', value: 'Update', icon: 'pi pi-save', class: CheckHideAction(MENUACTIONROLEAPI.GetWorkplacePage.url, ACTIONS.EDIT) ? 'hidden' : '' },
    { label: 'Quay lại', value: 'Back', icon: 'pi pi-directions-alt', class: 'p-button-secondary' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  //workplaceId = null
  org_level = 0
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
  @Input() workplaceId = '';
  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();
  @Output() callback = new EventEmitter<any>();
  ngOnChanges() {

  }
  items = [];
  ngOnInit(): void {
    this.titlePage =  this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách tổ chức', routerLink: '/cai-dat/cai-dat-to-chuc' },
      { label: 'Danh sách nơi làm viẹc', routerLink: '/cai-dat/noi-lam-viec' },
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
      //this.workplaceId = this.paramsObject.params.workplaceId || null;
      this.getWorkplaceInfo();
    });
  };

  detailInfo = null;
  getWorkplaceInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({workplaceId: this.workplaceId});
    this.apiService.getWorkplaceInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setWorkplaceInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setWorkplaceInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        this.callback.emit();
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
    this.router.navigate(['/cai-dat/noi-lam-viec']);
   }else {
    this.back.emit();
   }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getWorkplaceInfo();
    }else {
      this.callback.emit();
    }
  }


}


