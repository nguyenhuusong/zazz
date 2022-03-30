import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-chi-tiet-mau-thong-bao',
  templateUrl: './chi-tiet-mau-thong-bao.component.html',
  styleUrls: ['./chi-tiet-mau-thong-bao.component.css']
})
export class ChiTietMauThongBaoComponent implements OnInit, OnChanges {
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
  modelMarkdow = {
    type: 1,
    content: '',
    attachs: [],
    attack: true,
    id: 0
  }
  @Input() dataRouter = null
  @Output() back = new EventEmitter<any>();
  items = [];

  ngOnChanges() {

  }

  ngOnInit(): void {
    this.titlePage =  this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách thông báo', routerLink: '/cai-dat/thong-bao' },
      { label: 'Danh sách mẫu thông báo', routerLink: '/cai-dat/thong-bao/mau-thong-bao' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
    this.handleParams();
  }
  tempId = null;
  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.tempId  = this.paramsObject.params.tempId || null;
      this.modelMarkdow.id = this.dataRouter.n_id
      this.getNotifyTemp();
    });
  };

  detailInfo = null;
  getNotifyTemp() {
    this.listViews = [];
    const queryParams = queryString.stringify({tempId: this.tempId, n_id: this.dataRouter.n_id});
    this.apiService.getNotifyTemp(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setNotifyTemp(data) {
    data.forEach(element => {
      element.fields.forEach(element1 => {
        if (element1.field_name === 'content_mardown') {
          element1.columnValue = this.modelMarkdow.content;
        }
        if (element1.field_name === 'content_email') {
          element1.columnValue = this.modelMarkdow.content;
        }
      });
    });
    const params = {
      ...this.detailInfo,
      group_fields: data,
      attachs: this.modelMarkdow.attachs.map(data1 => {
        return {
          attach_name: data1.attach_name,
          attach_url: data1.attach_url
        }
      }),
    }
    
    this.apiService.setNotifyTemp(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        if(this.url === 'them-moi-mau-thong-bao') {
          this.goBack()
        }else {
          this.manhinh = 'View';
          this.getNotifyTemp();
          this.goBack()
        }
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

    this.router.navigate(['/cai-dat/thong-bao/mau-thong-bao']);
   }else {
    this.back.emit();
   }
  }

  cancelUpdate() {
    this.goBack();
  }


}

