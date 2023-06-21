
import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import queryString from 'query-string';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chi-tiet-cap-bac',
  templateUrl: './chi-tiet-cap-bac.component.html',
  styleUrls: ['./chi-tiet-cap-bac.component.scss']
})
export class ChiTietCapBacComponent implements OnInit, OnChanges {
  @Input() positionType = null;
  @Output() callback = new EventEmitter<any>();
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
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
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
    // this.titlePage =  this.activatedRoute.data['_value'].title;
    // this.items = [
    //   { label: 'Trang chủ' , routerLink: '/home' },
    //   { label: 'Cài đặt' },
    //   { label: 'Danh sách cấp bậc', routerLink: '/cai-dat/danh-sach-cap-bac' },
    //   { label: `${this.titlePage}` },
    // ];
    // this.url = this.activatedRoute.data['_value'].url;
    // this.manhinh = 'Edit';
    // this.handleParams();
    this.getPositionTypeInfo();

  }

  handleParams() {
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.dataRouter = this.paramsObject.params;
      this.positionType = this.paramsObject.params.positionType || 0;
      this.getPositionTypeInfo();
    });
  };

  detailInfo = null;
  getPositionTypeInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({positionType: this.positionType});
    this.apiService.getPositionTypeInfo(queryParams)
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

  setPositionTypeInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setPositionTypeInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((results: any) => {
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
    this.router.navigate(['/cai-dat/danh-sach-cap-bac']);
   }else {
    this.back.emit();
   }
  }

  cancelUpdate(data) {
    if(data === 'CauHinh') {
      this.getPositionTypeInfo();
    }else {
      this.goBack();
    }
  }


}



