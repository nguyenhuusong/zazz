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
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { getValueOfField, setOrganizeId } from 'src/app/utils/common/function-common';

@Component({
  selector: 'app-chi-tiet-vi-tri-tuyen-dung',
  templateUrl: './chi-tiet-vi-tri-tuyen-dung.component.html',
  styleUrls: ['./chi-tiet-vi-tri-tuyen-dung.component.scss']
})
export class ChiTietViTriTuyenDungComponent implements OnInit, OnDestroy {
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
    private organizeInfoService: OrganizeInfoService,
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
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
   
  }
  modelEdit = {
    vacancyId: null,
  }
  titlePage = '';
  isCopy = false;
  organIdSelected = '';
  handleParams() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        this.modelEdit.vacancyId = this.paramsObject.params.vacancyId || null;
        this.isCopy = this.paramsObject.params.copy;
        if(this.isCopy) {
          this.getVacancyReplicationInfo();
        }else{
          this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
            if(results && results.length>0){
              this.getVacancyInfo();
              this.organIdSelected = results;
            } 
          });
        }
      });
  };

  getVacancyReplicationInfo() {
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getVacancyReplicationInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.setValueByCurrencyType();
        }
      });
  }

  setValueByCurrencyType() {
    let fieldValue = getValueOfField(this.listViews, 'currency_type');
    this.listViews.forEach( group => {
      group.fields.forEach(field => {
        if(field.field_name === 'salary_from') {
          if(parseInt(fieldValue) === 2){
            field.isVisiable = true;
          }else{
            field.isVisiable = false;
          }
        }else if(field.field_name === 'salary_to') { 
          if(parseInt(fieldValue) === 3){
            field.isVisiable = true;
          }else{
            field.isVisiable = false;
          }
        }else if(field.field_name === 'currency') { 
          if(parseInt(fieldValue) === 4){
            field.isVisiable = false;
          }else{
            field.isVisiable = true;
          }
        }
      });
    }); 
  }


  getVacancyInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify(this.modelEdit);
    this.apiService.getVacancyInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.listViews = setOrganizeId(this.listViews, 'organizeId', this.organIdSelected);
          this.detailInfo = results.data;
          this.setValueByCurrencyType();
        }
      });
  }

  setVacancyInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setVacancyInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.router.navigate(['/tuyen-dung/vi-tri-tuyen-dung']);
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
      this.getVacancyInfo();
    }else {
      this.router.navigate(['/tuyen-dung/vi-tri-tuyen-dung']);
    }
  }

}

