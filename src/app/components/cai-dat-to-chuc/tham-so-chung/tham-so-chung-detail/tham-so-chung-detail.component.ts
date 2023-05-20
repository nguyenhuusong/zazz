import { Component, OnChanges, OnInit } from '@angular/core';
import queryString from 'query-string';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-tham-so-chung-detail',
  templateUrl: './tham-so-chung-detail.component.html',
  styleUrls: ['./tham-so-chung-detail.component.scss']
})
export class ThamSoChungDetailComponent implements OnInit, OnChanges {
  manhinh = 'View';
  optionsButtonsView = [
    { label: 'Lưu', value: 'Update',  class: CheckHideAction(MENUACTIONROLEAPI.GetParameterPage.url, ACTIONS.EDIT) ? 'hidden' : ''},
    { label: 'Quay lại', value: 'Back', class: 'p-button-secondary' }];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) { }
  id = null
  listViews = []
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  titlePage: string = '';
  url: string = '';
  items = [];
  detailInfo = null;
  ngOnChanges() {
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ', routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: `${this.titlePage}` },
    ];
    this.url = this.activatedRoute.data['_value'].url;
    this.manhinh = 'Edit';
    this.handleParams();

  }

  handleParams() {
    this.activatedRoute.params
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(params => {
      this.id = params.id === 'null' ? '' : params.id;
      this.getInvParameter();
    });
  };
  getInvParameter() {
    this.listViews = [];
    const queryParams = queryString.stringify({ id: this.id });
    this.apiService.getInvParameter(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
      }
    })
  }

  setInvParameter(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setInvParameter(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.goBack()
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: `${this.id ? 'Cập nhật ' : 'Thêm mới '} thông tin thành công` });
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
    this.router.navigate(['/cai-dat/tham-so-chung']);
  }

  cancelUpdate(e) {
    this.goBack();
  }
}