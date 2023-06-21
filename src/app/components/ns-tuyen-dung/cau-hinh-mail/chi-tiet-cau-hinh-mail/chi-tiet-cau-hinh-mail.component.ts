import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import queryString from 'query-string';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { setOrganizeId } from 'src/app/utils/common/function-common';
@Component({
  selector: 'app-chi-tiet-cau-hinh-mail',
  templateUrl: './chi-tiet-cau-hinh-mail.component.html',
  styleUrls: ['./chi-tiet-cau-hinh-mail.component.scss']
})
export class ChiTietCauHinhMailComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  paramsObject = null;
  detailInfo = null
  listViews = [];
  optionsButon = [
    { label: 'Lưu lại', value: 'Update', class: CheckHideAction(MENUACTIONROLEAPI.GetPayrollAppInfoPage.url, ACTIONS.EDIT_TINH_LUONG_THIET_LAP_THAM_SO) ? 'hidden' : '', icon: 'pi pi-check' },
    { label: 'Đóng', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
  ];
  titlePage = '';
  configData = [];
  organIdSelected = '';
  @Input() idForm: string = null;
  @Output() detailOut = new EventEmitter<any>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    
    private router: Router
  ) { }
  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.getDetail();
  }

  getDetail() {
    this.listViews = []
    const queryParams = queryString.stringify({tempId: this.idForm});
    this.apiService.getRecruitMailInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = cloneDeep(listViews);
          this.detailInfo = results.data;
          this.getConfigData();
          this.listViews = setOrganizeId(this.listViews, 'organizeId', this.organIdSelected );
          this.setItemByActionList();
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

  quaylai(data) {
    if(data === 'CauHinh') {
      this.getDetail();
    }else {
      this.detailOut.emit();
    }
  }

  handleSave(event) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: event
    };
    this.apiService.setRecruitMailInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.detailOut.emit();
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this.spinner.hide();
        }
      }), error => {
        console.error('Error:', error);
        this.spinner.hide();
      };
  }

  getTextConfig(text){
    navigator.clipboard.writeText('[' + text +']').then( d => {
      this.messageService.add({ key: 'bc', severity: 'success', summary: 'Thông báo', detail: 'Đã copy' });
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  // type noti binding 
  setItemByActionList() {
    let actionlistValue = this.getValueField(this.listViews, 'actionlist');
    let actionlistValueKey: any = {}
    if(actionlistValue) {
      let actionlistValueArr = actionlistValue.split(',');
      if(actionlistValueArr && actionlistValueArr.length > 0 ){
        for(let i = 0; i < actionlistValueArr.length; i ++) {
          actionlistValueKey[actionlistValueArr[i]] = actionlistValueArr[i]
        }
      }
    }
    this.listViews.forEach( group => {
      group.fields.forEach(field => {
        if(field.field_name === 'content_notify') {
          if(actionlistValueKey["push"]){
            field.isVisiable = true;
          }else{
            field.isVisiable = false;
          }
        }else if(field.field_name === 'content_sms') { 
          if(actionlistValueKey["sms"]){
            field.isVisiable = true;
          }else{
            field.isVisiable = false;
          }
        }else if(field.field_name === 'content_email') { 
          if(actionlistValueKey["email"]){
            field.isVisiable = true;
          }else{
            field.isVisiable = false;
          }
        }
        else if(field.field_name === 'isPublish' || field.field_name === 'content_type'  || field.field_name === 'content_markdown') { 
          if(actionlistValueKey["email"] || actionlistValueKey["push"]){
            field.isVisiable = true;
          }else{
            field.isVisiable = false;
          }
        }
      });
    }); 
  }

  getValueField(datas, field_name) {
    let value = ''
    datas.forEach( group => {
      group.fields.forEach(field => {
        if(field.field_name === field_name) {
          value = field.columnValue;
        }
      });
    }); 
    return value;
  }

}


