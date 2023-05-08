import { cloneDeep, uniqBy } from 'lodash';
import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as queryString from 'querystring';
import * as firebase from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { stringtodate } from '../function-common/common';
import * as numeral from 'numeral';
import * as moment from 'moment';
import { ValidationNumberDayInMonth, ValidationNumberDayInMonthEmpty, ValidationNumber, ValidationNumberEmpty } from './validation';
import { checkIsObject, setCheckboxradiolistValue, setMembers, setMultiSelectValue, setSelectTreeValue, setValueAndOptions, setValueAndOptionsAutocomplete } from '../function-common/objects.helper';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiHrmV2Service } from 'src/app/services/api-hrm/apihrmv2.service';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-type-image',
  template: ` <div class="wrap-image">
               <p-image *ngIf="element.columnValue" src="{{element.columnValue}}" alt="Image" height="100" [preview]="true"></p-image>
               <p-image *ngIf="!element.columnValue" src="/assets/images/no-image2.png" alt="Image" height="100" [preview]="true"></p-image>
               <label class="upload" for="myfiless1-{{ element.field_name }}" *ngIf="!element.columnValue">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V36C40 38.2091 38.2091 40 36 40H4C1.79086 40 0 38.2091 0 36V4Z" fill="#201d50"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8582 11.8325C16.993 11.6252 17.2242 11.5 17.4723 11.5H22.5277C22.7758 11.5 23.007 11.6252 23.1418 11.8325L24.6107 14.0905H27.5831C28.2311 14.0905 28.848 14.3544 29.2995 14.8172C29.7503 15.2792 30 15.9014 30 16.546V26.0444C30 26.689 29.7503 27.3113 29.2995 27.7733C28.848 28.236 28.2311 28.5 27.5831 28.5H12.4169C11.7689 28.5 11.152 28.236 10.7005 27.7733C10.2497 27.3113 10 26.689 10 26.0444V16.546C10 15.9014 10.2497 15.2792 10.7005 14.8172C11.152 14.3544 11.7689 14.0905 12.4169 14.0905H15.3893L16.8582 11.8325ZM17.6587 20.862C17.6587 19.5087 18.7243 18.4442 19.9992 18.4442C21.2741 18.4442 22.3397 19.5087 22.3397 20.862C22.3397 22.2153 21.2741 23.2798 19.9992 23.2798C18.7243 23.2798 17.6587 22.2153 17.6587 20.862ZM19.9992 16.3718C17.5514 16.3718 15.5991 18.4001 15.5991 20.862C15.5991 23.3238 17.5514 25.3521 19.9992 25.3521C22.4471 25.3521 24.3993 23.3238 24.3993 20.862C24.3993 18.4001 22.4471 16.3718 19.9992 16.3718Z" fill="white"/>
                  </svg>
                </label>
                
               <input (change)="onUploadOutput($event, element.field_name)"
                accept="image/jpeg,image/png,image/jpg,image/gif" type="file" style="display: none" id="myfiless1-{{ element.field_name }}" name="myfiless1-{{ element.field_name }}" class="myfile1">
              </div>
              <div *ngIf="modelFields[element.field_name+element.group_cd]?.isRequire && submit && modelFields[element.field_name+element.group_cd].error"
                class="alert-validation alert-danger">
                <div [hidden]="!modelFields[element.field_name+element.group_cd].error">
                  {{modelFields[element.field_name+element.group_cd].message}}
                  </div>
                  </div>
                `,
})
export class AppTypeImageComponent implements OnInit {
  @Input() element;
  @Input() submit = false;
  @Input() modelFields;
  @Output() avatarUrlCallback = new EventEmitter<any>();
  isUploadAvatar = true;
  avatarUrl = '';
  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private apiService: ApiService
  ) { }
  ngOnInit(): void {

    // debugger
  }
  deleteAvatar() {
    this.element.columnValue = '';
    this.isUploadAvatar = true
  }
  onUploadOutput(event, field_name) {
    this.spinner.show();
    if (event.target.files[0] && event.target.files[0].size > 0) {
      const getDAte = new Date();
      const getTime = getDAte.getTime();
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`ksbond/images/${getTime}-uninini-${event.target.files[0].name}`).put(event.target.files[0]);
      uploadTask.on('state_changed', (snapshot) => {
      }, (error) => {
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          if (downloadURL) {
            this.element.columnValue = downloadURL;
            this.avatarUrl = downloadURL;
            this.isUploadAvatar = false;
            this.spinner.hide();
            this.avatarUrlCallback.emit(this.avatarUrl)
            // this.dataView.forEach(element => {
            //   element.fields.forEach(async element1 => {
            //     if (element1.field_name === 'meta_file_type') {
            //       element1.columnValue = event.target.files[0].type
            //     } else if (element1.field_name === 'meta_file_size') {
            //       element1.columnValue = event.target.files[0].size
            //     } else if (element1.field_name === 'meta_file_name') {
            //       element1.columnValue = event.target.files[0].name
            //     } else if (element1.field_name === 'meta_file_url') {
            //       element1.columnValue = downloadURL
            //     }
            //   });
            // });
            this.spinner.hide();
          }

        }).catch(error => {
          this.spinner.show();
        });
      });
    }


  }
}


@Component({
  selector: 'app-type-text',
  template: ` <div class="field-group text" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="modelFields[element.field_name+element.group_cd] && modelFields[element.field_name+element.group_cd].isRequire">*</span></label>
                  <input type="text" class="form-control" [(ngModel)]="element.columnValue" (change)="onChangeValue($event.target, element.field_name, element)"
                  name={{element.field_name}} [disabled]="element.isDisable"
                  (focus)="foucusIn($event)"
                  (focusout)="foucusOut($event)"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty">
                  <div *ngIf="modelFields[element.field_name+element.group_cd] && modelFields[element.field_name+element.group_cd].isRequire && submit && modelFields[element.field_name+element.group_cd].error"
                      class="alert-validation alert-danger">
                      <div [hidden]="!modelFields[element.field_name+element.group_cd].error">
                        {{modelFields[element.field_name+element.group_cd].message}}
                      </div>
                  </div>
                </div>
                `,
})
export class AppTypeTextComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  @Output() special = new EventEmitter<any>();
  constructor() { }
  ngOnInit(): void {
  }

  onChangeValue(value, field_name, element) {
    element.columnValue = element.columnValue.trim();
    if(element.isSpecial) {
        this.special.emit(value)
    }else {
      if (element.columnValue === '') {
        this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire && !this.element.columnValue ? true : false
        this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''
        let numberDay = moment().daysInMonth();
        if (field_name === 'annualAdd')
          if (this.element.columnValue > numberDay) {
            this.modelFields[`${element.field_name}${element.group_cd}`].error = true;
            this.modelFields[`${element.field_name}${element.group_cd}`].message = "Phép bù đã nhập lớn hơn số ngày trong tháng này";
          }
        return;
      }else {
        this.modelFields[`${element.field_name}${element.group_cd}`].error =false;
        this.modelFields[`${element.field_name}${element.group_cd}`].message = ''
      }
    }
    
  }


  foucusOut(e) {

  }

  foucusIn(e) {

  }
}

// select

@Component({
  selector: 'app-type-select',
  template: `   
          <div class="field-group select" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
          <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
            <p-dropdown appendTo="body" [baseZIndex]="100" [autoDisplayFirst]="false"  [filterBy]="'label'"
              [disabled]="element.isDisable" [options]="element.options" (onChange)="onChangeValue($event.target, element.field_name, element)"
              [required]="element.isRequire && element.isVisiable && !element.isEmpty" [(ngModel)]="element.columnValue"
              name={{element.field_name}}>
              <ng-template let-item pTemplate="selectedItem">
                <span style="vertical-align:middle;">{{item.label}}</span>
              </ng-template>
              <ng-template let-car pTemplate="item">
                <div class="ui-helper-clearfix" style="position: relative;height: 25px;">
                  <div style="font-size:14px;float:left;margin-top:4px">{{car.label}}</div>
                </div>
              </ng-template>
            </p-dropdown>
            <div *ngIf="element.isRequire && submit && !element.columnValue"
                class="alert-validation alert-danger">
                <div [hidden]="element.columnValue">
                  Trường bắt buộc nhập!
                </div>
            </div>
          </div>
                `,
})
export class AppTypeSelectComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    if (this.element.options && this.element.options.length > 0) {
      this.element.options = this.element.options.forEach(element => {
        element.value = parseInt(element.value);
      })
    }
  }

  onChangeValue(value, field_name, element) {
    this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''
  }

}


// selectTree

@Component({
  selector: 'app-type-selectTree',
  template: `  
     <div class="field-group select treeselect" [ngClass]="'valid'" > 
     <label class="text-nowrap label-tex" pTooltip="{{element?.columnValue?.orgPath}}" 
      tooltipPosition="top">{{element.columnLabel}}  
      <span *ngIf="element.columnValue" 
        style="text-overflow: ellipsis;
        overflow: hidden; 
        max-width: calc(100% - 80px); 
        line-height: 1; 
        white-space: nowrap;
        display: inline-block;">
        - [ {{element?.columnValue?.orgPath}} </span>
        <span *ngIf="element.columnValue" style="display: inline-block;line-height: 1; overflow: hidden;padding-left: 3px;"> ] </span> <span  style="color:red" *ngIf="element.isRequire">*</span></label>
      <p-treeSelect [appendTo]="'body'" 
      [name]="element.field_name" 
      [filter]="true" [options]="element.options || []" [(ngModel)]="element.columnValue"
      [filterInputAutoFocus]="true"  selectionMode="single" [disabled]="element.isDisable" 
      placeholder="Select Item" (onNodeSelect)="selectNode($event, element.field_name, element)" 
      [required]="element && element.isRequire && element?.isVisiable && !element.isEmpty"></p-treeSelect>
      <div *ngIf="element.isRequire && submit && !element.columnValue"
          class="alert-validation alert-danger">
          <div [hidden]="element.columnValue">
            Trường bắt buộc nhập!
          </div>
      </div>
    </div> 
                `,
})
export class AppTypeSelectTreeComponent implements OnInit, OnChanges {
  @Input() element: any;
  @Input() dataView;
  @Input() modelFields;
  @Input() submit = false;
  @Output() special = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private apiHrmV2Service: ApiHrmV2Service,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit(): void {
    console.log(typeof this.element.columnValue);

    // this.element.columnValue = typeof this.element.columnValue === 'string' ? [] : this.element.columnValue
  }

  checkIsObject(data: any): boolean {
    return checkIsObject(data);
  }

  selectNode(event,field_name, element) {
    if(element.isSpecial) {
      this.special.emit(event.node.data)
    }
    if(this.element.field_name === "org_Id"){
      this.setValue('', 'User_Id')
    }

    this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : '';
    if(element.columnDisplay && !element.isSpecial) {
      const fields = element.columnDisplay.split(",");
      const promissall = [];
        this.dataView.forEach(element => {
        element.fields.forEach(element1 => {
          // if(fields.indexOf(`${element1.field_name}${element1.group_cd}`) > -1) {
          if(fields.indexOf(`${element1.field_name}`) > -1) {
            if(element1.columnObject) {
              this.setValue(element1.columnType === 'multiSelect' ? [] : '', element1.field_name)
              const params = element1.columnObject.split("?");
              let params1 = params[1].split("&");
              const indexparams1 = params1.filter(d => !d.includes(`${field_name}=`));
              indexparams1.push(`${field_name}=${event.node.data}`);
              element1.columnObject = params[0]  + `?${indexparams1.join("&")}`
              if(element1.columnType === 'selectTree' || element1.columnType === 'selectTrees') {
                promissall.push(this.apiHrmV2Service.getCustObjectListTreeV2(element1.columnObject, `${element1.field_name}${element1.group_cd}`));
              }else {
                promissall.push(this.apiHrmV2Service.getCustObjectListV2(element1.columnObject, `${element1.field_name}${element1.group_cd}`));
              }
            }
          }
        });
      });
      if (promissall.filter(d => d !== undefined).length > 0) {
        this.FnCallApi(promissall);
      }
    }
  }

  FnCallApi(promissall) {
    this.spinner.show();
    forkJoin(promissall).subscribe((results: any) => {
      this.spinner.hide();
      this.dataView.forEach(element => {
        element.fields.forEach(element1 => {
          if (results.map(d => d.key).indexOf(`${element1.field_name}${element1.group_cd}`) > -1) {
            if (element1.columnType === 'autocomplete') {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setValueAndOptionsAutocomplete(element1, datas[0].result);
            } else if (element1.columnType === 'checkboxradiolist') {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setCheckboxradiolistValue(element1, datas[0].result)
            } else if ((element1.columnType === 'selectTree') || (element1.columnType === 'selectTrees')) {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setSelectTreeValue(element1, datas[0].result)
            } else if (element1.columnType === 'multiSelect') {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setMultiSelectValue(element1, datas[0].result)
            } else if (element1.columnType === 'members') {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setMembers(element1, datas[0].result)
            } else {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setValueAndOptions(element1, datas[0].result);
            }

          }
        })
      })
      this.dataView = [...this.dataView];
    });
  }


  setValue(value, field_name) {
    this.dataView.forEach(element => {
      element.fields.forEach(element1 => {
        if (element1.field_name === field_name) {
          element1.columnValue = value;
          this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire && !element1.columnValue ? true : false;
          this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''
        }
      });
    });
  }


  ngOnChanges(event) {
    if (event && event.element) {
    }
  }

}


// selectTrees nhiều

@Component({
  selector: 'app-type-selectTrees',
  template: `  
     <div class="field-group select treeselect" [ngClass]="'valid'" > 
     <label class="text-nowrap label-tex" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
     <p-treeSelect [appendTo]="'body'"
       [options]="element.options || []" [(ngModel)]="element.columnValue" [metaKeySelection]="false" selectionMode="multiple"
        [disabled]="element.isDisable" placeholder="Select Item" (onNodeSelect)="selectNode($event)" (onHide)="changeValue($event)"
        ></p-treeSelect>
      <div *ngIf="element.isRequire && submit && !element.columnValue"
          class="alert-validation alert-danger">
          <div [hidden]="element.columnValue">
            Trường bắt buộc nhập!
          </div>
      </div>
    </div> 
                `,
})
export class AppTypeSelectTreesComponent implements OnInit, OnChanges {
  @Input() element;
  @Input() dataView;
  @Input() modelFields;
  @Input() submit = false;
  @Output() emitTreeValue = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    console.log(this.element.columnValue)
    // checkIsObject
  }

  checkIsObject(data: any): boolean {
    return checkIsObject(data);
  }

  selectNode(event) {
    this.setValue(null, 'User_Id')
  }

  changeValue(event){
    this.setValue(null, 'User_Id')
  }


  ngOnChanges(event) {
    if (event && event.element) {
    }
  }

  
  setValue(value, field_name) {
    this.dataView.forEach(element => {
      element.fields.forEach(element1 => {
        if (element1.field_name === field_name) {
          element1.columnValue = value;
          this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire && !element1.columnValue ? true : false;
          this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''
        }
      });
    });
    // this.emitTreeValue.emit(this.dataView); tạm comment
  }
}

// dropdown
@Component({
  selector: 'app-type-dropdown',
  template: `   
          <div class="field-group select " [ngClass]=" element.columnValue ? 'valid' : 'invalid' " >
          <div class="uni-load " [ngClass]="loading ? 'loading' : ''"></div>
          <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <p-dropdown appendTo="body" [baseZIndex]="100"
                  placeholder="{{element.columnLabel}}" 
                  [disabled]="element.isDisable" [options]="element.options" (onChange)="onChangeValue($event.value, element.field_name, element)" [filterBy]="'label'"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty" [(ngModel)]="element.columnValue"
                  [name]="element.field_name" [filter]="true">
                  <ng-template let-item pTemplate="selectedItem">
                    <span style="vertical-align:middle;">{{item.label}}</span>
                  </ng-template>
                  <ng-template let-car pTemplate="item">
                    <div class="ui-helper-clearfix" style="position: relative;height: 25px;">
                      <div style="font-size:14px;float:right;margin-top:4px">{{car.label}}</div>
                    </div>
                  </ng-template>
                </p-dropdown>
                <div *ngIf="element.field_name==='roomId'" class="chon-lich-hop" style="
                      position: absolute;
                      right: -3px;
                      top: 23px;
                      z-index: 9;
                  ">
                  <p-button [disabled]="element.columnValue ? false : true " (onClick)="chonLichHop()" styleClass="p-button-sm " label="Chọn lịch họp" icon="pi pi-clock"></p-button>&nbsp;
                </div>
                <div *ngIf="modelFields[element.field_name+element.group_cd] && modelFields[element.field_name+element.group_cd].isRequire && submit && modelFields[element.field_name+element.group_cd].error"
                  class="alert-validation alert-danger">
                  <div [hidden]="!modelFields[element.field_name+element.group_cd].error">
                  {{modelFields[element.field_name+element.group_cd].message}}
                </div>
            </div>
                `,
})
export class AppTypeDropdownComponent implements OnInit, AfterViewChecked {
  @Input() element;
  @Input() dataView;
  @Input() paramsObject;
  @Output() callback = new EventEmitter<any>();
  @Output() dataInfo = new EventEmitter<any>();
  @Input() modelFields;
  @Input() submit = false;
  @Output() emitDropdownValue = new EventEmitter<any>();
  @Output() special = new EventEmitter<any>();
  loading = false;
  floorID = '';
  constructor(
    private apiService: ApiHrmService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private apiHrmV2Service: ApiHrmV2Service,
    private spinner: NgxSpinnerService
  ) { }
  async ngOnInit() {
    if (this.element.field_name === 'parentId') {
      const orgId = await this.getValueByKey('orgId');
      const adm_st = await this.getValueByKey('adm_st');
      this.getAgentLeaders(orgId, this.element, adm_st);
    }else if(this.element.field_name === "menuParentId") {
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.element && this.element && this.element.columnValue) {
    }
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
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

 async chonLichHop() {
    let floorID:any = await this.getValueByKey('floor_No');
    const emitType = {
      name: 'roomId',
      id: this.element.columnValue,
      floorID: floorID
    }
    this.dataInfo.emit({ data: this.dataView, calenderInfo: emitType});
  }

  async onChangeValue(value, field_name, element) {
    if(element.isSpecial) {
      this.special.emit(value)
    }
    this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''

   if (field_name === 'type_salary') {
      this.dataView.forEach(element => {
        element.fields.forEach(element1 => {
          if (element1.field_name === 'from_day') {
            element1.isVisiable = value == 2 ? true : false;
            this.setValue(25, element1.field_name)
          } else if (element1.field_name === 'to_day') {
            element1.isVisiable = value == 2 ? true : false;
            this.setValue(24, element1.field_name)
          } else if (element1.field_name === 'salary_start_dt') {
            const date = value == 1 ? new Date(moment().startOf('month').format()) : new Date(new Date().getFullYear(), numeral(moment(new Date()).add(-2, 'months').format('MM')).value(), 25);
            this.setValue(date, element1.field_name)
          } else if (element1.field_name === 'salary_next_dt') {
            const date = value == 1 ? new Date(moment().endOf('month').format()) : new Date(new Date().getFullYear(), numeral(moment(new Date()).add(-1, 'months').format('MM')).value(), 24);
            this.setValue(date, element1.field_name)
          }
        });
      });
    } else if (field_name === 'contract_term') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'contract_expire_dt') {
            const contract_issue_dt = await this.getValueByKey('contract_issue_dt');
            const dateConvert = typeof contract_issue_dt === 'string' ? stringtodate(contract_issue_dt) : contract_issue_dt
            const columnValue = new Date(moment(new Date(dateConvert)).add(value == 0 ? 60 : parseInt(value), 'months').format());
            this.setValue(columnValue, element1.field_name)
          }
        });
      });
    } else if( field_name === 'status'){
      if(this.paramsObject && this.paramsObject.params.roomId) {
        if(parseInt(value) === 0){
            this.confirmationService.confirm({
              message: 'Phòng họp đang trong cuộc họp, bạn thực sự muốn thay đổi trạng thái phòng họp?',
              accept: () => {
                this.element.columnValue = value;
              },
              reject: () => {
                this.element.columnValue = "1";
              }
            });
        }
      }
    }  else if (field_name === 'holi_type') {
      this.callback.emit(value);
    }else if (field_name === 'currency_type') {
      this.dataView.forEach( group => {
        group.fields.forEach(field => {
          if(field.field_name === 'salary_from') {
            field.isVisiable = true;
            if(parseInt(value) === 2){
              field.isVisiable = true;
            }else if(parseInt(value) === 1){
              field.isVisiable = true;
            }
            else{
              field.isVisiable = false;
            }
          }else if(field.field_name === 'salary_to') { 
            field.isVisiable = true;
            if(parseInt(value) === 3){
              field.isVisiable = true;
            }else if(parseInt(value) === 1){
              field.isVisiable = true;
            }else{
              field.isVisiable = false;
            }
          }else if(field.field_name === 'currency') { 
            field.isVisiable = true;
            if(parseInt(value) === 4){
              field.isVisiable = false;
            }else if(parseInt(value) === 1){
              field.isVisiable = true;
            }else{
              field.isVisiable = true;
            }
          }
        });
      }); 
    }
    // else if(field_name === 'floor_No') {
    //   this.floorID = value
    //   this.dataView.forEach(element => {
    //     element.fields.forEach(async element1 => {
    //       if(element1.field_name === 'roomId'){
    //         this.getRooms(element1, value);
    //         const emitType = {
    //           name: 'floor_no',
    //           id: value
    //         }
    //         this.callback.emit(emitType);
    //       }
    //     })
    //   })
    // } 
    else {
      if(element.columnDisplay && !element.isSpecial) {
        const fields = element.columnDisplay.split(",");
        const promissall = [];
          this.dataView.forEach(element => {
          element.fields.forEach(element1 => {
            // if(fields.indexOf(`${element1.field_name}${element1.group_cd}`) > -1) {
            if(fields.indexOf(`${element1.field_name}`) > -1) {
              if(element1.columnObject) {
                this.setValue(element1.columnType === 'multiSelect' ? [] : '', element1.field_name)
                const params = element1.columnObject.split("?");
                let params1 = params[1].split("&");
                const indexparams1 = params1.filter(d => !d.includes(`${field_name}=`));
                indexparams1.push(`${field_name}=${value}`);
                element1.columnObject = params[0]  + `?${indexparams1.join("&")}`
                if(element1.columnType === 'selectTree' || element1.columnType === 'selectTrees') {
                  promissall.push(this.apiHrmV2Service.getCustObjectListTreeV2(element1.columnObject, `${element1.field_name}${element1.group_cd}`));
                }else {
                  promissall.push(this.apiHrmV2Service.getCustObjectListV2(element1.columnObject, `${element1.field_name}${element1.group_cd}`));
                }
              }
            }
          });
        });
        if (promissall.filter(d => d !== undefined).length > 0) {
          this.FnCallApi(promissall);
        }
      }
    }
  }

  FnCallApi(promissall) {
    this.spinner.show();
    forkJoin(promissall).subscribe((results: any) => {
      this.spinner.hide();
      this.dataView.forEach(element => {
        element.fields.forEach(element1 => {
          if (results.map(d => d.key).indexOf(`${element1.field_name}${element1.group_cd}`) > -1) {
            if (element1.columnType === 'autocomplete') {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setValueAndOptionsAutocomplete(element1, datas[0].result);
            } else if (element1.columnType === 'checkboxradiolist') {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setCheckboxradiolistValue(element1, datas[0].result)
            } else if ((element1.columnType === 'selectTree') || (element1.columnType === 'selectTrees')) {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setSelectTreeValue(element1, datas[0].result)
            } else if (element1.columnType === 'multiSelect') {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setMultiSelectValue(element1, datas[0].result)
            } else if (element1.columnType === 'members') {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setMembers(element1, datas[0].result)
            } else {
              const datas = results.filter(d => d.key === `${element1.field_name}${element1.group_cd}`);
              setValueAndOptions(element1, datas[0].result);
            }

          }
        })
      })
    });
  }

  // Trung tâm - Ban 
  getBanByOrganize(blockId, element1, root_orgId) {
    const queryParams = queryString.stringify({ organizeId: root_orgId, parentId: blockId});
    this.apiService.getBanByOrganize(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.org_name, value: d.orgId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  } 
  // Phòng ban
  getDepartmentByOrganize(blockId, element1, root_orgId) {
    const queryParams = queryString.stringify({ organizeId: root_orgId, parentId: blockId});
    this.apiService.getDepartmentByOrganize(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.org_name, value: d.orgId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  // Nhóm 
  getGroupByOrganize(parentId, element1, root_orgId) {
    const queryParams = queryString.stringify({ organizeId: root_orgId, parentId: parentId});
    this.apiService.getGroupByOrganize(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.org_name, value: d.orgId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  // tổ 
  getTeamByOrganize(parentId, element1, root_orgId) {
    const queryParams = queryString.stringify({ organizeId: root_orgId, parentId: parentId});
    this.apiService.getTeamByOrganize(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.org_name, value: d.orgId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getRooms(element1, value) {
    const queryParams = queryString.stringify( { filter: '', floor_No: value })
    this.apiService.getMeetRooms(queryParams)
      .subscribe(results => {
        if (results.status === 'success') {
          if(value){
            element1.options = results.data.map(d => {
              return {
                label: d.room_name,
                value: d.roomId,
              }
            })  
          }else{
            element1.options = []
          }
             
        }
      });
  }

 
  setValue(value, field_name) {
    this.dataView.forEach(element => {
      element.fields.forEach(element1 => {
        if (element1.field_name === field_name) {
          element1.columnValue = value;
          this.modelFields[`${element1.field_name}${element1.group_cd}`].error = this.modelFields[`${element1.field_name}${element1.group_cd}`]?.isRequire && !element1.columnValue ? true : false;
          this.modelFields[`${element1.field_name}${element1.group_cd}`].message = this.modelFields[`${element1.field_name}${element1.group_cd}`]?.error ? 'Trường bắt buộc nhập !' : ''
        }
      });
    });
    if(field_name === 'User_Id') {
      this.emitDropdownValue.emit(this.dataView)
    }
  }

  getAgentLeaders(orgId, element1, isAdmin) {
    const queryParams = queryString.stringify({ orgId: orgId, admin_is: isAdmin });
    this.apiService.getAgentLeaders(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data.map(d => {
          return { label: d.fullName, value: d.saler_id }
        });
        element1.columnValue = element1.columnValue ? parseInt(element1.columnValue) : '';
      }
    })
  }

}


// number


@Component({
  selector: 'app-type-number',
  template: `   <div class="field-group" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <input type="number" oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : 0" class="form-control" [(ngModel)]="element.columnValue" [min]=0
                    name={{element.field_name}} [disabled]="element.isDisable" (change)="onChangeValue($event.target, element.field_name, element)"
                    [required]="element.isRequire && element.isVisiable && !element.isEmpty">
                  <div *ngIf="submit && modelFields[element.field_name+element.group_cd].error" class="alert-validation alert-danger"> 
                    <div [hidden]="!modelFields[element.field_name+element.group_cd].error">
                      {{modelFields[element.field_name+element.group_cd].message}}
                    </div>
                  </div>
                </div>
                `,
})

export class AppTypeNumberComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  @Output() special = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
  }

  onChangeValue(event, field_name, element) {
    if(element.isSpecial) {
      this.special.emit(event.value)
    }
    // if(field_name === 'from_day' || field_name === 'to_day'){

    // }else{
    //   this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire ? this.element.columnValue ? false : true : false
    //   this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''
    // }
    // if(element.isRequire) {
    //   this.modelFields[`${element.field_name}${element.group_cd}`] = {...this.modelFields[`${element.field_name}${element.group_cd}`], ...ValidationNumberDayInMonth(event.value)}
    // }else{
    //     this.modelFields[`${element.field_name}${element.group_cd}`] = {...this.modelFields[`${element.field_name}${element.group_cd}`], ...ValidationNumberDayInMonthEmpty(event.value)}
    // }
    if(this.element.columnValue < 0){
      this.element.columnValue = 0;
    }
    if (field_name === 'from_day' || field_name === 'to_day') {
      if (element.isRequire) {
        this.modelFields[`${element.field_name}${element.group_cd}`] = { ...this.modelFields[`${element.field_name}${element.group_cd}`], ...ValidationNumberDayInMonth(event.value) }
      } else {
        this.modelFields[`${element.field_name}${element.group_cd}`] = { ...this.modelFields[`${element.field_name}${element.group_cd}`], ...ValidationNumberDayInMonthEmpty(event.value) }
      }
    } else {
      if (element.isRequire) {
        this.modelFields[`${element.field_name}${element.group_cd}`] = { ...this.modelFields[`${element.field_name}${element.group_cd}`], ...ValidationNumber(event.value) }
      } else {
        this.modelFields[`${element.field_name}${element.group_cd}`] = { ...this.modelFields[`${element.field_name}${element.group_cd}`], ...ValidationNumberEmpty(event.value) }
      }
    }

  }
}



// currency

@Component({
  selector: 'app-type-currency',
  template: `   <div class="field-group text" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <input maxLength=18 type="text" (change)="changePrice($event, element.field_name, element)"
                  class="form-control" [(ngModel)]="element.columnValue" currency name={{element.field_name}}
                  [disabled]="element.isDisable"  [required]="element.isRequire && element.isVisiable && !element.isEmpty">

                  <div *ngIf="element.isRequire && submit && !element.columnValue"
                    class="alert-validation alert-danger">
                    <div [hidden]="element.columnValue">
                    Trường bắt buộc nhập!
                  </div>
              </div>
                `,
})

export class AppTypeCurrencyComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  @Output() special = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    this.element.columnValue = this.element.columnValue ? this.formatNumber(this.element.columnValue) : '';
  }

  formatNumber(value) {
    return numeral(value).format('0,0[.][00]');
  }

  changePrice(event, field_name, element) {
    if(element.isSpecial) {
      this.special.emit(event.target.value)
    }
    this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''
  }
}


// checkbox

@Component({
  selector: 'app-type-checkbox',
  template: `   
                <div class="field-group checkbox">
                <label for="{{ element.field_name }}" pTooltip="{{element.columnLabel}}" tooltipPosition="top" class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                 <div class="checkbox-wrap"> <p-checkbox inputId="{{ element.field_name }}" name={{element.field_name}} [binary]="true" 
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty" [disabled]="element.isDisable"
                  [(ngModel)]="element.columnValue" (onChange)="onChangeValue($event, element.field_name, element)"></p-checkbox></div>

                <div *ngIf="element.isRequire && submit && !element.columnValue"
                    class="alert-validation alert-danger">
                    <div [hidden]="element.columnValue">
                    Trường bắt buộc nhập!
                    </div>
                </div>
            </div>
                `,
})

export class AppTypeCheckboxComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  @Input() dataView;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    this.element.columnValue = this.element.columnValue == 'true' || this.element.columnValue == true ? true : false
  }

  setRequired(value) {
    this.dataView.forEach(element => {
      element.fields.forEach(element1 => {
        if (value && !element1.columnValue) {
          if (element1.field_name === 'vehicleName') {
            element1.isRequire = true;
            this.modelFields[element1.field_name].isRequire = true;
            this.modelFields[element1.field_name].error = this.modelFields[element1.field_name].isRequire && !element1.columnValue ? true : false;
            this.modelFields[element1.field_name].message = this.modelFields[element1.field_name].error ? 'Trường bắt buộc nhập !' : ''
          } else if (element1.field_name === 'vehicleNo') {
            element1.isRequire = true;
            this.modelFields[element1.field_name].isRequire = true;
            this.modelFields[element1.field_name].error = this.modelFields[element1.field_name].isRequire && !element1.columnValue ? true : false;
            this.modelFields[element1.field_name].message = this.modelFields[element1.field_name].error ? 'Trường bắt buộc nhập !' : ''
          } else if (element1.field_name === 'vehicleTypeId') {
            element1.isRequire = true;
            this.modelFields[element1.field_name].isRequire = true;
            this.modelFields[element1.field_name].error = this.modelFields[element1.field_name].isRequire && !element1.columnValue ? true : false;
            this.modelFields[element1.field_name].message = this.modelFields[element1.field_name].error ? 'Trường bắt buộc nhập !' : ''
          }
        } else {
          if (element1.field_name === 'vehicleName') {
            element1.isRequire = false;
            this.modelFields[element1.field_name].isRequire = false;
            this.modelFields[element1.field_name].error = false;
          } else if (element1.field_name === 'vehicleNo') {
            element1.isRequire = false;
            this.modelFields[element1.field_name].isRequire = false;
            this.modelFields[element1.field_name].error = false;
          } else if (element1.field_name === 'vehicleTypeId') {
            element1.isRequire = false;
            this.modelFields[element1.field_name].isRequire = false;
            this.modelFields[element1.field_name].error = false;
          }
        }
      });
    });
  }

  onChangeValue(value, field_name, element) {
    if (field_name === 'isCardVehicle') {
      this.setRequired(element.columnValue)
    }
    this.modelFields[`${element.field_name}${element.group_cd}`].error = false
  }

}

// textarea

@Component({
  selector: 'app-type-textarea',
  template: `   
              <div class="field-group textarea">
              <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <textarea type="text" placeholder="" class="form-control"
                  [(ngModel)]="element.columnValue" name={{element.field_name}} [disabled]="element.isDisable"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty"
                  (change)="onChangeValue($event.target, element.field_name, element)"
                  maxlength="200"
                  ></textarea>

                <div *ngIf="element.isRequire && submit && !element.columnValue"
                    class="alert-validation alert-danger">
                    <div [hidden]="element.columnValue">
                    Trường bắt buộc nhập!
                    </div>
                </div>
            </div>
                `,
})

export class AppTypeTextareaComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {

  }
  onChangeValue(value, field_name, element) {
    this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''

  }
}


// datetime

@Component({
  selector: 'app-type-datetime',
  template: `   
  <div class="field-group date valid">
  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <p-calendar placeholder="DD/MM/YYYY" appendTo="body" [baseZIndex]="101" [disabled]="element.isDisable" (onSelect)="onChangeValue($event, element.field_name)"
                  [(ngModel)]="element.columnValue" [monthNavigator]="true" [yearNavigator]="true" (onBlur)="onChangeValue($event, element.field_name)"
                  yearRange="2000:2030" inputId="navigators" [required]="element.isRequire && element.isVisiable && !element.isEmpty"
                  dateFormat="dd/mm/yy" name={{element.field_name}}></p-calendar>
                  <svg width="19" class="icon-date" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8498 2.8V0.5H15.0998V2.8H18.7998V19H0.799805L0.808805 2.8H4.4998V0.5H6.7498V2.8H12.8498ZM2.5998 17.2H16.9998V9.1H2.5998V17.2ZM2.5998 7.3V4.6H16.9998V7.3H2.5998Z" fill="#2B2F33" fill-opacity="0.6"/>
                  </svg>
                <div *ngIf="element.isRequire && submit && !element.columnValue"
                    class="alert-validation alert-danger">
                    <div [hidden]="element.columnValue">
                      Trường bắt buộc nhập!
                    </div>
                </div>
            </div>
                `,
})

export class AppTypeDatetimeComponent implements OnInit, OnChanges {
  @Input() element;
  @Input() submit = false;
  @Input() modelFields;
  constructor(
    private apiService: ApiHrmService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.element && this.element && this.element.columnValue) {
    //   if (typeof this.element.columnValue === 'string') {
    //     this.element.columnValue = stringtodate(this.element.columnValue);
    //   }
    // }
  }
  ngOnInit(): void {
  }

  onChangeValue(value, field_name) {
    this.modelFields[`${this.element.field_name}${this.element.group_cd}`].error = this.modelFields[`${this.element.field_name}${this.element.group_cd}`].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[`${this.element.field_name}${this.element.group_cd}`].message = this.modelFields[`${this.element.field_name}${this.element.group_cd}`].error ? 'Trường bắt buộc nhập' : '';
  }


}


// datefulltime

@Component({
  selector: 'app-type-datefulltime',
  template: `   
            <div class="field-group date" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
            <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
            <p-calendar placeholder="DD/MM/YYYY hh:ss" appendTo="body" [baseZIndex]="101" [disabled]="element.isDisable"
                  [(ngModel)]="element.columnValue" [monthNavigator]="true" [showTime]="true" hourFormat="24" [yearNavigator]="true"
                  yearRange="2000:2030" inputId="navigators" [required]="element.isRequire && element.isVisiable && !element.isEmpty"
                  dateFormat="dd/mm/yy" name={{element.field_name}}></p-calendar>

          <div *ngIf="element.isRequire && submit && !element.columnValue"
              class="alert-validation alert-danger">
              <div [hidden]="element.columnValue">
                Trường bắt buộc nhập!
              </div>
          </div>
      </div>
                `,
})

export class AppTypeDatefulltimeComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    if(this.modelFields[this.element.field_name] && this.modelFields[this.element.field_name].error) {
      this.modelFields[this.element.field_name].error = false
    }
  }

}


// timeonly

@Component({
  selector: 'app-type-timeonly',
  template: `   <div class="field-group date" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <div>
                <p-calendar appendTo="body" [baseZIndex]="101" [disabled]="element.isDisable"
                [(ngModel)]="element.columnValue" [timeOnly]="true" inputId="timeonly"
                [required]="element.isRequire && element.isVisiable && !element.isEmpty" placeholder="HH:mm" name={{element.field_name}}>
              </p-calendar>

                <div *ngIf="element.isRequire && submit && !element.columnValue"
                    class="alert-validation alert-danger">
                    <div [hidden]="element.columnValue">
                    Trường bắt buộc nhập!
                    </div>
                </div>
            </div>
            </div>
                `,
})

export class AppTypeTimeonlyComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    if(this.modelFields[this.element.field_name] && this.modelFields[this.element.field_name].error) {
      this.modelFields[this.element.field_name].error = false;
    }
  }
}


// multiSelect

@Component({
  selector: 'app-type-multiSelect',
  template: `   <div class="field-group multi-select">
                  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <p-multiSelect 
                  [options]="element.options" 
                  [appendTo]="'body'"
                  [disabled]="element.isDisable"
                  [(ngModel)]="element.columnValue" (onChange)="onChangeValue($event.value, element.field_name)"
                  name={{element.field_name}} defaultLabel="Select a option" display="chip">
                </p-multiSelect>

                <div *ngIf="modelFields[element.field_name+element.group_cd]?.isRequire && submit && modelFields[element.field_name+element.group_cd]?.error"
                    class="alert-validation alert-danger">
                      <div [hidden]="!modelFields[element.field_name+element.group_cd].error">
                        {{modelFields[element.field_name+element.group_cd].message}}
                      </div>
                </div>
            </div>
                `,
})

export class AppTypeMultiSelectComponent implements OnInit {
  @Input() element;
  @Input() dataView;
  @Input() modelFields;
  @Input() submit = false;

  constructor(
    private apiService: ApiHrmService
  
  ) { }
  ngOnInit(): void {
    console.log(this.element)
  }

  onChangeValue(value, field_name) {
    this.modelFields[`${this.element.field_name}${this.element.group_cd}`].error = false;

    // filed by list action
    let actionlistValueKey: any = {}
    if(value) {
      let actionlistValueArr = value;
      if(actionlistValueArr && actionlistValueArr.length > 0 ){
        for(let i = 0; i < actionlistValueArr.length; i ++) {
          actionlistValueKey[actionlistValueArr[i]] = actionlistValueArr[i]
        }
      }
    }
    this.dataView.forEach( group => {
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
        }else if(field.field_name === 'isPublish' || field.field_name === 'content_type'  || field.field_name === 'content_markdown') { 
          if(actionlistValueKey["email"] || actionlistValueKey["push"]){
            field.isVisiable = true;
          }else{
            field.isVisiable = false;
          }
        }
      });
    }); 
    // if (field_name === 'work_cds') {
    //   console.log(value)
    //   this.dataView.forEach(element => {
    //     element.fields.forEach(async element1 => {
    //       if (element1.field_name === 'shift_cds') {
    //         this.getWorkShifts(element1, value)
    //       }
    //     });
    //   });
    // }
  }

  getWorkShifts(element1, work_cd) {
    const queryParams = queryString.stringify({ work_cd: work_cd.map(d => d.code).toString() });
    this.apiService.getWorkShifts(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            name: d.shift_name + '-' + d.shift_cd,
            code: d.shift_cd
          }
        });
      }
    })
  }

}

// markdown

@Component({
  selector: 'app-type-markdown',
  template: `  <div class="wrap-markdown"> <h3 class="text-nowrap label-text" >{{element.columnLabel}}</h3>
                <app-page-markdown [modelMarkdow]="modelMarkdow" [element]="element" ></app-page-markdown>
                </div>
                `,
})

export class AppTypeMarkdownComponent implements OnInit {
  @Input() element;
  @Input() modelMarkdow
  @Input() dataView
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    const content_type = this.getValueByKey('content_type');
    console.log("content_type",content_type)
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


}


// checkboxList
@Component({
  selector: 'app-type-checkboxList',
  template: `   
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <div>
                      <div *ngFor="let item of element.options">
                        <div class="p-field-checkbox" style="display: flex;align-items: end;">
                            <p-checkbox name="{{element.field_name}}" value="{{item.value}}" [(ngModel)]="element.columnValue" inputId="{{item.value}}"></p-checkbox>
                            <label class="ml-1" for="{{item.value}}">{{item.label}}</label>
                          </div>
                      </div>

                <div *ngIf="element.isRequire && submit && !element.columnValue"
                    class="alert-validation alert-danger">
                    <div [hidden]="element.columnValue">
                    Trường bắt buộc nhập!
                    </div>
                </div>
            </div>
                `,
})

export class AppTypeCheckboxListComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;

  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    this.modelFields[this.element.field_name].error = false;

  }

}


// checkboxRadioList
@Component({
  selector: 'app-type-checkboxradiolist',
  template: `   
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <div>
                      <div *ngFor="let item of element.options">
                          <div class="p-field-radiobutton" style="display: flex;align-items: end;">
                            <p-radioButton name="{{element.field_name}}" value="{{item.value}}" [(ngModel)]="element.columnValue" inputId="{{item.value}}"></p-radioButton>
                            <label class="ml-1" for="{{item.value}}">{{item.label}}</label>
                          </div>
                      </div>

                <div *ngIf="element.isRequire && submit && !element.columnValue"
                    class="alert-validation alert-danger">
                    <div [hidden]="element.columnValue">
                    Trường bắt buộc nhập!
                    </div>
                </div>
            </div>
                `,
})

export class AppTypeCheckboxRadioListComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;

  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    console.log(this.element)
    this.modelFields[this.element.field_name].error = false;
  }

}

// linkUrl
@Component({
  selector: 'app-type-linkurl',
  template: `   
            <div class="field-group attach-file">
            <label  class="text-nowrap label-text" >{{element.columnLabel}}</label>
                    <div class="control-image" style="display: flex" *ngIf="this.element.columnValue">
                      <input type="text" [disabled]="element.isDisable"  class="form-control" (change)="setvalueImage($event)" [value]="this.element.columnValue">
                      <button pButton pRipple type="button" [hidden]="element.isDisable" (click)="removeAttach()" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text"></button>
                      <div *ngIf="imagesUpload && (fileType ==='image/jpeg' || fileType ==='image/png' || fileType ==='image/jpg' || fileType ==='image/gif') else otherFile" >
                        <p-image  src="{{imagesUpload}}" alt="Image" width="250" height="250" ></p-image>
                      </div>
                    </div>
                    <div *ngIf="!this.element.columnValue" class="upload_file">
                    <input class="" type="file"  [disabled]="element.isDisable" 
                    accept="{{ fileAccept }}" (change)="onUploadOutputImage($event)" ></div>
                    <input type="file" style="display: none" id="sign_second" name="sign_second"  accept="image/jpeg,image/png,image/jpg,image/gif" (change)="onUploadOutputImage($event)">
                    <div *ngIf="element.isRequire && submit && !element.columnValue"
                        class="alert-validation alert-danger">
                        <div [hidden]="element.columnValue">
                          Trường bắt buộc nhập!
                        </div>
                    </div> 
                    <ng-template #otherFile class="">
                      <div *ngIf="imagesUpload">
                          <a style="display: block;
                          min-width: 60px;
                          line-height: 32px;
                          text-align: center;
                          text-decoration: none;
                          padding-right: 4px;" target="_blank" href="{{ imagesUpload }}">Xem file</a>
                          </div>
                      </ng-template>
                </div>
                `,
})

export class AppTypeLinkUrlRadioListComponent implements OnInit {
  @Input() element;
  @Input() dataView;
  @Input() submit = false;
  imagesUpload = '';
  fileType: any = '';
  fileAccept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, application/msword, image/*, application/vnd.ms-powerpoint, application/vnd.ms-excel";
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
  ) { }
  ngOnInit(): void {
    this.imagesUpload = this.element.columnValue ? this.element.columnValue : '';
    if(this.element.field_name ==="image_url") {
      this.fileAccept = 'image/jpeg,image/png,image/jpg,image/gif'
    }
    this.getFile();
  }

  removeAttach() {
    this.element.columnValue = '';
    this.imagesUpload = ''
  }

  setvalueImage(event) {
    this.element.columnValue = event.target.value;
    this.imagesUpload = event.target.value
  }

  getFile() {
    this.dataView[0].fields.forEach(element => {
      if (element.field_name === "meta_file_type") {
        this.fileType = element.columnValue;
      }
      if (element.field_name === "meta_file_url") {
        this.imagesUpload = element.columnValue;
      }
    })
  }

  onUploadOutputImage(event) {
    if (event.target.files[0] && event.target.files[0].size > 0) {
      this.fileType = event.target.files[0].type;
    }
    if(this.element.field_name ==="image_url") { 
      if(this.fileType !=='image/jpeg' && this.fileType !=='image/png' && this.fileType !=='image/jpg' && this.fileType !=='image/gif') {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Lỗi định dạng file, Vui lòng upload ảnh.' });
        this.element.columnValue = '';
        return
      }
    }else{
      if(this.fileType !=='image/jpeg' && this.fileType !=='image/png' 
        && this.fileType !=='image/jpg' && this.fileType !=='image/gif' 
        && this.fileType !=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        && this.fileType !=='application/pdf' && this.fileType !=='application/msword'
        && this.fileType !=='application/vnd.ms-powerpoint'
        && this.fileType !=='application/vnd.ms-excel') {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Lỗi định dạng file' });
        this.element.columnValue = '';
        return
      }
    }
    this.spinner.show();
    if (event.target.files[0] && event.target.files[0].size > 0) {
      const getDAte = new Date();
      const getTime = getDAte.getTime();
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`ksbond/images/${getTime}-${event.target.files[0].name}`).put(event.target.files[0]);
      uploadTask.on('state_changed', (snapshot) => {
      }, (error) => {
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          if (downloadURL) {
            this.element.columnValue = downloadURL;
            this.imagesUpload = downloadURL;
            this.fileType = event.target.files[0].type;
            this.dataView.forEach(element => {
              element.fields.forEach(async element1 => {
                if (element1.field_name === 'meta_file_type') {
                  element1.columnValue = event.target.files[0].type
                } else if (element1.field_name === 'meta_file_size') {
                  element1.columnValue = event.target.files[0].size
                } else if (element1.field_name === 'meta_file_name') {
                  element1.columnValue = event.target.files[0].name
                } else if (element1.field_name === 'meta_file_url') {
                  element1.columnValue = downloadURL
                }
              });
            });
            this.spinner.hide();
          }

        }).catch(error => {
          this.spinner.hide();
        });
      });
      if (this.element.field_name === 'file_attach') {
        this.spinner.show();
        let fomrData = new FormData();
        fomrData.append('file', event.target.files[0]);
        this.apiService.uploadDrives(fomrData)
          .subscribe(results => {
            if (results.status === 'success') {
              this.dataView.forEach(element => {
                element.fields.forEach(async element1 => {
                  if (element1.field_name === 'link_view') {
                    element1.columnValue = results.data
                  }
                });
              });
              this.spinner.hide();
            } else {
              this.spinner.hide();
            }
  
          })
      }
    }
   

  }

}



// linkUrl
@Component({
  selector: 'app-type-linkurl-drag',
  template: `   
            <div class="linkurl-drag">
            <div class="wrap-upload">
                      <p-fileUpload accept="image/jpeg,image/png,image/jpg,image/gif,.mp4,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,application/msword,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                      *ngIf="!isUpload" [chooseLabel]="''" [chooseIcon]="''"  
                      [multiple]="isUploadMultiple ? true : null" [showUploadButton]="false" [showCancelButton]="false" [customUpload]="true" name="demo[]" 
                       (onSelect)="uploadHandler($event)" [maxFileSize]="20000000">
                          <ng-template pTemplate="toolbar">
                          </ng-template>
                          <ng-template pTemplate="content">
                            <div class="content-upload text-center">
                                <!-- <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M29.3333 20.4999V27.8333H3.66667V20.4999H0V31.4999H33V20.4999H29.3333Z" fill="#4C97E4"/>
                                  <path d="M23.0817 12.0849L18.3333 7.35492V22.3333H14.6667V7.35492L9.91833 12.0849L7.33333 9.49992L16.5 0.333252L25.6667 9.49992L23.0817 12.0849Z" fill="#4C97E4"/>
                                  </svg> -->
                                  <h3 style="color: #182850;">Tải tệp & Kéo tệp</h3>
                                  <p>Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT</p>
                            </div>
                          </ng-template>
                      </p-fileUpload>
                    </div>
                    <div class="file-uploaded" *ngIf="element.columnValue && element.columnValue.length > 0">
                      <h3 class="uploaded-title">Đã upload xong {{ element.columnValue.length }} file</h3>
                      
                      <ul *ngIf="uploadedFiles.length > 0">
                          <li class="d-flex middle bet" *ngFor="let file of uploadedFiles; let i=index">
                          <a [href]="element.columnValue[i]" target="_blank">{{ file }} </a>
                            <span (click)="removeImage(i)">
                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.33366 5.33341V12.0001H2.66699V5.33341H9.33366ZM8.33366 0.666748H3.66699L3.00033 1.33341H0.666992V2.66675H11.3337V1.33341H9.00033L8.33366 0.666748ZM10.667 4.00008H1.33366V12.0001C1.33366 12.7334 1.93366 13.3334 2.66699 13.3334H9.33366C10.067 13.3334 10.667 12.7334 10.667 12.0001V4.00008Z" fill="#FF3B49"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.00033 10.3334V6.66675H5.33366V10.3334H4.00033Z" fill="#FF3B49"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.66699 10.3334V6.66675H8.00033V10.3334H6.66699Z" fill="#FF3B49"/>
                                </svg>
                            </span>
                          </li>
                      </ul>
                    </div>
                    <div class="file-uploaded" *ngIf="element.columnValue && (element.columnValue.length > 0) && (uploadedFiles.length === 0)">

                    <ul>
                        <li class="d-flex middle bet" *ngFor="let file of element.columnValue; let i=index">
                        <a [href]="file" target="_blank">{{ theFileName(file) }} </a>
                          <span (click)="removeImage1(i)">
                              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.33366 5.33341V12.0001H2.66699V5.33341H9.33366ZM8.33366 0.666748H3.66699L3.00033 1.33341H0.666992V2.66675H11.3337V1.33341H9.00033L8.33366 0.666748ZM10.667 4.00008H1.33366V12.0001C1.33366 12.7334 1.93366 13.3334 2.66699 13.3334H9.33366C10.067 13.3334 10.667 12.7334 10.667 12.0001V4.00008Z" fill="#FF3B49"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.00033 10.3334V6.66675H5.33366V10.3334H4.00033Z" fill="#FF3B49"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.66699 10.3334V6.66675H8.00033V10.3334H6.66699Z" fill="#FF3B49"/>
                              </svg>

                          </span>
                        </li>
                    </ul>
                    </div>
                </div>
                `,
})



export class AppTypeLinkUrlDragComponent implements OnInit {
  @Input() element;
  @Input() dataView;
  @Input() modelFields;
  @Input() detailInfo;
  @Input() submit = false;
  @Output() callback = new EventEmitter<any>();
  uploadedFiles: any[] = [];
  downloadURL = '';
  imagesUpload = '';
  fileType: any = ''
  isUpload = false;
  @Input() isUploadMultiple:boolean = true;
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.element.columnValue = this.element.columnValue && (typeof this.element.columnValue === 'string') ? this.element.columnValue.split(',') : this.element.columnValue 
    this.element.columnValue = this.element.columnValue && this.element.columnValue.length > 0 ? this.element.columnValue : []
    this.dataView.forEach(element => {
      element.fields.forEach(async element1 => {
        if (((element1.field_name === 'AttachName') || (element1.field_name === 'attached_name') || (element1.field_name === 'attachName')) && element1.columnValue ) {
          this.uploadedFiles = element1.columnValue.split(',');
        }
        // else if(element1.field_name === 'link_view'){
        //   console.log('link view', element1.columnValue)
        //   // element1.columnValue = element1.columnValue.split(',');
        // }
      });
    });
  }
  removeImage1(i) {
    this.element.columnValue.splice(i, 1);
  }
  
  theFileName(file){
    if(file){
      let fileName = file.split('/').pop().split('?')[0].split('-uninini-').pop();
      return fileName;
    }
  }

  removeImage(index) {
    this.element.columnValue.splice(index, 1);
    this.uploadedFiles.splice(index, 1);
    this.dataView.forEach(element => {
      element.fields.forEach(async element1 => {
        if ((element1.field_name === 'AttachName') || (element1.field_name === 'attached_name')|| (element1.field_name === 'attachName')) {
          element1.columnValue = this.uploadedFiles.toString();
        }else if(element1.field_name ===  'link_view') {
          element1.columnValue.splice(index, 1);
        } 
      });
    });
  }
  
  uploadHandler(event) {
      //  this.uploadedFiles = []
      this.isUpload = true;
      this.spinner.show();
      if(event.currentFiles.length > 0){
        this.detailInfo.formFile = event.currentFiles;
        for(let index in event.currentFiles) {
          const getDAte = new Date();
          const getTime = getDAte.getTime();
          const storageRef = firebase.storage().ref();
          const uploadTask = storageRef.child(`s-hrm/images/${getTime}-uninini-${event.currentFiles[index].name}`).put(event.currentFiles[index]);
          uploadTask.on('state_changed', (snapshot) => {
          }, (error) => {
            console.log('error', error)
          }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              if(!this.isUploadMultiple){
                this.element.columnValue = []
              }
              this.element.columnValue.push(downloadURL)
              // this.spinner.hide();
              this.dataView.forEach(element => {
                element.fields.forEach( element1 => {
                  if ((element1.field_name === 'AttachName') || (element1.field_name === 'attached_name') || (element1.field_name === 'attachName')) {
                    if(!this.isUploadMultiple){
                      this.uploadedFiles = []
                    }
                    this.uploadedFiles.push(event.currentFiles[index].name);
                    element1.columnValue = this.uploadedFiles.toString();
                  } else if (this.element.field_name === 'meta_file_url') {
                    //   // danh sach file dinh kem, ct ns
                     this.setValue(event.currentFiles[index].name,'meta_file_name')
                     this.setValue(event.currentFiles[index].size,'meta_file_size')
                     this.setValue(event.currentFiles[index].type,'meta_file_type')
                      this.callback.emit(event.currentFiles);
                     }
                });
              });
            }).catch(error => {
              this.spinner.hide();
            });
          });
          if (this.element.field_name === 'file_attach') {
            this.spinner.show();
            let fomrData = new FormData();
            fomrData.append('file', event.currentFiles[index]);
            this.apiService.uploadDrives(fomrData)
              .subscribe(results => {
                if (results.status === 'success') {
                  this.dataView.forEach(element => {
                    element.fields.forEach(element1 => {
                      if (element1.field_name === 'link_view') {
                        if(!this.isUploadMultiple){
                          element1.columnValue = []
                        }
                        element1.columnValue.push(results.data);
                      }
                    });
                  });
                  this.spinner.hide();
                } else {
                  this.spinner.hide();
                }
      
              })
          }else{
            this.spinner.hide();
          }
          
        }
        // if (this.element.field_name === 'meta_file_url') {
        //   // danh sach file dinh kem, ct ns
        //   // this.setValue(event.currentFiles[index].name,'meta_file_name')
        //   this.callback.emit(event.currentFiles);
        // }
      }else{
        this.spinner.hide();
        if(event.files.length > 0){
          for( let i = 0; i < event.files.length; i ++){
            if(event.files[i].size > 10000000) {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Kích thước file lớn hơn 20 MB' });
            }
          }
        }else{
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không hỗ trợ định dạng file' });
        }
      }
      setTimeout(() => {
        this.isUpload = false;
      }, 1000);
  }

  setValue(value, field_name) {
    this.dataView.forEach(element => {
      element.fields.forEach(element1 => {
        if (element1.field_name === field_name) {
          element1.columnValue = value;
          this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire && !element1.columnValue ? true : false;
          this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''
        }
      });
    });
  }

  // checkFileType(type){
  //   if(type === "image/png" ||
  //     type === "image/jpeg" ||
  //     type === "image/jpg" ||
  //     type === "image/gif" ||
  //     type === "video/mp4" || 
  //     type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
  //     type === "application/pdf" ||
  //     type === "application/msword" ||
  //     type === "application/vnd.ms-powerpoint" ||
  //     type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  //     ){ }
  //     else{
  //       this.spinner.hide();
  //       this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không hỗ trợ định dạng file' });
  //     }
  //   }
}
// Members
  @Component({
    selector: 'app-type-members',
    template: `   <div class="wrap-members field-group">
                    <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                    <div class="in d-flex bet middle">
                      <ul class="members-filed">
                        <ng-container *ngFor="let user of selectMembers; let i = index">
                          <li *ngIf="i < 33 && element.columnValue" (click)="activeName(i)" >
                              <span class="avatar-radius">
                              <img src="{{user.avatarUrl}}">
                              </span>
                              <span >{{user.fullName}}</span>
                          </li>
                        </ng-container>
                        <li *ngIf="selectMembers.length > 33"><span class="more-member">+12</span></li>
                      </ul>
                      <span class="add-member" (click)="addNewMember()">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 0.9375C5.31066 0.9375 5.5625 1.18934 5.5625 1.5V4.4375H8.5C8.81066 4.4375 9.0625 4.68934 9.0625 5C9.0625 5.31066 8.81066 5.5625 8.5 5.5625H5.5625V8.5C5.5625 8.81066 5.31066 9.0625 5 9.0625C4.68934 9.0625 4.4375 8.81066 4.4375 8.5V5.5625H1.5C1.18934 5.5625 0.9375 5.31066 0.9375 5C0.9375 4.68934 1.18934 4.4375 1.5 4.4375H4.4375V1.5C4.4375 1.18934 4.68934 0.9375 5 0.9375Z" fill="#0979FD"/>
                        </svg> &nbsp;
                      Thêm thành viên</span>
                    </div>
                    <div *ngIf="element.isRequire && submit && !element.columnValue"
                        class="alert-validation alert-danger">
                        <div [hidden]="element.columnValue">
                        Trường bắt buộc nhập!
                        </div>
                    </div>
                  </div>
                  <p-dialog header="Thêm thành viên" [(visible)]="newMember" [style]="{width: '415px'}">
                  <div class="list-member">
                    <div class="fields search">
                      <input type="text" placeholder="Tìm kiếm" (keyup.enter)="searchEm()" [(ngModel)]="searchText">
                      <svg class="cur-pointer" (click)="searchEm()" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.05536 2.5748C5.47625 2.5748 2.5748 5.47625 2.5748 9.05536C2.5748 12.6345 5.47625 15.5359 9.05536 15.5359C10.7206 15.5359 12.2392 14.9078 13.3871 13.8756L13.8756 13.3871C14.9078 12.2392 15.5359 10.7206 15.5359 9.05536C15.5359 5.47625 12.6345 2.5748 9.05536 2.5748ZM15.871 14.3507C17.0085 12.8888 17.6859 11.0512 17.6859 9.05536C17.6859 4.28884 13.8219 0.424805 9.05536 0.424805C4.28884 0.424805 0.424805 4.28884 0.424805 9.05536C0.424805 13.8219 4.28884 17.6859 9.05536 17.6859C11.0512 17.6859 12.8888 17.0085 14.3507 15.871L18.4998 20.0201L20.0201 18.4998L15.871 14.3507Z" fill="#2B2F33" fill-opacity="0.6"/>
                      </svg>
                    </div>
                    <div class="room" *ngFor="let member of element.options; let i = index">
                     <div class="head"><input id="president_{{member.group}}_{{i}}" type="checkbox" style="margin-right: 5px" name="{{member.group}}_{{i}}" (change)="handleChangeParent(member, i)" [checked]="member?.isCheck" /> <h3 class="title">{{member.group}} ({{ member?.child && member?.child.length ? member.child.length : 0}})</h3></div>
                      <div class="item d-flex middle gap16" *ngFor="let user of member.child; let idx = index">
                      <input id="president_{{user.userId}}_{{idx}}" type="checkbox" style="margin-right: 5px" name="president_{{user.userId}}_{{idx}}" (change)="handleChangeChild(user, i, member, idx)" [checked]="user?.isCheck" />
                        <div class="img" *ngIf="!user.avatarUrl"><img src="../../../assets/images/avatar.jpg"></div>
                        <div class="img" *ngIf="user.avatarUrl"><img src="{{user.avatarUrl}}"></div>
                        <div class="name"><span>{{user.fullName}}</span><span>{{user.position}}</span></div>
                      </div>
                    </div>
                  </div>
                  <ng-template pTemplate="footer">
                    <div class="d-flex end">
                      <p-button (click)="cancelAdd()" styleClass="p-button-sm p-button-secondary" label="Bỏ qua" icon="pi pi-times-circle"></p-button>&nbsp;
                      <p-button (click)="xacNhan()">Xác nhận</p-button>
                    </div>
                </ng-template>
                  </p-dialog>
                  `,
  })

  export class AppTypeMembers implements OnInit {
    @Input() element;
    @Input() modelFields;
    @Input() submit = false;
    @Input() dataView;
    @Output() searchMember = new EventEmitter<any>();
    members = [];
    selectMembers =[];
    newMember = false;
    searchText = '';
    constructor(
      private apiService: ApiHrmService,
      private spinner: NgxSpinnerService,
      private messageService: MessageService,
    ) { }
    ngOnInit(): void {
      if(this.modelFields[this.element.field_name] && this.modelFields[this.element.field_name].err) {
        this.modelFields[this.element.field_name].error = false;
      };
      // if(this.element.columnValue && this.element.columnValue.length > 0) {
      //   this.selectMembers = this.element.columnValue && this.element.columnValue.length > 0 ? cloneDeep(this.element.columnValue) : [];
      //     this.element.columnValue = this.element.columnValue.toString();
      // }
      
      this.getSelectMembers();
    }

    getSelectMembers() {
      this.selectMembers = [];
      this.members = [];
      // const dataNew = this.element.columnValue ?  this.element.columnValue.split(',') : [];
      if(this.element.columnValue && this.element?.options?.length > 0){
        for(let item of this.element?.options) {
          if(this.element.columnValue.indexOf(item.userId) > -1) {
            item.isCheck = true;
            this.selectMembers.push({...item, isCheck: this.selectMembers.length === 0 ? true : false});
          }
        }
        this.element.options = []
      }
    }

    cancelAdd() {
      this.newMember = false
    }
    async searchEm() {
      // this.chooseMember()
      this.spinner.show();
      const organizeId = await this.getValueByKey('organizeId');
      let orgId:any = await this.getValueByKey('org_Id');
        
      if(!organizeId){
        const queryParams = queryString.stringify({ offSet: 0, pageSize: 1000, fullName: this.searchText })
        this.apiService.getHrmMeetingPerson(queryParams).subscribe( res => {
          this.spinner.hide();
              if(res.status === 'success') {
                // this.members = cloneDeep(this.element.options);
                this.element.options = [...res.data.meetingProperties];
                // this.element.options.forEach(member => {
                //   member.isCheck = member.isCheck ? member.isCheck : false;
                //   member.child.forEach(user => {
                //     user.isCheck = user.isCheck ? user.isCheck: false;
                //   })
                // })
                for(let item of this.element.options) {
                  for(let item1 of item.child) {
                    if(this.selectMembers.map(d => d.userId).indexOf(item1.userId) > -1) {
                      item1.isCheck = true;
                      // this.selectMembers.push({...item1, isCheck: this.selectMembers.length === 0 ? true : false});
                    }
                    const isCheckAll =item.child.filter(d => d.isCheck === true);
                    if(isCheckAll.length === item.child.length) {
                      item.isCheck = true;
                    }
                  }
                
                }
                this.element.options = [...this.element.options];
                console.log(this.element.options)
              }
        })
      }else{
          // orgId = typeof orgId === 'string' ? orgId : orgId?.orgId;
          const queryParams = queryString.stringify(
            { fullName: this.searchText, offSet: 0, pageSize: 50, organizeId: organizeId, orgId: orgId.map( d => d.data).toString()})
              this.apiService.getHrmFormsPerson(queryParams).subscribe( res => {
                this.spinner.hide();
                if(res.status === 'success') {
                  // this.members = cloneDeep(this.element.options);
                  this.element.options = [...res.data.meetingProperties];
                  this.element.options.forEach(member => {
                    member.isCheck = member.isCheck ? member.isCheck : false;
                    member.child.forEach(user => {
                      user.isCheck = user.isCheck ? user.isCheck: false;
                    })
                  })
                  const dataNew = this.element.columnValue ?  this.element.columnValue.split(',') : [];
                  for(let item of this.element.options) {
                    for(let item1 of item.child) {
                      if(dataNew.indexOf(item1.userId) > -1) {
                        item1.isCheck = true;
                        // this.selectMembers.push({...item1, isCheck: this.selectMembers.length === 0 ? true : false});
                      }
                      const isCheckAll =item.child.filter(d => d.isCheck === true);
                      if(isCheckAll.length === item.child.length) {
                        item.isCheck = true;
                      }
                    }
                  
                  }
                  this.element.options = [...this.element.options]
                }
              })
      }
      
    }
    activeName(i) {
      for(let index in this.selectMembers) {
        if(index == i) {
          this.selectMembers[index].isCheck = true;
        }else {
          this.selectMembers[index].isCheck = false;
        }
      }
      this.selectMembers = [...this.selectMembers]
    }

    xacNhan() {
      // this.selectMembers = [];
      this.chooseMember()
      this.newMember = false;
    }

    chooseMember() {
      if(this.element.options){
        for(let item of this.element.options) {
          for(let index in item.child) {
            if(item.child[index].isCheck) {
              this.selectMembers.push({...item.child[index], isCheck: parseInt(index) === 0 ? true : false});
            }else {
            const newIndex = this.selectMembers.findIndex(d => d.userId === item.child[index].userId);
            if(newIndex > -1) this.selectMembers.splice(newIndex,1);
            this.selectMembers = [...this.selectMembers];
            }
          }
        }
        this.selectMembers =uniqBy(this.selectMembers, 'userId');
        this.element.columnValue = this.selectMembers.map(item => item.userId).toString();
      }
    }

    handleChangeParent(member, index) {
      this.element.options[index].isCheck = !this.element.options[index].isCheck
      this.element.options[index].child.forEach(user => {
        user.isCheck = this.element.options[index].isCheck;
      });
      this.element.options = [...this.element.options];
    }

    handleChangeChild(user, index, member, idx) {
      this.element.options[index].child[idx].isCheck = !this.element.options[index].child[idx].isCheck;
      const isCheckAll =this.element.options[index].child.filter(d => d.isCheck === true);
      if(isCheckAll.length === this.element.options[index].child.length) {
        this.element.options[index].isCheck = true;
        this.element.options = [...this.element.options]
      }else {
        this.element.options[index].isCheck = false;
        this.element.options = [...this.element.options]
      }
    }

    addNewMember() {
      this.searchText = '';
      // this.getSelectMembers();
      this.searchEm();
      // if(this.element.field_name === "org_Id"){
      //   this.setValue('', 'User_Id')
      // }
      // if(this.members && this.members.length > 0) {
      //   this.element.options = cloneDeep(this.members);
      //   for(let item of this.element.options) {
      //     for(let item1 of item.child) {
      //       if(this.selectMembers.map(d => d.userId).indexOf(item1.userId) > -1) {
      //         item1.isCheck = true;
      //       }else {
      //         item1.isCheck = false;
      //       }
      //     }
          
      //   }
      //   // this.element.options = [...this.element.options]
      // }
      this.newMember = true;
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

    setValue(value, field_name) {
      this.dataView.forEach(element => {
        element.fields.forEach(element1 => {
          if (element1.field_name === field_name) {
            element1.columnValue = value;
            this.modelFields[`${element.field_name}${element.group_cd}`].error = this.modelFields[`${element.field_name}${element.group_cd}`].isRequire && !element1.columnValue ? true : false;
            this.modelFields[`${element.field_name}${element.group_cd}`].message = this.modelFields[`${element.field_name}${element.group_cd}`].error ? 'Trường bắt buộc nhập !' : ''
          }
        });
      });
    }
  }

// chips, member out company
@Component({
  selector: 'app-type-chips',
  template: `   <div class="fileds field-group">
                  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <div class="">
                    <p-chips (onRemove)="onRemove($event)" (onAdd)="onAddAchip($event)" (onChipClick)="onChipClick($event)" [(ngModel)]="element.columnValue" name="{{element.field_name}}"></p-chips>
                  </div>
                  <div *ngIf="element.isRequire && submit && !element.columnValue"
                      class="alert-validation alert-danger">
                      <div [hidden]="element.columnValue">
                      Trường bắt buộc nhập!
                      </div>
                  </div>
                </div>
                `,
})

export class AppTypeChips implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  @Input() dataView;
  @Output() emitChipsValue = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
  ) { }
  ngOnInit(): void {
    // this.modelFields[this.element?.field_name].error = false;
    console.log(this.element.columnValue)
    // this.element.columnValue = this.element.columnValue && typeof this.element.columnValue === 'object' ? this.element.columnValue.split(',') : []
  }

  luau() {
    console.log(this.element.columnValue)
  }
  onAddAchip(event) {
    this.emitChipsValue.emit(this.element.columnValue)
  }

  onChipClick(event) {
    if(this.element.field_name === 'info_field'){
      navigator.clipboard.writeText('[' + event.value +']').then( d => {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Thông báo', detail: 'Đã copy' });
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    }
  }
  onRemove(event) {
    this.emitChipsValue.emit(this.element.columnValue)
  }
}


// chips, member out company
@Component({
  selector: 'app-type-listMch',
  template: `   <div class="fileds field-group list-mch">
                  <div class="d-flex middle wrap-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.5 16.9509C20.5 15.694 18.8369 15.0288 18.8369 13.7718V9.72547C18.8369 5.73495 15.7663 2.5 11.9786 2.5C8.19084 2.5 5.12027 5.73495 5.12027 9.72547V13.8181C5.12027 15.0495 3.5 15.7195 3.5 16.9509C3.5 17.4497 3.88382 17.8541 4.35729 17.8541H19.6427C20.1162 17.8541 20.5 17.4497 20.5 16.9509Z" fill="#4C97E4"/>
                          <path d="M9.05009 18.8777C9.05009 19.2221 9.12705 19.5631 9.27655 19.8812C9.42606 20.1994 9.6452 20.4885 9.92145 20.732C10.1977 20.9755 10.5257 21.1686 10.8866 21.3004C11.2476 21.4322 11.6344 21.5 12.0251 21.5C12.4158 21.5 12.8026 21.4322 13.1636 21.3004C13.5245 21.1686 13.8525 20.9755 14.1287 20.732C14.405 20.4885 14.6241 20.1994 14.7736 19.8812C14.9231 19.5631 15.0001 19.2221 15.0001 18.8777H9.05009Z" fill="#4C97E4"/>
                        </svg>&nbsp;
                    <label class="text-nowrap label-text" >
                      {{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  </div>
                  
                  <div class="">
                    <ul>
                      <li *ngFor="let time of element.columnValue; let i= index" class="d-flex bet middle">Trước {{time}} phút<span></span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"  (click)="deleteTimeNoti(i)">
                        <rect width="20" height="20" rx="10" fill="#FAE7E8"/>
                        <path d="M13.3337 8.33366V15.0003H6.66699V8.33366H13.3337ZM12.3337 3.66699H7.66699L7.00033 4.33366H4.66699V5.66699H15.3337V4.33366H13.0003L12.3337 3.66699ZM14.667 7.00033H5.33366V15.0003C5.33366 15.7337 5.93366 16.3337 6.66699 16.3337H13.3337C14.067 16.3337 14.667 15.7337 14.667 15.0003V7.00033Z" fill="#FF3B49"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00033 13.3337V9.66699H9.33366V13.3337H8.00033Z" fill="#FF3B49"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.667 13.3337V9.66699H12.0003V13.3337H10.667Z" fill="#FF3B49"/>
                        </svg>
                      </li>
                    </ul>
                    <div *ngIf="isNewTime" class="add-time-notis">
                      <p-inputNumber [min]="10" [max]="30000" [(ngModel)]="timeInput">
                      </p-inputNumber>
                      <div class="buttons">
                        <p-button styleClass="p-button-sm height-56" (click)="saveTimeNotis()"><i class="pi pi-save"> </i></p-button>
                        <p-button styleClass="p-button-sm height-56 p-button-danger" (click)="cancelTimeNotis()"><i class="pi pi-times"> </i></p-button>
                      </div>
                    </div>
                    <div *ngIf="!isNewTime" class="more" (click)="addMoreLm()">
                      Thêm lời nhắc
                      </div>
                  </div>
                  <div *ngIf="element.isRequire && submit && !element.columnValue"
                      class="alert-validation alert-danger">
                      <div [hidden]="element.columnValue">
                      Trường bắt buộc nhập!
                      </div>
                  </div>
                </div>
                `,
})

export class AppTypelistMch implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  @Input() dataView;
  timeInput = 10;
  isNewTime = false
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
      // this.element.columnValue = [10,20,30]
    if(this.element.columnValue){
      this.element.columnValue = this.element.columnValue.split(",");
    }
    if(this.modelFields[this.element.field_name] && this.modelFields[this.element.field_name].err) {
      this.modelFields[this.element.field_name].error = false;
    }
  }

  deleteTimeNoti(index) {
    this.element.columnValue.splice(index, 1);
  } 

  cancelTimeNotis() {
    this.isNewTime = false
  }

  saveTimeNotis() {
    this.isNewTime = false;
    if(!this.element.columnValue){
      this.element.columnValue = []
    }
    if(!this.timeInput){
      this.timeInput = 10;
    }
    this.element.columnValue.push(this.timeInput)
  }

  addMoreLm() {
    this.isNewTime = true;
    this.timeInput = 10;
  }

}


// avatar Room
@Component({
  selector: 'app-type-roomImg',
  template: `   <div class="fileds room-img">
                  <div class="img">
                  <span *ngIf="!element.columnValue">Tải ảnh lên</span>
                    <img *ngIf="element.columnValue" src="{{ element.columnValue }}">
                  </div>
                  <div class="upload">
                    <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" width="40" height="40" rx="4" fill="#4C97E4"/>
                      <path d="M18.1587 20.8113C18.1587 19.5376 19.2243 18.5357 20.4992 18.5357C21.7741 18.5357 22.8397 19.5376 22.8397 20.8113C22.8397 22.085 21.7741 23.0868 20.4992 23.0868C19.2243 23.0868 18.1587 22.085 18.1587 20.8113Z" fill="white"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3582 12.3129C17.493 12.1178 17.7242 12 17.9723 12H23.0277C23.2758 12 23.507 12.1178 23.6418 12.3129L25.1107 14.4381H28.0831C28.7311 14.4381 29.348 14.6865 29.7995 15.122C30.2503 15.5569 30.5 16.1425 30.5 16.7492V25.6889C30.5 26.2956 30.2503 26.8812 29.7995 27.3161C29.348 27.7516 28.7311 28 28.0831 28H12.9169C12.2689 28 11.652 27.7516 11.2005 27.3161C10.7497 26.8812 10.5 26.2956 10.5 25.6889V16.7492C10.5 16.1425 10.7497 15.5569 11.2005 15.122C11.652 14.6865 12.2689 14.4381 12.9169 14.4381H15.8893L17.3582 12.3129ZM20.4992 16.5852C18.0514 16.5852 16.0991 18.4943 16.0991 20.8113C16.0991 23.1283 18.0514 25.0373 20.4992 25.0373C22.9471 25.0373 24.8993 23.1283 24.8993 20.8113C24.8993 18.4943 22.9471 16.5852 20.4992 16.5852Z" fill="white"/>
                    </svg>
                    <p-fileUpload mode="advanced" name="demo[]" [auto]="true" accept="image/*" #attachments [maxFileSize]="10000000" (onSelect)="onBasicUpload($event)"></p-fileUpload>
                    <span class="pi pi-times delete-image" *ngIf="element.columnValue" (click)="deleteImg()"></span>
                  </div>
                 </div>
                `,
})

export class AppTyperoomImg implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  @Input() dataView;
  @ViewChild('attachments') attachment;
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
  ) { }
  ngOnInit(): void {
    if(this.modelFields[this.element.field_name] && this.modelFields[this.element.field_name].error) {
      this.modelFields[this.element.field_name].error = false;
    }
  }

  onRemoveImage(e) {
    console.log('e')
  }

  deleteImg() {
    this.element.columnValue = '';
    this.attachment['_files'] = []
  }
  onBasicUpload(event) {
    if (event.currentFiles.length > 0) {
        const getDAte = new Date();
        const getTime = getDAte.getTime();
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`s-hrm/file-attach/${getTime}-${event.currentFiles[0].name}`).put(event.currentFiles[0]);
        uploadTask.on('state_changed', (snapshot) => {
        }, (error) => {
          this.spinner.hide();
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            if (downloadURL) {
              this.spinner.hide();
              this.element.columnValue = downloadURL;
            }
          });
        });
    }
    else{
      this.spinner.hide();
    }
  }

}


// onoff -title
@Component({
  selector: 'app-type-onOff',
  template: `   <div class="fileds onoff">
                    <div class="d-flex">
                      <span>{{element.columnLabel}}</span>
                      <p-inputSwitch [(ngModel)]="element.columnValue"></p-inputSwitch>
                    </div>
                 </div>
                `,
})

export class AppTypeonOff implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  @Input() dataView;
  value = false
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
  ) { }
  ngOnInit(): void {
    if(this.modelFields[this.element.field_name] && this.modelFields[this.element.field_name].error) {
      this.modelFields[this.element.field_name].error = false;
    }
  }

  ngOnChanges(event) {
    if (event && event.element) {
      if(event.element.currentValue.columnValue === "0"){
        this.element.columnValue = false
      }else if(event.element.currentValue.columnValue === "1"){
        this.element.columnValue = true
      }
    }
  }
  
}

// autocomplete

@Component({
  selector: 'app-type-autocomplete',
  template: ` 
  <div class="field-group">  
  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
  <div> 
  <p-autoComplete [(ngModel)]="element.columnValue" [disabled]="element.isDisable" name="cusId" [baseZIndex]="100" [appendTo]="'body'" [style]="{width: '100%'}"
  [suggestions]="element.options" placeholder="Nhập Tìm kiếm theo tên" (onSelect)="onSelectCus($event, element.field_name)"
  (completeMethod)="search($event)" field="name" [required]="element.isRequire && element.isVisiable && !element.isEmpty"></p-autoComplete>
  <span class="pi pi-search child-search-emp" (click)="isSearchEmp = true" *ngIf="element.field_name==='empId'"></span>
  <app-hrm-search-emp [isSearch]="isSearchEmp" (seachEmValue)="seachEmValue($event)"></app-hrm-search-emp>
          <div *ngIf="modelFields[element.field_name+element.group_cd]?.isRequire && submit && modelFields[element.field_name+element.group_cd]?.error"
                class="alert-validation alert-danger">
                <div [hidden]="!modelFields[element.field_name+element.group_cd]?.error">
                {{modelFields[element.field_name+element.group_cd].message}}
                </div>
             </div>
</div></div>
                `,
})
export class AppTypeSelectAutocompleteComponent implements OnInit, OnChanges {
  @Input() element;
  @Input() dataView;
  @Input() modelFields;
  @Input() submit = false;
  isSearchEmp = false;
  constructor(
    private apiHrmV2Service: ApiHrmV2Service,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit(): void {
  }

  seachEmValue(event) {
    if(!event.value) {
      this.isSearchEmp = false;
    }else{
      this.element.columnValue = {
        name: event.dataInfo.full_name,
        code: event.dataInfo.empId
      }
    }
  }
  ngOnChanges(event) {
    if (event && event.element) {
      this.element = event.element.currentValue
    }
  }

  search(event) {
    this.getObjectList(this.element, event.query)
  }

  onSelectCus(e, field_name) {
    this.modelFields[`${this.element.field_name}${this.element.group_cd}`].error = false;
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

   getObjectList(element1, filter) {
    const organizeId =  this.getValueByKey('org_cds');
    if(element1.columnObject) {
      const apis = element1.columnObject.split("?");
      element1.columnObject = apis[0].toString() + `?filter=${filter}&organizeId=${organizeId}`;
      this.apiHrmV2Service.getAutocompleteLinkApiV2(element1.columnObject, element1.field_name).subscribe(results => {
        if (results.result.length > 0) {
          element1.options = results.result;
        }
      })
    }
   
  }
}


// autocomplete multiple


@Component({
  selector: 'app-type-autocompletes',
  template: ` 
  <div class="fields">  
  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
  <div> 
  <p-autoComplete [(ngModel)]="element.columnValue" [disabled]="element.isDisable" [multiple]="true"  [baseZIndex]="100" [appendTo]="'body'" [style]="{width: '100%'}"
  [suggestions]="element.options" placeholder="Nhập Tìm kiếm theo tên" (onSelect)="onSelectCus($event, element.field_name)"
  (completeMethod)="search($event)" field="name" [required]="element.isRequire && element.isVisiable && !element.isEmpty"></p-autoComplete>
          <div *ngIf="modelFields[element.field_name+element.group_cd]?.isRequire && submit && modelFields[element.field_name+element.group_cd]?.error"
                class="alert-validation alert-danger">
                <div [hidden]="!modelFields[element.field_name+element.group_cd]?.error">
                {{modelFields[element.field_name+element.group_cd].message}}
                </div>
             </div>
</div></div>
                `,
})
export class AppTypeSelectAutocompletesComponent implements OnInit, OnChanges {
  @Input() element;
  @Input() dataView;
  @Input() modelFields;
  @Input() submit = false;
  isSearchEmp = false;
  constructor(
    private apiHrmV2Service: ApiHrmV2Service,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit(): void {
    console.log(this.element)
  }

  seachEmValue(event) {
    if(!event.value) {
      this.isSearchEmp = false;
    }else{
      this.element.columnValue = {
        name: event.dataInfo.full_name,
        code: event.dataInfo.empId
      }
    }
  }
  ngOnChanges(event) {
    if (event && event.element) {
      this.element = event.element.currentValue
    }
  }

  search(event) {
    this.getObjectList(this.element, event.query)
  }

  onSelectCus(e, field_name) {
    this.modelFields[`${this.element.field_name}${this.element.group_cd}`].error = false;
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

   getObjectList(element1, filter) {
    if(element1.columnObject) {
      const apis = element1.columnObject.split("?");
      element1.columnObject = apis[0].toString() + `?filter=${filter}&userIds=${element1.columnValue}`;
      this.apiHrmV2Service.getAutocompleteLinkApiV2s(element1.columnObject, element1.field_name).subscribe(results => {
        if (results.result.length > 0) {
          element1.options = results.result
        }
      })
    }
   
  }
}

//end

@Component({
  selector: 'app-type-label',
  template: `
    <div class="fileds field-group">
      <div style = "color: #465373; font-weight: 500; font-size: 14px;">{{element.columnLabel}}</div>
    </div>`,
})

export class AppLabel implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  @Input() dataView;
  constructor() { }

  ngOnInit(): void {
  }
}
