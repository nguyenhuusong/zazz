import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { BButton, FFields } from './buttons.mode';
import { TYPES, TYPESAUTOCOMPLETE, TYPESCHECKBOX, TYPESDATETIME, TYPESDROPDOWN, TYPESIMAGE, TYPESINPUT, TYPESMULTISELECT, TYPESRESETPASSWORD, TYPESTEXTAREA, TYPETREESELECT } from './columnTypes';
import { forkJoin,  of,  Subject,  takeUntil} from 'rxjs';
import { cloneDeep } from 'lodash';
import { ApiService } from 'src/app/services/api.service';
import { PanelWrapperComponent } from '../formLy/panel-wapper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmV2Service } from 'src/app/services/api-hrm/apihrmv2.service';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-edit-detail',
  templateUrl: './edit-detail.component.html',
  styleUrls: ['./edit-detail.component.scss']
})
export class EditDetailComponent implements OnInit {
  private _messageService = inject(MessageService);
  @Input() isFiler: boolean = false;
  private _appApi = inject(ApiService);
  private _spinner = inject(NgxSpinnerService);
  private _apiHrmV2 = inject(ApiHrmV2Service);
  @Input() buttons: BButton[] = [];
  @Input() detailInfo: any = null;
  @Output() close = new EventEmitter<any>();
  @Input() listForms: any[] = [];
  @Output() callback = new EventEmitter<any>();
  public modelFields: any = {};
  public includeImage: boolean = false;
  public isSubmit: boolean = false;
  form = new FormGroup({});
  model: any = {};
  public options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: true,
      tests : [
        {name: 'dsd', value: 1}
      ]
    },
  };
  fields: FormlyFieldConfig[] = [];
  constructor() {
  }


  ngOnInit() {
    this.submitMaterial();
    this.callApiDropdow();
  }

  callApiDropdow() {
    const datas = cloneDeep(this.fields);
    const promissall: any[] = [];
    this.listForms.forEach(ffields => {
      ffields.fields.forEach((ffield: any) => {
          if(TYPES.indexOf(ffield.columnType) > -1 && ffield.columnObject) {
            promissall.push(this._apiHrmV2.getCustObjectListV2(ffield.columnObject, `${ffield.field_name}${ffield.group_cd}`));
          }
      })
    });
    if (promissall && promissall.length > 0) {
      this.fields = [];
      forkJoin(promissall.filter(d => d !== undefined))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        const responses = results.filter((d: any) => d !== undefined);
        responses.forEach((item: any) => {
          this.options.formState[item.key] = item.result;
        });
        this.fields = cloneDeep(datas);
      })
    }
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  submitMaterial() {
    const lisst: any[] = []
    this.listForms.forEach(ffields => {
      lisst.push(
        {
          fieldGroupClassName: 'grid',
          className:ffields.group_column,
          fieldGroup:[{
            fieldGroupClassName: 'grid',
            className: 'col-12',
            wrappers: [PanelWrapperComponent],
            props: {
              label: ffields.group_name,
            },
            fieldGroup: [...this.forChid(ffields)]
          }]
        }
      )

    });
    this.fields = [
      {
        fieldGroupClassName: 'grid',
        fieldGroup:lisst
   }]
  }

  forChid(ffields: any): any {
    const newFields: any[] = ffields.fields.map((ffield: FFields) => {
      return {
        key: ffield.field_name,
        defaultValue: this.setValueForm(ffield),
        type: ffield.columnType && TYPESINPUT.indexOf(ffield.columnType) > -1 ? 'nzInput'
          : ffield.columnType && TYPESDROPDOWN.indexOf(ffield.columnType) > -1 ? 'nzDropdown'
            : ffield.columnType && TYPESTEXTAREA.indexOf(ffield.columnType) > -1 ? 'nzTextarea'
              : ffield.columnType && TYPESCHECKBOX.indexOf(ffield.columnType) > -1 ? 'nzCheckbox'
                : ffield.columnType && TYPESDATETIME.indexOf(ffield.columnType) > -1 ? 'nzDateTime'
                  : ffield.columnType && TYPESAUTOCOMPLETE.indexOf(ffield.columnType) > -1 ? 'nzAutocomplete'
                    : ffield.columnType && TYPETREESELECT.indexOf(ffield.columnType) > -1 ? 'nzTreeSelect'
                      : ffield.columnType && TYPESMULTISELECT.indexOf(ffield.columnType) > -1 ? 'nzMultiSelect'
                        : ffield.columnType && TYPESIMAGE.indexOf(ffield.columnType) > -1 ? 'nzImage'
                          : '',
        className: ffield.columnClass,
        hide: !ffield.isVisiable,
        expressionProperties: {
          'props.options': `formState.${ffield.field_name}${ffield.group_cd}`
        },
        props: {
          label: ffield.columnLabel,
          placeholder: ffield.columnLabel,
          required: ffield.isRequire,
          disabled: ffield.isDisable,
          type: ffield.data_type,
          columnType: ffield.columnType,
          valueProp: "value",
          labelProp: 'name',
          // options: this.options.formState[`${ffield.field_name}${ffield.group_cd}`],
          change: this.onChangeField.bind(this),
        },
      }
    });
    return newFields
  }

  setValueForm(ffield: FFields) {
    if (TYPESDATETIME.indexOf(ffield.columnType) > -1) {
      return ffield.columnValue ? new Date(this.convesrtDate(ffield.columnValue)): ''
    } else {
      return ffield.columnValue == 'true' ? true : ffield.columnValue == 'false' ? false : ffield.columnValue
    }
  }

  convesrtDate(value: string) {
    const cutString = value.split(' ');
    const stringDate = cutString[0].split('/');
    if(cutString.length > 1) {
      return `${stringDate[2]}-${stringDate[1]}-${stringDate[0]} ${cutString[1]}`
    }else {
      return `${stringDate[2]}-${stringDate[1]}-${stringDate[0]}`
    }
  }

  
  onClickField(field: FormlyFieldConfig , event: any) {
  }

  onChangeField(field: FormlyFieldConfig , event: any) {
    const fieldItem: any = this.getValueByKey(field.key);
    if(fieldItem && fieldItem.columnDisplay) {
      const fieldsString = fieldItem.columnDisplay.split(",");
      this.getOptionsField(fieldItem, fieldsString, field);
    } 
  }

  getObjectList(props: any, filter: string, field: any) {
    const fieldItem: any = this.getValueByKey(field.key);
    if(fieldItem.columnObject) {
      const apis = fieldItem.columnObject.split("?");
      fieldItem.columnObject = apis[0].toString() + `?filter=${filter}&userIds=${fieldItem.columnValue}`;
      this._apiHrmV2.getCustObjectListV2(fieldItem.columnObject, `${fieldItem.field_name}${fieldItem.group_cd}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
       props['results'] = results.result;
      })
    }
   
  }

  getOptionsField(itemField: FFields, fieldsString: any[], field: FormlyFieldConfig) {
    if(itemField) {
      const promissall: any[] = [];
        this.listForms.forEach(ffields => {
          ffields.fields.forEach((ffield: any) => {
            if(fieldsString.indexOf(`${ffield.field_name}`) > -1 && ffield.columnObject) {
              const params = ffield.columnObject.split("?");
              let params1 = params[1].split("&");
              const indexparams1 = params1.filter((d: any) => !d.includes(`${itemField.field_name}=`));
              indexparams1.push(`${itemField.field_name}=${field.formControl?.value}`);
              ffield.columnObject = params[0]  + `?${indexparams1.join("&")}`
              promissall.push(this._apiHrmV2.getCustObjectListV2(ffield.columnObject, `${ffield.field_name}${ffield.group_cd}`))
            }
          })
        });

        if (promissall.length > 0) {
          const datas = cloneDeep(this.fields);
          this.fields = [];
          forkJoin(promissall.filter(d => d !== undefined))
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((results: any) => {
            const responses = results.filter((d: any) => d !== undefined);
            responses.forEach((item: any) => {
              this.options.formState[item.key] = item.result;
            });
            this.fields = cloneDeep(datas);
          })
        }
    }
    

  }

  hideGroup() {
    this.displaySetting = true;
  }

  getValueByKey(key: any): any {
    if (this.listForms && this.listForms.length > 0) {
      let value = {}
      for (let i = 0; i < this.listForms.length; i++) {
        for (let j = 0; j < this.listForms[i].fields.length; j++) {
          if (this.listForms[i].fields[j].field_name === key) {
            value = this.listForms[i].fields[j];
            break;
          }
        }
      }
      return value
    }
    return null
  }

  submitForm() {
    if (this.form.valid) {
      const object: any = this.form.getRawValue();
      const objectKeys = Object.keys(object);
      this.listForms.forEach(ffields => {
        ffields.fields.forEach((ffield: any) => {
           if(objectKeys.indexOf(ffield.field_name) > -1) {
            ffield.columnValue = object[ffield.field_name] || null;
           }
        })
      });
      this.callback.emit({
        forms: this.listForms,
        actions: 'Save'
      })

    }
  }

  
  cancel(type: string) {
    this.close.emit({ event: type, datas: this.listForms });
  }

  // cấu hình
  buttons1: any = [
    { label: 'Đóng', value: 'Cancel', class: 'p-button p-button-secondary', icon: 'pi pi-times-circle' },
    { label: 'Lưu lại', value: 'Update', class: '' }
  ];
  gridKey: string = '';
  group_cd: string = '';
  listViews: any[] = [];
  detailInfoConfig: any = null;
  displaySetting1: boolean = false;
  displaySetting: boolean = false;
  CauHinh() {
    console.log(this.detailInfo.tableKey)
    this.gridKey = this.detailInfo.tableKey
    this.displaySetting = true;
  }

  callbackConfigGridTanle(event: any) {
    this.group_cd = event;
    this.getGroupInfo();
  }

  onChangeButtonEdit(action: string | undefined) {
    this.options.formState.submitted = true;
    if (this.form.valid) {
      const object: any = this.form.getRawValue();
      const objectKeys = Object.keys(object);
      this.listForms.forEach(ffields => {
        ffields.fields.forEach((ffield: any) => {
          if (objectKeys.indexOf(ffield.field_name) > -1) {
            if (TYPESMULTISELECT.indexOf(ffield.columnType) > -1) {
              ffield.columnValue = object[ffield.field_name].toString() || null;
            } else {
              ffield.columnValue = object[ffield.field_name] || null;
            }
          }
        })
      });
      this.options.formState.submitted = false;
      this.callback.emit({
        forms: this.listForms,
        model: this.model,
        actions: 'Save'
      })

    } else {
      this._messageService.add({ severity: 'error', summary: 'Dữ liệu thiếu !'});
    }
  }

  getGroupInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({ group_key: this.detailInfo.groupKey, group_cd: this.group_cd });
    this._appApi.getGroupInfo(queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if (results.status === 'success') {
          const listViews = cloneDeep(results.data.group_fields);
          this.listViews = [...listViews];
          this.detailInfoConfig = results.data;
          this.displaySetting = false;
          this.displaySetting1 = true;
        }
      });
  }

  setGroupInfo(data: any) {
    this._spinner.show();
    const params = {
      ...this.detailInfoConfig, group_fields: data.forms
    }
    this._appApi.setGroupInfo(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        if (results.status === 'success') {
          this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
          this._spinner.hide();
          this.displaySetting1 = false;
          // this.load();
        } else {
          this._messageService.add({
            severity: 'error', summary: 'Thông báo',
            detail: results.message
          });
          this._spinner.hide();
        }
      })
  }


  quaylai(data: any) {
    this.displaySetting1 = false;
  }



}

