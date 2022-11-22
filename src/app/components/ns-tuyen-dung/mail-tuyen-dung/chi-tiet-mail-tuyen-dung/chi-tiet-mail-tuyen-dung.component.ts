import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
const queryString = require('query-string');
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import showdown from 'showdown';
@Component({
  selector: 'app-chi-tiet-mail-tuyen-dung',
  templateUrl: './chi-tiet-mail-tuyen-dung.component.html',
  styleUrls: ['./chi-tiet-mail-tuyen-dung.component.scss']
})
export class ChiTietMailTuyenDungComponent implements OnInit, OnDestroy {
  converter = new showdown.Converter();
  items: MenuItem[] = [];
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
      { label: 'Tuyển dụng' },
      { label: 'Mail tuyển dụng', routerLink: '/tuyen-dung/mail-tuyen-dung' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }
  modelEdit = {
    mail_Id: null,
  }
  titlePage = '';
  configData = []
  
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.mail_Id = this.paramsObject.params.mail_Id || null
        this.getRecruitMailInfo();
      });
  };

  getRecruitMailInfo() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getRecruitMailInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.getConfigData();
        }
      });
  }

  getConfigData() {
    if(this.listViews && this.listViews.length > 0){
      this.listViews.forEach( field => {
        field.fields.forEach(element => {
          if(element.field_name === 'info_field') {
            if(element.columnValue) {
              this.configData = element.columnValue.split(',')
            }
          }
        });
      })
    }
  }

  getChipsValue(event) {
    this.configData = event
  }

  setRecruitMailInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setRecruitMailInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.router.navigate(['/tuyen-dung/mail-tuyen-dung']);
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
      this.getRecruitMailInfo();
    }else {
      this.router.navigate(['/tuyen-dung/mail-tuyen-dung']);
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

