import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring'
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AgGridFn } from 'src/app/utils/common/function-common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as numeral from 'numeral';
import { delay, forkJoin, lastValueFrom, of, Subject, takeUntil, tap, timer } from 'rxjs';
import { findNodeInTree, setCheckboxradiolistValue, setMembers, setMultiSelectValue, setSelectTreeValue, setValueAndOptions, setValueAndOptionsAutocomplete } from '../function-common/objects.helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmV2Service } from 'src/app/services/api-hrm/apihrmv2.service';
import { OrganizeInfoService } from 'src/app/services/organize-info.service';
import { Router } from '@angular/router';
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
    private organizeInfoService: OrganizeInfoService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  @Output() callback = new EventEmitter<any>();
  @Output() callbackcancel = new EventEmitter<any>();
  @Output() callback1 = new EventEmitter<any>();
  @Output() callbackButton = new EventEmitter<any>();
  @Input() thongtinnhanvienNew: boolean = false;
  @Input() isUploadMultiple: boolean = true;
  @Input() isNested: boolean = false;
  @Input() manhinh;
  @Input() dataView = [];
  @Input() projects = [];
  includeImage = false;
  @Input() paramsObject;
  @Input() detailInfo = null;
  @Input() isViewButtonTop = true;
  @Input() optionsEdit = null;
  @Input() menus = [];
  @Input() noDisableInput: boolean = false;

  
  buttonSave = 'Update';
  @Input() formTypeId: string = '';
  @Input() optionsButtonsEdit: any = [
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
  submit = false
  dataViewNew = [];
  
  getOrganizeInfoService() {
    this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
      if(results && results.length>0){
        this.organizeInfoServiceId = results
      }
    });
  }
  callApiDrop() {
    const promissall = [];
    const source = timer(50);
    this.dataViewNew = cloneDeep(this.dataView);
    this.dataView = [];
    this.dataViewNew.forEach(element => {
      element.fields.forEach( element1 => {
        if ((element1.columnType === 'markdown') || (element1.columnType === 'chips') || (element1.columnType === 'linkUrl') || (element1.columnType === 'linkUrlDrag')) {
          console.log(element1.columnType === 'chips')
          const dataValidation = {
            key: element1.field_name,
            isRequire: false,
            error: false,
            message: ''
          }
          this.modelFields[element1.field_name] = dataValidation
        } else {
          const dataValidation = {
            key: element1.field_name,
            isRequire: element1.isVisiable && !element1.isEmpty && element1.isRequire ? true : false,
            error: element1.isVisiable && !element1.isDisable && !element1.isEmpty && element1.isRequire && (element1.columnValue === null) ? true : false,
            message: element1.isVisiable && !element1.isDisable && !element1.isEmpty && element1.isRequire && (element1.columnValue === null) ? 'Trường bắt buộc nhập !' : ''
          }
          this.modelFields[element1.field_name] = dataValidation
        }
        if (element1.columnType === 'select' || element1.columnType === 'dropdown' || element1.columnType === 'selectTree' || element1.columnType === 'selectTrees'
          || element1.columnType === 'checkboxList' || element1.columnType === 'checkboxradiolist'
          || element1.columnType === 'multiSelect' || element1.columnType === 'autocomplete' ) {
            if(element1.columnObject) {
              if(element1.columnType === 'selectTree' || element1.columnType === 'selectTrees') {
                promissall.push(this.apiHrmV2Service.getCustObjectListTreeV2(element1.columnObject, element1.field_name));
              }else if(element1.columnType === 'autocomplete'){
                promissall.push(this.apiHrmV2Service.getAutocompleteLinkApiV2(element1.columnObject, element1.field_name));
              }else {
                promissall.push(this.apiHrmV2Service.getCustObjectListV2(element1.columnObject, element1.field_name));
              }
            }
          }
      });
    });
    console.log(promissall)
    if (promissall.length > 0) {
    this.spinner.show();
      forkJoin(promissall.filter(d => d !== undefined)).subscribe((results: any) => {
        console.log(results)
        this.spinner.hide();
        this.dataViewNew.forEach(element => {
          element.fields.forEach(element1 => {
            if (results.map(d => d.key).indexOf(element1.field_name) > -1) {
              if (element1.columnType === 'autocomplete') {
                const datas = results.filter(d => d.key === element1.field_name);
                setValueAndOptionsAutocomplete(element1, datas[0].result);
              } else if (element1.columnType === 'checkboxradiolist') {
                const datas = results.filter(d => d.key === element1.field_name);
                setCheckboxradiolistValue(element1, datas[0].result)
              } else if ((element1.columnType === 'selectTree') || (element1.columnType === 'selectTrees')) {
                const datas = results.filter(d => d.key === element1.field_name);
                setSelectTreeValue(element1, datas[0].result)
              } else if (element1.columnType === 'multiSelect') {
                const datas = results.filter(d => d.key === element1.field_name);
                setMultiSelectValue(element1, datas[0].result)
              } else if (element1.columnType === 'members') {
                const datas = results.filter(d => d.key === element1.field_name);
                setMembers(element1, datas[0].result)
              } else {
                const datas = results.filter(d => d.key === element1.field_name);
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
    if (event === 'Update') {
      this.submit = true;
      for (let item in this.modelFields) {
        if (this.modelFields[item].error) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Dữ liệu thiếu !' });
          return
        }
      }
      // this.submit = false;
      let group_fields = cloneDeep(this.dataView)
      this.callbackform(group_fields, 'Update')
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
    } else {
      this.cancel(event);
    }
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
          data.columnValue = typeof data.columnValue === 'string' ?  `${data.columnValue}:00` : moment(data.columnValue).format('HH:mm');
          // data.columnValue = typeof data.columnValue === 'string' ? `${data.columnValue}:00` : null;
        } else if (data.columnType === 'selectTree') {
          data.columnValue = data.columnValue ? data.columnValue.data : null;
          delete data.options;
        }else if (data.columnType === 'selectTrees') {
          data.columnValue = data.columnValue && data.columnValue.length > 0 ? data.columnValue.map(d => d.orgId).toString() : null;
          delete data.options;
        } else if (data.columnType === 'currency') {
          data.columnValue = numeral(data.columnValue).value()
        } else if (data.columnType === 'members') {
          delete data.options;
        }else if (data.columnType === 'linkUrlDrag' || data.columnType === 'listMch') {
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
        }else if( data.columnType === 'chips') {
          data.columnValue = data.columnValue.toString();
        }else if(data.columnType === 'onOff'){
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
    if (type === 'Update') {
      this.callback.emit(group_fields);
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
