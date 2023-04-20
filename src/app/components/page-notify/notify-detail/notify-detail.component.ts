import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as queryString from 'querystring'
import { ApiService } from 'src/app/services/api.service';
import { cloneDeep } from 'lodash'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
declare var ace:any;
import showdown from 'showdown';
import { CheckHideAction } from 'src/app/common/function-common/common';
import { ACTIONS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';

import { Subject, takeUntil } from 'rxjs';
import { EmployeeSaveService } from 'src/app/services/employee-save.service';
@Component({
  selector: 'app-notify-detail',
  templateUrl: './notify-detail.component.html',
  styleUrls: ['./notify-detail.component.css']
})
export class NotifyDetailComponent implements OnInit {
  manhinh = 'Edit';
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  @Output() save = new EventEmitter<any>();
  optionsButon: any = [
    // { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times-circle' },
    { label: 'Lưu thông báo', value: 'Update', icon: 'pi pi-send',
    class: CheckHideAction(MENUACTIONROLEAPI.GetAppNotifyPage.url, ACTIONS.EDIT) ? 'hidden' : ''
    }
  ];
  indexTab = 0;
  notiId = null;
  tempId = null;
  external_sub = '';
  external_name = '';
  paramsObject = null;
  dataInfo = null;
  columnDefs = [];
  loading = false;
  titleForm;
  listViews = [];
  converter = new showdown.Converter();
  projectListSelects = [];
  modelMarkdow = {
    type: 2,
    content: '',
    attachs: [],
    attack: true,
    id: 0
  }
  contentTypes = [];
  displaySend = false;
  loadForm = false;
  displayStore = false;
  projects = [];
  notifyTempList = [];
  notifyTempId = null;
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private employeeSaveService: EmployeeSaveService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    
  ) { }
  items = [];
  titlePage = ''
  organSeleted = '';
  modelNotifyTo = {
    to_level: 0,
    to_groups: '',
    to_type: 0
  }
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách thông báo', routerLink: '/cai-dat/thong-bao/danh-sach-thong-bao' },
      { label: `${this.titlePage}` },
    ];

    if(localStorage.hasOwnProperty('RecruitMail') && localStorage.getItem('RecruitMail')) {
        const results = JSON.parse(localStorage.getItem('RecruitMail'));
        this.external_name = null;
        this.organSeleted = null;
        this.notiId = this.notiId;
        this.tempId = results.tempId;
        this.notifyTempId = results.tempId;
        this.modelNotifyTo.to_level = results.can_st,
        this.modelNotifyTo.to_groups = results.canIds,
        this.modelNotifyTo.to_type = 1
        this.getNotifyTempList('oRecruitment')
        this.getAppNotifyInfo();
    }else {
      this.modelNotifyTo.to_level = null,
      this.modelNotifyTo.to_groups = null,
      this.modelNotifyTo.to_type = 0;
      this.getNotifyTempList();
      this.handleParams();
    }






    // this.employeeSaveService.fetchAll().subscribe((results: any) => {
    //   if(results) {
    //     this.external_name = null;
    //     this.organSeleted = null;
    //     this.notiId = this.notiId;
    //     this.tempId = results.tempId;
    //     this.notifyTempId = results.tempId;
    //     this.modelNotifyTo.to_level = results.can_st,
    //     this.modelNotifyTo.to_groups = results.canIds,
    //     this.modelNotifyTo.to_type = 1
    //     this.getNotifyTempList('oRecruitment')
    //     this.getAppNotifyInfo();
    //   }else {
       
    //   }
    // })

  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  handleParams() {
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.notiId = this.paramsObject.params.notiId;
     
      this.external_sub = this.paramsObject.params.external_sub;
      this.external_name = this.paramsObject.params.external_name;
      this.tempId = this.paramsObject.params.tempId;
    
      this.modelMarkdow.id = this.notiId;
      this.getAppNotifyInfo();
    });
  };

  getAppNotifyInfo() {
    this.listViews = [];
    this.spinner.show();
    if(this.notiId){
      this.indexTab = 1;
    }
    const queryParams = queryString.stringify(
      { n_id: this.notiId, 
        external_sub: this.organSeleted, 
        tempId: this.tempId, 
        external_name: this.external_name 
      });
    this.apiService.getNotifyInfo(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.setItemByActionList();
        this.dataInfo = results.data;
        this.external_sub = this.dataInfo.external_sub;
        this.modelMarkdow.attachs =this.dataInfo.attachs && this.dataInfo.attachs.length ? this.dataInfo.attachs : []
        if (this.notiId == null) {
          this.manhinh = 'Edit';
          this.indexTab = this.indexTab;
        } else {
          this.manhinh = 'Edit';
          this.indexTab = this.indexTab;
        }
        this.spinner.hide();
      }
    })
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
          }else if(field.field_name === 'isPublish'  || field.field_name === 'content_markdown') {

            if(actionlistValueKey["email"] || actionlistValueKey["push"]){
              field.isVisiable = true;
            }else{
              field.isVisiable = false;
            }
          }else if(field.field_name === 'content_type') {
            this.modelMarkdow.type = field.columnValue
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

  handleChange(index) {
    if(this.indexTab === 0) {
      this.getAppNotifyInfo();
    }
    this.indexTab = index;
  }

  onChangeButtonView(event) {
    this.manhinh = event.value;
    this.getAppNotifyInfo();
  }

  cancelUpload(event) {
    if(event === 'CauHinh') {
      this.getAppNotifyInfo();
    }else {
      this.router.navigate(['/cai-dat/thong-bao/danh-sach-thong-bao'])

    }
  }

  displayDsThongBao(data) {
    if (data === 'hide') {
      this.displaySend = false;
    } else {
      this.displaySend = true;
    }
    this.loadForm = false;
  }


  backpageSend() {
    this.displaySend = false;
    this.loadForm = true;
  }

  displayDsCaiDatDS(data) {
    if (data === 'List') {
      // this.save.emit()
      this.router.navigate(['/cai-dat/thong-bao'])
    } else {
      this.displayStore = true;
      this.loadForm = false;
    }

  }

  backpagestore() {
    this.displayStore = false;
    this.loadForm = true;
  }

  deleteRooms(data) {
    this.loadForm = false;
    if (data.length > 0) {
      this.confirmationService.confirm({
        message: 'Bạn chắc chắn muốn thực hiện hành động này',
        accept: () => {
          const params = {
            ids: data.map(t => t.id)
          };
          this.apiService.delNotifyPushs(params)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(results => {
            if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Thành công' });
              this.loadForm = true;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message ? results.message : 'Thất bại' });
            }
          })
        }
      })

    } else {
      this.confirmationService.confirm({
        message: 'Bạn chưa chọn nhân viên',
        rejectVisible: false,
        acceptLabel: 'Oke',
        accept: () => { }
      });
      return;
    }
  }

  saveNotifyInfo(data) {
    this.spinner.show();
    data.forEach(element => {
      element.fields.forEach(element1 => {
        if(element1.field_name === 'content_type') {
          element1.columnValue = this.modelMarkdow.type;
          data.forEach(a => {
            a.fields.forEach(b => {
              if (b.field_name === 'content_markdown') {
                if(element1.columnValue == 2) {
                  b.columnValue =b.columnValue ? this.converter.makeHtml(b.columnValue) : '';
                }else {
                  b.columnValue = b.columnValue;
                }
              }else if (b.field_name === 'content_email'){
                b.columnValue =b.columnValue ? this.converter.makeHtml(b.columnValue) : '';
              }
            });
          });
      }
      });
    });
    console.log(this.modelMarkdow.attachs)
    const params = {
      ...this.dataInfo,
      group_fields: data,
      attachs: this.modelMarkdow.attachs.map(data1 => {
        return {
          attach_name: data1.attach_name,
          attach_url: data1.attach_url,
          id: data1.id,
          notiId: this.dataInfo.notiId,
          attach_type: data1.attach_type
        }
      }),
    }
    this.apiService.setNotifyInfo(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data.messages ? results.data.messages : 'Thành công' });
        this.spinner.hide();
        this.notiId = results.data.id;
       setTimeout(() => {
        const s: HTMLElement = document.querySelector('.thongtincaiDat');
        console.log(s)
        s.click();
       }, 500);
      }
    })
  }

  getNotifyTempList(source_key = null) {
    const queryParams = queryString.stringify( {source_key: source_key });
    this.apiService.getNotifyTempList(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.notifyTempList = results.data.map(res => {
          return {
            label: `${res.name}`,
            value: res.value
          }
        });
      }
    });
  }

  changeNotiTem() {
    this.tempId = this.notifyTempId;
    this.getAppNotifyInfo();
  }

}

