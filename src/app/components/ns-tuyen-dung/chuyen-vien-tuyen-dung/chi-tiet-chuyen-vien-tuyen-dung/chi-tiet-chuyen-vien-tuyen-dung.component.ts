import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { CheckHideAction } from 'src/app/common/function-common/common';

@Component({
  selector: 'app-chi-tiet-chuyen-vien-tuyen-dung',
  templateUrl: './chi-tiet-chuyen-vien-tuyen-dung.component.html',
  styleUrls: ['./chi-tiet-chuyen-vien-tuyen-dung.component.scss']
})
export class ChiTietChuyenVienTuyenDungComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];

  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetAnnualAddPage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check'  }
  ]
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Tuyển dụng' },
      { label: 'Vị trí tuyển dụng', routerLink: '/tuyen-dung/vi-tri-tuyen-dung' },
      { label: 'Chuyên viên tuyển dụng', routerLink: '/tuyen-dung/chuyen-vien-tuyen-dung' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }
  modelEdit = {
    id: "",
  }
  titlePage = ''
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.id = this.paramsObject.params.id || ""
        this.getUserHiringInfo();
      });
  };

  getUserHiringInfo() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getUserHiringInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }

  setUserHiringInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setUserHiringInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.router.navigate(['/tuyen-dung/chuyen-vien-tuyen-dung']);
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        this.spinner.hide();
      };
  }

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getUserHiringInfo();
    }else {
      this.router.navigate(['/tuyen-dung/chuyen-vien-tuyen-dung']);
    }
  }

  cloneListViews = []
  callBackForm(event) {
    if (event.type === 'IsSpecial') {
      const params = {
        ...this.detailInfo, group_fields: event.data
      }
      this.cloneListViews = cloneDeep(event.data);
      this.listViews = [];
      this.setUserHiringDraft(params);
    } 
  }


  setUserHiringDraft(params: any) {
    this.spinner.show();
    this.apiService.setUserHiringDraft(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.spinner.hide();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        this.spinner.hide();
      };
  }

}

