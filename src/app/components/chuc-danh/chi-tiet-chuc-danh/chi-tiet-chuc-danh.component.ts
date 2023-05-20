import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import queryString from 'query-string';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chi-tiet-chuc-danh',
  templateUrl: './chi-tiet-chuc-danh.component.html',
  styleUrls: ['./chi-tiet-chuc-danh.component.scss']
})
export class ChiTietChucDanhComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Lưu', value: 'Update',class: CheckHideAction(MENUACTIONROLEAPI.GetOrganizePage.url, ACTIONS.EDIT) ? 'hidden' : '' },
  { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  positionTitleId = null
  organizeId = null
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
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
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
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.positionTitleId = this.paramsObject.params.positionTitleId || null;
      this.organizeId	 = this.paramsObject.params.organizeId || null	;
      this.getPositionTitleInfo();
    });
  };

  detailInfo = null;
  getPositionTitleInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({positionTitleId: this.positionTitleId, organizeId	: this.organizeId	});
    this.apiService.getPositionTitleInfo(queryParams)
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

  setPositionTitleInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setPositionTitleInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
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
      this.getPositionTitleInfo();
    }else {
      this.goBack();
    }
  }


}


