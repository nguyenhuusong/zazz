import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring'
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AgGridFn } from 'src/app/utils/common/function-common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as numeral from 'numeral';
import { delay, forkJoin,Subject, takeUntil, tap, timer } from 'rxjs';
import { setCheckboxradiolistValue, setMembers, setMultiSelectValue, setSelectTreeValue, setValueAndOptions, setValueAndOptionsAutocomplete, setValueAndOptionsAutocompletes } from '../function-common/objects.helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmV2Service } from 'src/app/services/api-hrm/apihrmv2.service';
import { Router } from '@angular/router';
import { TYPESDATETIME } from './columnTypes';
import { ActionsNotSave, ActionsSave } from './action-types';
@Component({
  selector: 'app-edit-detail',
  templateUrl: './edit-detail.component.html',
  styleUrls: ['./edit-detail.component.scss']
})
export class EditDetailComponent implements OnInit, OnChanges {
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private apiServiceCore: ApiService,
    private apiHrmV2Service: ApiHrmV2Service,
    private changeDetech: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private router: Router,

  ) { }
  @Output() avatarUrl = new EventEmitter<any>();
  @Output() callback = new EventEmitter<any>();
  @Output() callbackcancel = new EventEmitter<any>();
  @Output() callbackDataInfo = new EventEmitter<any>();
  @Output() callback1 = new EventEmitter<any>();
  @Output() callBackForm = new EventEmitter<any>();
  @Output() callbackButton = new EventEmitter<any>();
  @Input() thongtinnhanvienNew: boolean = false;
  @Input() isUploadMultiple: boolean = true;
  @Input() isNested: boolean = false;
  @Input() manhinh;
  @Input() isHideButton: boolean = false;
  @Input() dataView = [];
  @Input() projects = [];
  @Input() idDetail = 'detail1';
  includeImage = false;
  @Input() paramsObject;
  @Input() detailInfo = null;
  @Input() isViewButtonTop = true;
  @Input() optionsEdit = null;
  @Input() menus = [];
  @Input() noDisableInput: boolean = false;
  @Input() isShowAvatar = false;

  buttonSave = 'Update';
  @Input() formTypeId: string = '';
  @Input() optionsButtonsEdit: any = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times-circle' },
    { label: 'Lưu lại', value: 'Update', class: '' }
  ];

  optionsButtonsEdit1: any = [
    { label: 'Bỏ qua', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times-circle' },
    { label: 'Lưu lại', value: 'Update', class: '' }
  ];
  @Input() modelMarkdow = {
    type: 1,
    content: '',
    attachs: [],
    attack: false,
    id: null
  };
  CONSTANTS_NOTIFY = {
    NOTIFICATION: 'Notification',
    SMS: 'SMS',
    EMAIL: 'Email',
    SUCCESS: 'success'
  };
  dropdownList = [
    { id: 'push', itemName: this.CONSTANTS_NOTIFY.NOTIFICATION },
    { id: 'sms', itemName: this.CONSTANTS_NOTIFY.SMS },
    { id: 'email', itemName: this.CONSTANTS_NOTIFY.EMAIL }
  ];
  @Input() detail;
  gridKey = '';
  displaySetting = false;
  listViews = [];
  detailInfoConfig = null;
  group_cd = '';
  displaySetting1 = false;
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  query = {
    filter: '',
    offset: 0,
    pageSize: 15,
    gridWidth: 0
  };
  modelFields = {};


  ngAfterViewInit() {
    this.changeDetech.detectChanges();
  }

  // tổ chức hiện tại được chọn
  organizeInfoServiceId = ''
  async ngOnInit(): Promise<void> {
    await this.getOrganizeInfoService();
    await this.callApiDrop();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  resetData(value) {
    this.callbackcancel.emit(value);
  }

  getDataInfo(data) {
    this.callbackDataInfo.emit(data);
  }

  submit = false
  dataViewNew = [];

  getOrganizeInfoService() {

  }

  callApiDrop() {
    const promissall = [];
    this.dataViewNew = cloneDeep(this.dataView);
    this.dataView = [];
    this.dataViewNew.forEach(element => {
      element.fields.forEach(element1 => {
        if ((element1.columnType === 'markdown') || (element1.columnType === 'chips') || (element1.columnType === 'linkUrl') || (element1.columnType === 'linkUrlDrag')) {
          const dataValidation = {
            key: `${element1.field_name}${element1.group_cd}`,
            isRequire: false,
            error: false,
            message: ''
          }
          this.modelFields[`${element1.field_name}${element1.group_cd}`] = dataValidation
        } else {
          const dataValidation = {
            key: `${element1.field_name}${element1.group_cd}`,
            isRequire: element1.isVisiable && !element1.isEmpty && element1.isRequire ? true : false,
            error: element1.isVisiable && !element1.isDisable && !element1.isEmpty && element1.isRequire && (element1.columnValue === null || element1.columnValue === "") ? true : false,
            message: element1.isVisiable && !element1.isDisable && !element1.isEmpty && element1.isRequire && (element1.columnValue === null || element1.columnValue === "") ? 'Trường bắt buộc nhập !' : ''
          }
          this.modelFields[`${element1.field_name}${element1.group_cd}`] = dataValidation
        }
        if (element1.columnType === 'select' || element1.columnType === 'members' || element1.columnType === 'dropdown' || element1.columnType === 'selectTree' || element1.columnType === 'selectTrees'
          || element1.columnType === 'checkboxList' || element1.columnType === 'checkboxradiolist'
          || element1.columnType === 'multiSelect' || element1.columnType === 'autocomplete' || element1.columnType === 'autoCompletes') {
          if (element1.columnObject) {
            if (element1.columnType === 'selectTree' || element1.columnType === 'selectTrees') {
              promissall.push(this.apiHrmV2Service.getCustObjectListTreeV2(element1.columnObject, `${element1.field_name}${element1.group_cd}`));
            } else if (element1.columnType === 'autocomplete') {
              promissall.push(this.apiHrmV2Service.getAutocompleteLinkApiV2(element1.columnObject, `${element1.field_name}${element1.group_cd}`));
            }else if (element1.columnType === 'autoCompletes') {
              promissall.push(this.apiHrmV2Service.getAutocompleteLinkApiV2s(element1.columnObject, `${element1.field_name}${element1.group_cd}`));
            } else {
              promissall.push(this.apiHrmV2Service.getCustObjectListV2(element1.columnObject, `${element1.field_name}${element1.group_cd}`));
            }
          } else {
            if (element1.columnType === 'members') {
              const queryParams = queryString.stringify({ ftUserId: element1.columnValue });
              promissall.push(this.apiHrmV2Service.getEmployeeSearchGetUserIdV2(queryParams, `${element1.field_name}${element1.group_cd}`));
            }
          }
        }else if(element1.columnType === 'chips') {
          element1.columnValue = element1.columnValue && typeof element1.columnValue === 'string' ? element1.columnValue.split(',') : []
        }else if (TYPESDATETIME.indexOf(element1.columnType) > -1) {
          element1.columnValue = element1.columnValue ? new Date(this.convesrtDate(element1.columnValue)) : ''
        }
      });
    });
    if (promissall.length > 0) {
      this.spinner.show();
      forkJoin(promissall.filter(d => d !== undefined))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((results: any) => {
          const responses = results.filter(d => d !== undefined);
          this.spinner.hide();
          this.dataViewNew.forEach(element => {
            element.fields.forEach(element1 => {
              if (responses.map(d => d.key).indexOf(`${element1.field_name}${element1.group_cd}`) > -1) {
                if (element1.columnType === 'autocomplete' ) {
                  const datas = responses.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
                  setValueAndOptionsAutocomplete(element1, datas[0].result);
                }else if (element1.columnType === 'autoCompletes') {
                  const datas = responses.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
                  setValueAndOptionsAutocompletes(element1, datas[0].result);
                }  else if (element1.columnType === 'checkboxradiolist') {
                  const datas = responses.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
                  setCheckboxradiolistValue(element1, datas[0].result)
                } else if ((element1.columnType === 'selectTree') || (element1.columnType === 'selectTrees')) {
                  const datas = responses.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
                  setSelectTreeValue(element1, datas[0].result);
                } else if (element1.columnType === 'multiSelect') {
                  const datas = responses.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
                  setMultiSelectValue(element1, datas[0].result)
                } else if (element1.columnType === 'members') {
                  const datas = responses.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
                  // element1.columnValue = datas[0].result
                  // this.changeDetech.detectChanges();
                  setMembers(element1, datas[0].result)
                } else {
                  const datas = responses.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
                  setValueAndOptions(element1, datas[0].result);
                }
              }
            })
          })
          this.dataView = [...this.dataViewNew];
        });
    } else {
      this.spinner.hide();
      this.dataView = [...this.dataViewNew];
    }
  }

  convesrtDate(value: string) {
    const cutString = value.split(' ');
    console.log(cutString)
    const stringDate = cutString[0].split('/');
    if(cutString.length > 1) {
      return `${stringDate[2]}-${stringDate[1]}-${stringDate[0]} ${cutString[1]}`
    }else {
      return `${stringDate[2]}-${stringDate[1]}-${stringDate[0]}`
    }
  }

  getNode(item) {
    return {
      label: item.formTypeName || item.formTypeId,
      data: item.formTypeId,
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder",
      children: item.children
    };
  }

  getValueByKey(key) {
    if (this.dataViewNew && this.dataViewNew.length > 0) {
      let value = ''
      for (let i = 0; i < this.dataViewNew.length; i++) {
        for (let j = 0; j < this.dataViewNew[i].fields.length; j++) {
          if (this.dataViewNew[i].fields[j].field_name === key) {
            value = this.dataViewNew[i].fields[j].columnValue;
            break;
          }
        }
      }
      return value
    }
  }


  onChangeButtonEdit(event) {
    if (ActionsSave.indexOf(event) > -1) {
      this.submit = true;
      for (let item in this.modelFields) {
        if (this.modelFields[item].error) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Dữ liệu thiếu !' });
          return
        }
      }
      let group_fields = cloneDeep(this.dataView)
      this.callbackform(group_fields, event)
    }else if(ActionsNotSave.indexOf(event) > -1) {
      let group_fields = cloneDeep(this.dataView)
      this.callbackform(group_fields, event)
    } else if (event === 'TamTinh') {
      this.submit = true;
      for (let item in this.modelFields) {
        if (this.modelFields[item].error) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Dữ liệu thiếu !' });
          return
        }
      }
      this.submit = false;
      let group_fields = cloneDeep(this.dataView)
      this.callbackform(group_fields, 'TamTinh')
    } else if (event === 'ReHire') {
      this.callbackButton.emit({ type: 'rehire', data: null });
    } else if (event === 'ADDROW') {
      let group_fields = cloneDeep(this.dataView)
      this.callbackform(group_fields, 'ADDROW');
    } else if(event === 'Close') {
      this.callbackcancel.emit('Close')
    } else {
      this.cancel(event);
    }
  }

  onChangeIsSpecial($event) {
    let group_fields = cloneDeep(this.dataView)
    this.callbackform(group_fields, 'IsSpecial');
  }


  callbackform(group_fields, type) {
    group_fields.forEach(results => {
      results.fields.forEach(data => {
        if (data.columnType === 'datetime' && data.isVisiable) {
          if (data.columnValue) {
            data.columnValue = typeof data.columnValue === 'string' ? data.columnValue : moment(data.columnValue).format('DD/MM/YYYY');
          } else {
            data.columnValue = data.columnValue;
          }
        } else if (data.columnType === 'datefulltime' && data.isVisiable) {
          if (data.columnValue) {
            data.columnValue = typeof data.columnValue === 'string' ? data.columnValue : moment(data.columnValue).format('DD/MM/YYYY HH:mm:ss');
          } else {
            data.columnValue = data.columnValue;
          }
        } else if (data.columnType === 'timeonly') {
          data.columnValue = typeof data.columnValue === 'string' ? `${data.columnValue}:00` : moment(data.columnValue).format('HH:mm');
          // data.columnValue = typeof data.columnValue === 'string' ? `${data.columnValue}:00` : null;
        } else if (data.columnType === 'selectTree') {
          data.columnValue = data.columnValue ? data.columnValue.orgId : null;
          delete data.options;
        }  else if (data.columnType === 'autoCompletes') {
          data.columnValue = data.columnValue &&  data.columnValue.length > 0 ? data.columnValue.map(d => d.code).toString() : null;
          delete data.options;
        } else if (data.columnType === 'selectTrees') {
          data.columnValue = data.columnValue && data.columnValue.length > 0 ? data.columnValue.map(d => d.orgId).toString() : null;
          delete data.options;
        } else if (data.columnType === 'currency') {
          data.columnValue = numeral(data.columnValue).value()
        } else if (data.columnType === 'members') {
          delete data.options;
        } else if (data.columnType === 'linkUrlDrag' || data.columnType === 'listMch') {
          data.columnValue = (data.columnValue && data.columnValue.length) > 0 ? data.columnValue.toString() : '';
        } else if ((data.columnType === 'select' || data.columnType === 'multiSelect' || data.columnType === 'dropdown' || data.columnType === 'checkboxList') && data.options) {
          if (data.columnType === 'multiSelect') {
            if (data.columnValue && data.columnValue.length > 0) {
              // data.columnValue = data.columnValue.map(d => d.code);
              data.columnValue = data.columnValue.toString()
            } else {
              data.columnValue = null;
            }
            delete data.options;

          } else if (data.columnType === 'checkboxList') {
            if (data.columnValue && data.columnValue.length > 0) {
              data.columnValue = data.columnValue.toString();
            }
            delete data.options;
          } else {
            data.columnValue = data.columnValue;
            delete data.options;

          }
        } else if (data.columnType === 'chips') {
          data.columnValue = data.columnValue ? data.columnValue.toString() : '';
        } else if (data.columnType === 'onOff') {
          data.columnValue = data.columnValue ? "1" : "0"
        } else {
          data.columnValue = data.columnValue;
          if (data.columnType === 'number' && data.data_type === 'int') {
            data.columnValue = data.columnValue ? this.formatNumber(+data.columnValue) : 0;
            data.columnValue = numeral(data.columnValue).value();
          }
        }

      })
    });
    if (ActionsSave.indexOf(type) > -1) {
      if(type === 'Update' || type ==='newUpdate') {
        this.callback.emit(group_fields);
      }else {
        this.callback.emit({
          datas: group_fields,
          event: type
        });
      }
    }else if(ActionsNotSave.indexOf(type) > -1) {
      this.callback.emit({
        datas: group_fields,
        event: type
      });
    } else if (type === 'SaveNhap' || type === 'Submit' || 'IsSpecial' || 'ADDROW') {
      this.callBackForm.emit({ data: group_fields, type: type })
    } else {
      this.callback1.emit(group_fields);
    }
  }

  formatNumber(value) {
    return numeral(value).format('0,0[.][00]');
  }

  cancel(event) {
    this.callbackcancel.emit(event);
  }

  CauHinh() {
    console.log(this.detail.tableKey)
    this.gridKey = this.detail.tableKey
    this.displaySetting = true;
  }

  callbackConfigGridTanle(event) {
    this.group_cd = event;
    this.getGroupInfo();
  }

  getGroupInfo() {
    const queryParams = queryString.stringify({ group_key: this.detail.groupKey, group_cd: this.group_cd });
    this.apiServiceCore.getGroupInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfoConfig = results.data;
          this.displaySetting1 = true;
        }
      });
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setGroupInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfoConfig, group_fields: data
    }
    this.apiServiceCore.setGroupInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.displaySetting1 = false;
          // this.load();
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

  avatarUrlCallback(url) {
    this.avatarUrl.emit(url);
  }

  memberGetQuery(event) {
    // this.getHrmMeetingPerson(element, event, organizeId, orgId )
  }

  getFilesDrag(event) {
    this.callback1.emit(event);
  }

  quaylai(data) {
    this.displaySetting1 = false;
  }

  getValueTree(event) {
    this.dataView = cloneDeep(event)
  }

  emitChipsValue(event) {
    this.callback1.emit(event);
  }

}
