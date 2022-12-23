import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as numeral from 'numeral';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ApiHrmV2Service } from 'src/app/services/api-hrm/apihrmv2.service';
import { ApiService } from 'src/app/services/api.service';
import { setCheckboxradiolistValue, setMembers, setMultiSelectValue, setSelectTreeValue, setValueAndOptions, setValueAndOptionsAutocomplete } from '../function-common/objects.helper';
const queryString = require('query-string');
@Component({
  selector: 'app-form-filter',
  templateUrl: './form-filter.component.html',
  styleUrls: ['./form-filter.component.scss']
})
export class FormFilterComponent implements OnInit, OnChanges {
  @Input() position = 'absolute';
  @Input() styleButton = {
    right: '67px',
    'z-index': 1,
    top: '0px'
  };
  styleButton1 = {
    right: '50px',
    'z-index': 1,
    top: '20px'
  };
  constructor(
    private apiHrmV2Service: ApiHrmV2Service,
    private apiService: ApiService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    // public ref: DynamicDialogRef,
    // public config: DynamicDialogConfig
  ) { }
  @Output() callback = new EventEmitter<any>();
  @Output() callbackcancel = new EventEmitter<any>();
  @Output() callbackupload = new EventEmitter<any>();
  @Output() callbackDropdown = new EventEmitter<any>();
  @Output() callbackclickgrid = new EventEmitter<any>();
  @Output() callback1 = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Input() manhinh;
  @Input() optionsButtonsEdit: any[] = [
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-plus', disabled: false }
  ];
  buttonSave = 'Update'
  dataView = []
  @Input() listsData;
  @Input() columnDefs;
  @Input() units = [];
  @Input() projects = [];
  @Input() paramsObject;
  @Input() modelMarkdow = {
    type: 1,
    content: '',
    attachs: [],
    attack: false,
    id: 0
  };
  detail = null;
  query = {
    filter: '',
    offset: 0,
    pageSize: 20,
    gridWidth: 0
  };
  @Output() avatarUrl = new EventEmitter<any>();
  includeImage = false;
  modelFields = {};
  ngOnInit(): void {
    this.callApiDrop();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataView && this.dataView && this.dataView.length) {
      this.dataView.forEach(group => {
        const image = group.fields.filter(t => t.columnType === 'image');
        if (image.length > 0) {
          this.includeImage = true;
          return;
        }
      })
    }
  }

  OnClick(event) {
    this.callbackclickgrid.emit(event)
  }


  showPopupUploadCard() {
    this.callbackupload.emit();
  }
  @Input() listFields = [];
  @Input() detailInfoFilter = null;
  @Input() buttonsFilters = [];
  callApiDrop() {
    this.detail = {...this.detailInfoFilter};
    const dataView = cloneDeep(this.listFields);
    const promissall = []
    dataView.forEach(element => {
      element.fields.forEach(element1 => {
        const dataValidation = {
          key: element1.field_name,
          isRequire: false,
          error: false,
          message: ''
        }
        this.modelFields[element1.field_name] = dataValidation
        if (element1.columnType === 'dropdown' || element1.columnType === 'select' || element1.columnType === 'selectTree' || element1.columnType === 'multiSelect'
          || element1.columnType === 'checkboxList' || element1.columnType === 'checkboxradiolist' || element1.columnType === 'autocomplete') {
            if(element1.columnObject) {
              if(element1.columnType === 'selectTree' || element1.columnType === 'selectTrees') {
                promissall.push(this.apiHrmV2Service.getCustObjectListTreeV2(element1.columnObject, element1.field_name));
              }else if(element1.columnType === 'autocomplete'){
                promissall.push(this.apiHrmV2Service.getAutocompleteLinkApiV2(element1.columnObject, element1.field_name));
              }else {
                promissall.push(this.apiHrmV2Service.getCustObjectListV2(element1.columnObject, element1.field_name));
              }
            }
        } else if(element1.columnType === 'datetime' && element1.columnValue == 0) {
          element1.columnValue = null;
        }
      });
    });

    if (promissall.length > 0) {
      this.spinner.show();
        forkJoin(promissall.filter(d => d !== undefined)).subscribe((results: any) => {
          const responses = results.filter(d => d !== undefined);
          this.spinner.hide();
          dataView.forEach(element => {
            element.fields.forEach(element1 => {
              if (responses.map(d => d.key).indexOf(element1.field_name) > -1) {
                if (element1.columnType === 'autocomplete') {
                  const datas = responses.filter(d => d.key === element1.field_name);
                  setValueAndOptionsAutocomplete(element1, datas[0].result);
                } else if (element1.columnType === 'checkboxradiolist') {
                  const datas = responses.filter(d => d.key === element1.field_name);
                  setCheckboxradiolistValue(element1, datas[0].result)
                } else if ((element1.columnType === 'selectTree') || (element1.columnType === 'selectTrees')) {
                  const datas = responses.filter(d => d.key === element1.field_name);
                  setSelectTreeValue(element1, datas[0].result)
                } else if (element1.columnType === 'multiSelect') {
                  const datas = responses.filter(d => d.key === element1.field_name);
                  setMultiSelectValue(element1, datas[0].result)
                } else if (element1.columnType === 'members') {
                  const datas = responses.filter(d => d.key === element1.field_name);
                  setMembers(element1, datas[0].result)
                } else {
                  const datas = responses.filter(d => d.key === element1.field_name);
                  setValueAndOptions(element1, datas[0].result);
                }
              }
            })
          })
          this.dataView = [...dataView];
        });
      } else {
        this.spinner.hide();
        this.dataView = [...dataView];
      }
  }


  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  callbackSearch() {
    this.callbackcancel.emit('SearchMGT');
  }

  resetData(value) {
    this.callbackcancel.emit(value);
  }

  getValueByKey(key) {
    if (this.dataView && this.dataView.length > 0) {
      let value = ''
      for (let i = 0; i < this.dataView.length; i++) {
        for (let j = 0; j < this.dataView[i].fields.length; j++) {
          if (this.dataView[i].fields[j].field_name === key) {
            value = this.dataView[i].fields[j].columnValue;
            break;
          }
        }
      }
      return value
    }
  }
  submit = false;
  onChangeButtonEdit(event) {
    if (event === 'Search') {
      this.submit = false;
      let group_fields = cloneDeep(this.dataView)
      this.callbackform(group_fields, event)
    } else {
      this.cancel(event);
    }
  }

  callbackform(group_fields, type) {
    this.submit = true;
    const params: any = {};
    group_fields.forEach(results => {
      results.fields.forEach(data => {
        if (data.columnType === 'datetime' && data.isVisiable) {
          params[data.field_name]= data.columnValue ? moment(new Date(data.columnValue)).format('DD-MM-YYYY') : null
        } else if (data.columnType === 'datefulltime' && data.isVisiable) {
          params[data.field_name]= data.columnValue ? moment(data.columnValue).format('DD-MM-YYYY HH:mm:ss') : null
        } else if (data.columnType === 'timeonly') {
          params[data.field_name]= data.columnValue ?  `${data.columnValue}:00` : null

        } else if (data.columnType === 'selectTree') {
          params[data.field_name]= data.columnValue ? data.columnValue.data : null;
          delete data.options;
        } else if (data.columnType === 'currency') {
          params[data.field_name]= data.columnValue ? numeral(data.columnValue).value() : null
        }else if ((data.columnType === 'select') || (data.columnType === 'dropdown')) {
          params[data.field_name]= data.columnValue ? isNaN(data.columnValue) ? data.columnValue : parseInt(data.columnValue) : null;
          delete data.options;
        }else if ((data.columnType === 'multiSelect')) {
          params[data.field_name]= data.columnValue ? data.columnValue.map(d => d.code).toString() : null;
          delete data.options;
        }else if ((data.columnType === 'checkboxList')) {
          params[data.field_name]= data.columnValue ? data.columnValue.toString() : null;
          delete data.options;
        }else if ((data.columnType === 'autocomplete')) {
          params[data.field_name]= data.columnValue ? data.columnValue.code : null;
          delete data.options;
        }else if ((data.columnType === 'number')) {
          data.columnValue = data.columnValue ? this.formatNumber(+data.columnValue) : 0;
          params[data.field_name]= numeral(data.columnValue).value();
        }
      })
    });
    this.submit = false;
    this.callback.emit({data: params, type: type, listViewsFilter: this.dataView})
    // this.ref.close({data: params, type: type, listViewsFilter: this.dataView});
  }
  formatNumber(value) {
    return numeral(value).format('0,0[.][00]');
  }

  cancel(event) {
    this.displaySetting = false;
    this.close.emit(event);
  }

  changeDropdown(event) {
    this.callbackDropdown.emit({key: 'isRequire', data: event == 1 ? true : false });
  }

  avatarUrlCallback(url) {
    this.avatarUrl.emit(url);
  }
  gridKey = '';
  displaySetting = false;
  CauHinh() {
    this.gridKey = this.detail.tableKey
    this.displaySetting = true;
  }

  detailInfo = null;
  group_cd = '';
  displaySetting1 = false;
  listViews = [];
  callbackConfigGridTanle(event) {
    this.group_cd = event;
    this.getGroupInfo();
  }
  
  getGroupInfo() {
    const queryParams = queryString.stringify({ group_key: this.detail.groupKey, group_cd: this.group_cd });
    this.apiService.getGroupInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfo = results.data;
          this.displaySetting1 = true;
        }
      });
  }

  setGroupInfo(data) {
    this.spinner.show();
    const params = {
      ...this.detailInfo, group_fields: data
    }
    this.apiService.setGroupInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this.spinner.hide();
          this.displaySetting1 = false;
          this.displaySetting = false;
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

  quaylai(data) {
    this.displaySetting1 = false;
  }

  reload() {
    this.gridKey = '';
   this.displaySetting = false;
   this.displaySetting1 = false;
   setTimeout(() => {
    this.CauHinh()
   }, 500);
  }
}
