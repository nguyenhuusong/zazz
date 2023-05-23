
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import queryString from 'query-string';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { CheckHideAction } from 'src/app/common/function-common/common';
@Component({
  selector: 'app-chi-tiet-nghi-khong-luong',
  templateUrl: './chi-tiet-nghi-khong-luong.component.html',
  styleUrls: ['./chi-tiet-nghi-khong-luong.component.scss']
})
export class ChiTietNghiKhongLuongComponent implements OnInit, OnDestroy {
  @Input() id = '';
  @Input() empId = '';
  @Output() callback = new EventEmitter
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
      { label: 'Chấm công' },
      { label: 'Danh sach nghỉ không lương', routerLink: '/chinh-sach/nghi-khong-luong' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }
  modelEdit = {
    id: "",
    empId: null
  }
  titlePage = ''
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.id = this.id || ""
        this.modelEdit.empId = this.empId || ""
        this.getLeaveLack();
      });
  };

  getLeaveLack() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getLeaveLack(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
        }
      });
  }

  setLeaveLack(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setLeaveLack(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.callback.emit();
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
      this.getLeaveLack();
    }else {
      this.callback.emit();
    }
  }

}

