import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { AgGridFn, CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chi-tiet-qt-thay-doi-luong',
  templateUrl: './chi-tiet-qt-thay-doi-luong.component.html',
  styleUrls: ['./chi-tiet-qt-thay-doi-luong.component.scss']
})
  export class ChiTietQTThayDoiLuongComponent implements OnInit {
    items: any = [];
    paramsObject = null;
    detailInfo = null
    listViews = [];
    optionsButon = [
      { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
      { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetVacancyPage.url, ACTIONS.EDIT) ? 'hidden' : '', icon: 'pi pi-check'  }
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
        { label: 'Quản lý nhân sự' },
        { label: 'Quá trình thay đổi lương', routerLink: '/nhan-su/qua-trinh-thay-doi-luong' },
        { label: `${this.titlePage}` },
      ];
      this.handleParams();
    }
    modelEdit = {
      Id: null,
    }
    titlePage = '';
    configData = []
    
    handleParams() {
      this.activatedRoute.queryParamMap
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((params) => {
          this.paramsObject = { ...params.keys, ...params };
          this.modelEdit.Id = this.paramsObject.params.Id || null
          this.getSalaryInfoDevM();
        });
    };
  
    getSalaryInfoDevM() {
      const queryParams = queryString.stringify(this.modelEdit);
      this.apiService.getSalaryInfoDevM(queryParams)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(results => {
          if (results.status === 'success') {
            const listViews = cloneDeep(results.data.group_fields);
            this.listViews = [...listViews];
            this.detailInfo = results.data;
          }
        });
    }
    
    setSalaryInfoDevM(data) {
      this.spinner.show();
      const params = {
        ...this.detailInfo, group_fields: data
      }
      this.apiService.setSalaryInfoDevM(params)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.spinner.hide();
            this.router.navigate(['/nhan-su/qua-trinh-thay-doi-luong']);
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
        this.getSalaryInfoDevM();
      }else {
        this.router.navigate(['/nhan-su/qua-trinh-thay-doi-luong']);
      }
    }
  
    getTextConfig(text){
      navigator.clipboard.writeText('[' + text +']').then( d => {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Thông báo', detail: 'Đã copy' });
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    }
  
  }
  
  
