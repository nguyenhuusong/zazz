import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import queryString from 'query-string';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-chi-tiet-loai-thong-bao',
  templateUrl: './chi-tiet-loai-thong-bao.component.html',
  styleUrls: ['./chi-tiet-loai-thong-bao.component.css']
})
export class ChiTietLoaiThongBaoComponent implements OnInit, OnChanges {
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
  source_ref = null
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
  items = []

  ngOnChanges() {
  }

  ngOnInit(): void {
    this.titlePage =  this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách thông báo', routerLink: '/cai-dat/thong-bao' },
      { label: 'Danh sách loại thông báo', routerLink: '/cai-dat/thong-bao/loai-thong-bao' },
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
      this.source_ref = this.paramsObject.params.source_ref;
      this.getNotifyRefInfo();
    });
  };
  detailInfo = null;
  getNotifyRefInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({source_ref: this.source_ref});
    this.apiService.getNotifyRef(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setNotifyRef(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setNotifyRef(params).subscribe((results: any) => {
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
    this.router.navigate(['/cai-dat/thong-bao/loai-thong-bao']);
   }else {
    this.back.emit();
   }
  }

  cancelUpdate(event) {
    if(event === 'CauHinh') {
      this.getNotifyRefInfo();
    }else {
      this.goBack();
    }
  }


}

