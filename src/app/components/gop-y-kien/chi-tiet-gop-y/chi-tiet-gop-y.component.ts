import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-chi-tiet-gop-y',
  templateUrl: './chi-tiet-gop-y.component.html',
  styleUrls: ['./chi-tiet-gop-y.component.scss']
})
export class ChiTietGopYComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  manhinh = 'Edit';
  indexTab = 0;
  optionsButon = [{ label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },];
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
  feedbackId = null
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
      { label: 'Danh sách góp ý', routerLink: '/gop-y' },
      { label: this.titlePage },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
      this.handleParams()
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.feedbackId = this.paramsObject.params.feedbackId;
        this.getFeedbackInfo();
    });
  };

  getFeedbackInfo() {
    this.listViews = [];
    this.listsData = [];
    const queryParams = queryString.stringify(this.paramsObject.params);
    this.apiService.getFeedbackInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  setCompanyInfo(data) {
    // const params = {
    //   ...this.detailInfo, group_fields: data
    // };
    // this.apiService.setCompanyInfo(params).subscribe((results: any) => {
    //   if (results.status === 'success') {
    //     this.displayUserInfo = false;
    //     if(this.url === 'them-moi-nghi-phep') {
    //       this.goBack()
    //     }else {
    //       this.manhinh = 'Edit';
    //       this.getCompanyInfo();
    //     }
    //     this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
    //   } else {
    //     this.messageService.add({
    //       severity: 'error', summary: 'Thông báo', detail: results.message
    //     });
    //   }
    // }, error => {
    // });
  }


  onChangeButtonView(event) {
    this.manhinh = event.value;
    if (event.value === 'Back') {
      this.goBack();
    }
  }

  goBack() {
    if (this.titlePage) {
      this.router.navigate(['/gop-y']);
    } else {
      this.back.emit();
    }
  }

  cancelUpdate() {
    this.router.navigate(['/gop-y']);
  }

}



