import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-detail-account',
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.css']
})
export class DetailAccountComponent implements OnInit, OnChanges {
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
  account_no = null
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

  @Input() detailAccount = null
  @Input() isModal = false
  @Output() back = new EventEmitter<any>();


  ngOnChanges(event) {
    console.log(event)
    // this.optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Đóng', value: 'Back' }];
    // this.titlePage = null;
    // this.account_no = this.detailAccount.account_no;
    // this.manhinh = 'Edit';
    // this.getAccountInfo();
  }

  ngOnInit(): void {
    if(this.isModal) {
      this.url = this.activatedRoute.data['_value'].url;
      if(this.url === 'profile-customer-detail') {
        this.optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Đóng', value: 'Back' }];
        this.titlePage = null;
        this.account_no = this.detailAccount.account_no;
        this.manhinh = 'Edit';
        this.getAccountInfo();
      }else {
        this.optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Quay lại', value: 'Back' }];
        this.handleParams();
        this.titlePage = this.activatedRoute.data['_value'].title;
      }
    }else {
      this.account_no = this.detailAccount.account_no;
      this.optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Hủy', value: 'Back' }];
      this.manhinh = this.detailAccount.account_no ? 'View' : 'Edit';
      this.titlePage = null;
      this.getAccountInfo();
    }
   
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.detailAccount = this.paramsObject.params;
      this.account_no = this.paramsObject.params.account_no;
      if(this.url === 'them-moi-tai-khoan') {
        this.manhinh = 'Edit';
        this.getAccountInfo();
      }else {
        this.manhinh = 'Edit';
        this.getAccountInfo();
      }
 
    });
  };
  detailInfo = null;
  getAccountInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify(this.detailAccount);
    this.apiService.getAccountInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);

      }
    })
  }

  chinhsua() {
    this.displayUserInfo = true;
    this.titleForm = {
      label: 'Cập nhật thông tin khách hàng',
      value: 'Edit'
    }
    this.getAccountInfo();
  }

  // handleChange(index) {
  //   this.indexTab = index;
  // }

  setAccountInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setAccountInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        if(this.isModal) {
          if(this.url === 'them-moi-tai-khoan') {
            this.goBack()
          }else {
            this.manhinh = 'Edit';
            this.getAccountInfo();
          }
        }else {
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
    if(this.isModal) {
      if(this.titlePage) {
        this.router.navigate(['/page-account']);
       }else {
        this.back.emit();
       }
    }else {
      this.back.emit();
    }
  }

  cancelUpdate() {
    if(this.detailAccount.account_no) {
      this.manhinh = 'Edit';
      this.getAccountInfo();
    }else {
      this.back.emit();
    }
  
  }


}

