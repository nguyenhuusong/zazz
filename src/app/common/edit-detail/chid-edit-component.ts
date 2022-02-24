import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as queryString from 'querystring';
import * as firebase from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { stringtodate } from '../function-common/common';
import * as numeral from 'numeral';

@Component({
  selector: 'app-type-text',
  template: ` <div class="field-group text" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                  <input type="text" class="form-control" [(ngModel)]="element.columnValue" (change)="onChangeValue($event.target, element.field_name)"
                  name={{element.field_name}} [disabled]="element.isDisable"
                  (focus)="foucusIn($event)"
                  (focusout)="foucusOut($event)"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty">
                  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="modelFields[element.field_name].isRequire">*</span></label>
                  <div *ngIf="modelFields[element.field_name].isRequire && submit && modelFields[element.field_name].error"
                      class="alert-validation alert-danger">
                      <div [hidden]="!modelFields[element.field_name].error">
                        {{modelFields[element.field_name].message}}
                      </div>
                  </div>
                </div>
                `,
})
export class AppTypeTextComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  constructor() { }
  ngOnInit(): void {
    console.log(this.modelFields)
  }

  onChangeValue(value, field_name) {
    this.modelFields[field_name].error = false;
  }

  foucusOut(e){

  }

  foucusIn(e){
    
  }
}

// select

@Component({
  selector: 'app-type-select',
  template: `   
          <div class="field-group select" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
            <p-dropdown appendTo="body" [baseZIndex]="100" [autoDisplayFirst]="false"  [filterBy]="'label'"
              [disabled]="element.isDisable" [options]="element.options"
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
            <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
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
}


// selectTree

@Component({
  selector: 'app-type-selectTree',
  template: `  
    <div class="field-group select treeselect" [ngClass]=" element.columnValue ? 'valid' : 'invalid' "> 
      <p-treeSelect [(ngModel)]="element.columnValue" [options]="element.options" [required]="element.isRequire && element.isVisiable && !element.isEmpty" (onNodeSelect)="onChangeTree($event, element.field_name)" [disabled]="element.isDisable" selectionMode="single"  placeholder="Select Item"></p-treeSelect>
      <div *ngIf="element.isRequire && submit && !element.columnValue"
          class="alert-validation alert-danger">
          <div [hidden]="element.columnValue">
            Trường bắt buộc nhập!
          </div>
      </div>
      <label class="text-nowrap label-tex" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
    </div>
                `,
})
export class AppTypeSelectTreeComponent implements OnInit, OnChanges {
  @Input() element;
  @Input() dataView;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    console.log(this.element.columnValue)
    // if (this.element.options && this.element.options.length > 0) {
    //   this.element.options = this.element.options.forEach(element => {
    //     element.value = parseInt(element.value);
    //   })
    // }
  }

  getCompanyList(org_id, element1) {
    const queryParams = queryString.stringify({ org_id: org_id });
    this.apiService.getCompanyList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.companyName, value: d.companyId }
        });
        element1.columnValue = element1.columnValue ? parseInt(element1.columnValue) : ''
      }
    })
  }

  onChangeTree(event, field_name) {
    if (field_name === 'org_id') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'companyId') {
            this.getCompanyList(event.node.org_id, element1);
          }
        });
      });
    }
  }
  ngOnChanges(event) {
    if(event && event.element) {
      this.element = event.element.currentValue
    }
  }
}


// dropdown


@Component({
  selector: 'app-type-dropdown',
  template: `   
          <div class="field-group select" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                <p-dropdown appendTo="body" [baseZIndex]="100" [autoDisplayFirst]="false"
                  [disabled]="element.isDisable" [options]="element.options" (onChange)="onChangeValue($event.value, element.field_name)" [filterBy]="'label'"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty" [(ngModel)]="element.columnValue"
                  name={{element.field_name}} [filter]="true">
                  <ng-template let-item pTemplate="selectedItem">
                    <span style="vertical-align:middle;">{{item.label}}</span>
                  </ng-template>
                  <ng-template let-car pTemplate="item">
                    <div class="ui-helper-clearfix" style="position: relative;height: 25px;">
                      <div style="font-size:14px;float:right;margin-top:4px">{{car.label}}</div>
                    </div>
                  </ng-template>
                </p-dropdown>
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <div *ngIf="modelFields[element.field_name].isRequire && submit && modelFields[element.field_name].error"
                  class="alert-validation alert-danger">
                  <div [hidden]="!modelFields[element.field_name].error">
                  {{modelFields[element.field_name].message}}
                </div>
            </div>
                `,
})
export class AppTypeDropdownComponent implements OnInit {
  @Input() element;
  @Input() dataView;
  @Input() paramsObject;
  @Output() callback = new EventEmitter<any>();
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  async ngOnInit() {
    if (this.element.field_name === 'parent_id') {
      const org_id = await this.getValueByKey('org_id');
      const adm_st = await this.getValueByKey('adm_st');
      this.getAgentLeaders(org_id, this.element, adm_st);
    }
  }

  async getValueByKey(key) {
    if(this.dataView && this.dataView.length > 0) {
      let value = ''
      for (let i = 0; i < this.dataView.length; i++) {
        for (let j = 0; j < this.dataView[i].fields.length; j++) {
          if (this.dataView[i].fields[j].field_name === key) {
            value = this.dataView[i].fields[j].columnValue;
            break;
          }
        }
      }
      return await value
    }
  }


  onChangeValue(value, field_name) {
    this.modelFields[field_name].error = false;
    if (field_name === 'org_id') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'parent_id') {
            const adm_st = await this.getValueByKey('adm_st');
            this.getAgentLeaders(value, element1, adm_st);
          }
        });
      });

    }else if (field_name === 'root_org_id') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.columnType === 'selectTree' && element1.field_name === 'org_id') {
            this.getOrganizeTree(value, element1);
          }else if(element1.field_name === 'job_id') {
            const positionTypeCd = await this.getValueByKey('positionCd');
            this.getJobTitles(value,element1, positionTypeCd) 
          }
        });
      });
    }else if (field_name === 'positionCd') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
         if(element1.field_name === 'job_id') {
            const root_org_id = await this.getValueByKey('root_org_id');
            this.getJobTitles(root_org_id,element1, value) 
          }
        });
      });
    }  else if (field_name === 'adm_st') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'parent_id') {
            const org_id = await this.getValueByKey('org_id');
            this.getAgentLeaders(org_id, element1, value);
          }
        });
      });
    }else if (field_name === 'base_id') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'base_amt') {
            const items = this.element.options.filter(s => s.value === value);
            if(items.length > 0)  element1.columnValue = items[0].label.split('[')[1].replace(']', '');
          }
        });
      });
    }else if (field_name === 'contract_type') {
      this.callback.emit(value);
    }
  }

  getJobTitles(org_id,element1, positionTypeCd) {
    const queryParams = queryString.stringify({ org_id: org_id, positionTypeCd: positionTypeCd });
    this.apiService.getJobs(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.job_name,
            value: `${d.job_id}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getAgentLeaders(org_id, element1, isAdmin) {
    const queryParams = queryString.stringify({ org_id: org_id, admin_is: isAdmin });
    this.apiService.getAgentLeaders(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.fullName, value: d.saler_id }
        });
        element1.columnValue = element1.columnValue ? parseInt(element1.columnValue) : '';
      }
    })
  }

  getOrganizeTree(org_id, element1) {
    const queryParams = queryString.stringify({ parent_id: org_id });
    this.apiService.getOrganizeTree(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data;
        element1.columnValue = results.data[0];
      }
    })
  }

}


// number


@Component({
  selector: 'app-type-number',
  template: `   
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <div>
                  <input type="number" class="form-control" [(ngModel)]="element.columnValue"
                  name={{element.field_name}} [disabled]="element.isDisable"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty">

                <div *ngIf="element.isRequire && submit && !element.columnValue"
                    class="alert-validation alert-danger">
                    <div [hidden]="element.columnValue">
                    Trường bắt buộc nhập!
                    </div>
                </div>
            </div>
                `,
})

export class AppTypeNumberComponent implements OnInit {
  @Input() element;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
  }
}



// currency

@Component({
  selector: 'app-type-currency',
  template: `   <div class="field-group text" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                  <input maxLength=18 type="text" (change)="changePrice($event)"
                  class="form-control" [(ngModel)]="element.columnValue" currency name={{element.field_name}}
                  [disabled]="element.isDisable" [required]="element.isRequire && element.isVisiable && !element.isEmpty">
                  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>

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
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    this.element.columnValue = this.element.columnValue ? this.formatNumber(this.element.columnValue) : '';
  }

  formatNumber(value) {
    return numeral(value).format('0,0[.][00]');
  }

  changePrice(event) {

  }
}


// checkbox

@Component({
  selector: 'app-type-checkbox',
  template: `   
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <div>
                  <p-checkbox name={{element.field_name}} [binary]="true" label="{{element.columnLabel}} :"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty" [disabled]="element.isDisable"
                  [(ngModel)]="element.columnValue"></p-checkbox>

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
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {

  }

}

// textarea

@Component({
  selector: 'app-type-textarea',
  template: `   
              <div class="field-group textarea">
                  <textarea type="text" placeholder="" class="form-control"
                  [(ngModel)]="element.columnValue" name={{element.field_name}} [disabled]="element.isDisable"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty"></textarea>
                  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>

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
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {

  }

}


// datetime

@Component({
  selector: 'app-type-datetime',
  template: `   
  <div class="field-group date" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                  <p-calendar placeholder="DD/MM/YYYY" appendTo="body" [baseZIndex]="101" [disabled]="element.isDisable"
                  [(ngModel)]="element.columnValue" [monthNavigator]="true" [yearNavigator]="true"
                  yearRange="2000:2030" inputId="navigators" [required]="element.isRequire && element.isVisiable && !element.isEmpty"
                  dateFormat="dd/mm/yy" name={{element.field_name}}></p-calendar>
                  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>

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
  constructor(
    private apiService: ApiHrmService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.element && this.element && this.element.columnValue) {
      if (typeof this.element.columnValue === 'string') {
        this.element.columnValue = stringtodate(this.element.columnValue);
      }
    }
  }
  ngOnInit(): void {
  }

}


// datefulltime

@Component({
  selector: 'app-type-datefulltime',
  template: `   
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <div>
                  <p-calendar placeholder="DD/MM/YYYY" appendTo="body" [baseZIndex]="101" [disabled]="element.isDisable"
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
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
  }

}


// timeonly

@Component({
  selector: 'app-type-timeonly',
  template: `   
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <div>
                <p-calendar placeholder="DD/MM/YYYY" appendTo="body" [baseZIndex]="101" [disabled]="element.isDisable"
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
                `,
})

export class AppTypeTimeonlyComponent implements OnInit {
  @Input() element;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {

  }
}


// multiSelect

@Component({
  selector: 'app-type-multiSelect',
  template: `   <div class="field-group multi-select">
                  <p-multiSelect [options]="element.options" [(ngModel)]="element.columnValue" (onChange)="onChangeValue($event.value, element.field_name)"
                  name={{element.field_name}} defaultLabel="Select a option" optionLabel="name" display="chip">
                </p-multiSelect>
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>

                <div *ngIf="modelFields[element.field_name].isRequire && submit && modelFields[element.field_name].error"
                    class="alert-validation alert-danger">
                      <div [hidden]="!modelFields[element.field_name].error">
                        {{modelFields[element.field_name].message}}
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
    this.modelFields[field_name].error = false;
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
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
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
  @Input() submit = false;

  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {


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
  @Input() submit = false;

  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {

  }

}

// linkUrl
@Component({
  selector: 'app-type-linkurl',
  template: `   
            <div class="field-group attach-file">
                    <div style="display: flex" *ngIf="this.element.columnValue">
                      <input type="text" class="form-control" (change)="setvalueImage($event)" [value]="this.element.columnValue">
                      <button pButton pRipple type="button" (click)="removeAttach()" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text"></button>
                    </div>
                    <label  class="text-nowrap label-text" >{{element.columnLabel}}</label>
                    <div *ngIf="!this.element.columnValue" class="upload_file"><input class="" type="file"  accept="image/*" (change)="onUploadOutputImage($event)" ></div>
                    <input type="file" style="display: none" id="sign_second" name="sign_second"  accept="image/jpeg,image/png,image/jpg,image/gif" (change)="onUploadOutputImage($event)">
                    <div *ngIf="element.isRequire && submit && !element.columnValue"
                        class="alert-validation alert-danger">
                        <div [hidden]="element.columnValue">
                          Trường bắt buộc nhập!
                        </div>
                    </div>
                    <div *ngIf="this.element.columnValue">
                    <p-image  src="{{this.element.columnValue}}" alt="Image" width="250" [preview]="true"></p-image>
                    </div>
                </div>
                `,
})

export class AppTypeLinkUrlRadioListComponent implements OnInit {
  @Input() element;
  @Input() dataView;
  @Input() submit = false;

  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
  ) { }
  ngOnInit(): void {
    
  }

  removeAttach() {
    this.element.columnValue = '';
  }

  setvalueImage(event) {
    this.element.columnValue = event.target.value
  }

  onUploadOutputImage(event){
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
                  this.dataView.forEach(element => {
                    element.fields.forEach(async element1 => {
                      if (element1.field_name === 'meta_file_type') {
                        element1.columnValue = event.target.files[0].type
                      }else if(element1.field_name === 'meta_file_size') {
                        element1.columnValue = event.target.files[0].size
                      }else if(element1.field_name === 'meta_file_name') {
                        element1.columnValue = event.target.files[0].name
                      }else if(element1.field_name === 'meta_file_url') {
                        element1.columnValue = downloadURL
                      }
                    });
                  });
                  console.log(this.dataView)
                  this.spinner.hide();
                }
              
            }).catch(error => {
              this.spinner.show();
            });
        });
    }
}

}