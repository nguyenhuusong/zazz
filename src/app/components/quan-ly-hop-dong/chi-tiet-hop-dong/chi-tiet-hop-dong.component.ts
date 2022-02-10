import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';

@Component({
  selector: 'app-chi-tiet-hop-dong',
  templateUrl: './chi-tiet-hop-dong.component.html',
  styleUrls: ['./chi-tiet-hop-dong.component.scss']
})
export class ChiTietHopDongComponent implements OnInit, OnChanges {
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
  contractType = null
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

  }
  items = [];
  ngOnInit(): void {
    this.titlePage =  this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách loại hợp đồng', url: '/cai-dat/quan-ly-hop-dong' },
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
      this.contractType = this.paramsObject.params.contractType || 0;
      this.getContractTypeInfo();
    });
  };

  detailInfo = null;
  getContractTypeInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({contractType: this.contractType});
    this.apiService.getContractTypeInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setContractTypeInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setContractTypeInfo(params).subscribe((results: any) => {
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
    this.router.navigate(['/cai-dat/quan-ly-hop-dong']);
   }else {
    this.back.emit();
   }
  }

  cancelUpdate(e) {
    this.goBack();
  }


}


