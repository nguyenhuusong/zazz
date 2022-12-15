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
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { getFieldValueAggrid } from 'src/app/utils/common/function-common';
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
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times-circle' },
    { label: 'Lưu lại', value: 'Update', 
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
    type: 1,
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private organizeInfoService: OrganizeInfoService,
  ) { }
  items = [];
  titlePage = ''
  organSeleted = '';
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , routerLink: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách thông báo', routerLink: '/cai-dat/thong-bao/danh-sach-thong-bao' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
    this.getNotifyTempList();
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.notiId = this.paramsObject.params.notiId;
     
      this.external_sub = this.paramsObject.params.external_sub;
      this.external_name = this.paramsObject.params.external_name;
      this.tempId = this.paramsObject.params.tempId;
    
      this.modelMarkdow.id = this.notiId;

      this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        if(results){
          this.organSeleted = results
          this.getAppNotifyInfo();
        }
      });
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
    this.apiService.getNotifyInfo(queryParams).subscribe(results => {
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
            if(actionlistValueKey["notification"]){
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
            if(actionlistValueKey["email"]){
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

  cancelUpload() {
    this.router.navigate(['/cai-dat/thong-bao/danh-sach-thong-bao'])
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
      this.getModuleList()
      this.displayStore = true;
      this.loadForm = false;
    }

  }

  backpagestore() {
    this.displayStore = false;
    this.loadForm = true;
  }
  moduleLists = []
  getModuleList() {
    const queryParams = queryString.stringify({ filter: ''});
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        const moduleLists = results.data.map(d => {
          return {
            label: `${d.organizationName}`,
            value: d.organizeId,
            // code: d.organizeId,
          }
        });
        this.moduleLists = moduleLists
      }
    })
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
          this.apiService.delNotifyPushs(params).subscribe(results => {
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
        message: 'Bạn chưa chọn căn hộ vui lòng chọn nhân viên',
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
          data.forEach(a => {
            a.fields.forEach(b => {
              if (b.field_name === 'content_markdown') {
                if(element1.columnValue == 2) {
                  b.columnValue =b.columnValue ? this.converter.makeHtml(b.columnValue) : '';
                }else {
                  b.columnValue = b.columnValue;
                }
              }
            });
          });
      }else  if (element1.field_name === 'content_email') {
        data.forEach(a => {
          a.fields.forEach(b => {
            if (b.field_name === 'content_markdown') {
              element1.columnValue =b.columnValue ? this.converter.makeHtml(b.columnValue) : '';
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
    this.apiService.setNotifyInfo(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data.messages ? results.data.messages : 'Thành công' });
        this.spinner.hide();
        this.notiId = results.data.id;
        this.router.navigate(['/cai-dat/thong-bao/chi-tiet-thong-bao'], { queryParams: { notiId: results.data.id } });
        this.indexTab = 1;
        // this.getAppNotifyInfo();
      }
    })
  }

  getNotifyTempList() {
    this.apiService.getNotifyTempList().subscribe(results => {
      if (results.status === 'success') {
        this.notifyTempList = results.data.map(res => {
          return {
            label: `${res.tempName}`,
            value: res.tempId
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

