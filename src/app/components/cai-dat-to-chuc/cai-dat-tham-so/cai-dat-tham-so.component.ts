import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-cai-dat-tham-so',
  templateUrl: './cai-dat-tham-so.component.html',
  styleUrls: ['./cai-dat-tham-so.component.scss']
})
export class CaiDatThamSoComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Quay lại', value: 'Back' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  org_cd = null
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

  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();


  ngOnChanges() {
    // this.optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Đóng', value: 'Back' }];
    // this.titlePage = null;
    // this.positionId = this.dataRouter.positionId;
    // this.manhinh = 'Edit';
    // this.getAccountInfo();
  }
  items = [];
  ngOnInit(): void {
    this.titlePage =  this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách tổ chức', url: '/cai-dat/cai-dat-to-chuc' },
      { label: this.titlePage},
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit'
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.org_cd = this.paramsObject.params.org_cd;
      this.getOrganizeConfig();
    });
  };
  detailInfo = null;
  getOrganizeConfig() {
    this.listViews = [];
    const queryParams = queryString.stringify({org_cd: this.org_cd});
    this.apiService.getOrganizeConfig(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setOrganizeConfig(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setOrganizeConfig(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.goBack()
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thêm tham số thành công' });
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

    this.router.navigate(['/cai-dat/cai-dat-to-chuc']);
   }else {
    this.back.emit();
   }
  }

  quaylai(e) {
    this.manhinh = 'View';
    this.router.navigate(['/cai-dat/cai-dat-to-chuc']);
  }


}

