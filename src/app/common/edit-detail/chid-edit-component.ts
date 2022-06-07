import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as queryString from 'querystring';
import * as firebase from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { stringtodate } from '../function-common/common';
import * as numeral from 'numeral';
import * as moment from 'moment';
import { ValidationNumberDayInMonth, ValidationNumberDayInMonthEmpty, ValidationNumber, ValidationNumberEmpty } from './validation';
@Component({
  selector: 'app-type-text',
  template: ` <div class="field-group text" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                  <input type="text" class="form-control" [(ngModel)]="element.columnValue" (change)="onChangeValue($event.target, element.field_name, element)"
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
  }

  onChangeValue(value, field_name, element) {
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire ? this.element.columnValue ? false : true : false
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
    let numberDay = moment().daysInMonth();
    if(field_name === 'annualAdd')
      if( this.element.columnValue > numberDay ){
        this.modelFields[field_name].error = true;
        this.modelFields[field_name].message = "Phép bù đã nhập lớn hơn số ngày trong tháng này";
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
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire ? this.element.columnValue ? false : true : false
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
  }

}


// selectTree

@Component({
  selector: 'app-type-selectTree',
  template: `  
    <div class="field-group select treeselect" [ngClass]="'valid'"> 
      <p-treeSelect [(ngModel)]="element.columnValue" [options]="element.options" [required]="element.isRequire && element.isVisiable && !element.isEmpty" (onNodeSelect)="onChangeTree($event, element.field_name, element)" [disabled]="element.isDisable" selectionMode="single"  placeholder="Select Item"></p-treeSelect>
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
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    // if (this.element.options && this.element.options.length > 0) {
    //   this.element.options = this.element.options.forEach(element => {
    //     element.value = parseInt(element.value);
    //   })
    // }
  }

  getCompanyList(orgId, element1) {
    const queryParams = queryString.stringify({ orgId: orgId });
    this.apiService.getCompanyList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.companyName, value: d.companyId }
        });
        element1.columnValue = element1.columnValue ? parseInt(element1.columnValue) : ''
      }
    })
  }

  onChangeTree(event, field_name, element) {
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire ? this.element.columnValue ? false : true : false
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
    if (field_name === 'orgId') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'companyId') {
            this.getCompanyList(event.node.orgId, element1);
          } else if (element1.field_name === 'positionId') {
            this.getPositionList(event.node.orgId, element1);
          }
        });
      });
    }
  }
  ngOnChanges(event) {
    if (event && event.element) {
      this.element = event.element.currentValue
    }
  }

  getPositionList(orgId, element1) {
    const queryParams = queryString.stringify({ orgId: orgId });
    this.apiService.getPositionList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.positionName, value: d.positionId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }
}


// dropdown


@Component({
  selector: 'app-type-dropdown',
  template: `   
          <div class="field-group select" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                <p-dropdown appendTo="body" [baseZIndex]="100" [autoDisplayFirst]="false"
                  [disabled]="element.isDisable" [options]="element.options" (onChange)="onChangeValue($event.value, element.field_name, element)" [filterBy]="'label'"
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
    if (this.element.field_name === 'parentId') {
      const orgId = await this.getValueByKey('orgId');
      const adm_st = await this.getValueByKey('adm_st');
      this.getAgentLeaders(orgId, this.element, adm_st);
    }
  }

  async getValueByKey(key) {
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
      return await value
    }
  }

  onChangeValue(value, field_name, element) {
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire ? this.element.columnValue ? false : true : false
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
    if (field_name === 'orgId') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'parentId') {
            const adm_st = await this.getValueByKey('adm_st');
            this.getAgentLeaders(value, element1, adm_st);
          } else if (element1.field_name === 'CustId') {
            this.getUserByPush(value, element1)
          }
        });
      });
    } else if (field_name === 'org_cds') {
      this.dataView.forEach(element => {
        element.fields.forEach(element1 => {
          if (element1.field_name === 'full_name' || element1.field_name === 'empId') {
            this.getUserByPush(value, element1)
          }
        });
      });
    }else if (field_name === 'type_salary') {
      this.dataView.forEach(element => {
        element.fields.forEach(element1 => {
          if (element1.field_name === 'from_day') {
            element1.isVisiable = value == 2 ? true : false;
            this.setValue(25, element1.field_name)
          }else if (element1.field_name === 'to_day') {
            element1.isVisiable = value == 2 ? true : false;
            this.setValue(24, element1.field_name)
          }else if (element1.field_name === 'salary_start_dt') {
            const date = value == 1 ? new Date(moment().startOf('month').format()): new Date(new Date().getFullYear(), numeral(moment(new Date()).add(-2, 'months').format('MM')).value(), 25);
            this.setValue(date, element1.field_name)
          }else if (element1.field_name === 'salary_next_dt') {
            const date = value == 1 ? new Date(moment().endOf('month').format()): new Date(new Date().getFullYear(), numeral(moment(new Date()).add(-1, 'months').format('MM')).value(), 24);
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
    } else if (field_name === 'organizeId') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.columnType === 'selectTree' && element1.field_name === 'orgId') {
            this.getOrganizeTree(value, element1);
          } else if (element1.field_name === 'jobId') {
            const positionTypeCd = await this.getValueByKey('positionCd');
            this.getJobTitles(value, element1, positionTypeCd)
          }else if (element1.field_name === 'full_name' || element1.field_name === 'empId') {
            this.getUserByPush(value, element1)
          }
        });
      });
    }else if(field_name === 'organize_id'){
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if(element1.field_name === 'requester_custId') {
            this.getUserByPush(value, element1)
          }
        });
      });
    } else if (field_name === 'CustId') {
      let items = element.options.filter(d => d.custId === value);
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'Phone') {
            this.setValue(items[0].phone, element1.field_name)
          }else if(element1.field_name === 'email') {
            this.setValue(items[0].email, element1.field_name)
          }
        });
      });
    } else if (field_name === 'positionId') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'positionTitleId') {
            this.getPositionTitles(value, element1)
          }
        });
      });
    } else if (field_name === 'positionCd') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'jobId') {
            const root_orgId = await this.getValueByKey('organizeId');
            this.getJobTitles(root_orgId, element1, value)
          }
        });
      });
    } else if (field_name === 'adm_st') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'parentId') {
            const orgId = await this.getValueByKey('orgId');
            this.getAgentLeaders(orgId, element1, value);
          }
        });
      });
    } else if (field_name === 'base_id') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'base_amt') {
            const items = this.element.options.filter(s => s.value === value);
            if (items.length > 0) element1.columnValue = items[0].label.split('[')[1].replace(']', '');
          }
        });
      });
    } else if (field_name === 'contractTypeId') {
      this.callback.emit(value);
    }
  }

  getPositionTitles(positionId, element1) {
    const queryParams = queryString.stringify({ PositionId: positionId });
    this.apiService.getPositionTitles(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.positionName, value: d.positionId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  setValue(value, field_name) {
    this.dataView.forEach(element => {
      element.fields.forEach( element1 => {
        if (element1.field_name === field_name) {
          element1.columnValue = value;
          this.modelFields[field_name].error = this.modelFields[field_name].isRequire ? element1.columnValue ? false : true : false
          this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
        }
      });
    });
  }


  getUserByPush(orgId, element1) {
    this.apiService.getUserByPush({ organizeId: orgId, orgIds: [orgId] }).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data.map(d => {
          return {
            label: d.fullName + '-' + d.phone,
            value: element1.field_name === 'CustId' ? d.custId : d.userId,
            ...d
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getJobTitles(orgId, element1, positionTypeCd) {
    const queryParams = queryString.stringify({ orgId: orgId, positionTypeCd: positionTypeCd });
    this.apiService.getJobs(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data.map(d => {
          return {
            label: d.job_name,
            value: `${d.jobId}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
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

  getOrganizeTree(orgId, element1) {
    const queryParams = queryString.stringify({ parentId: orgId });
    this.apiService.getOrganizeTree(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data;
        element1.columnValue = results.data[0];
        this.modelFields[element1.field_name].error = this.modelFields[element1.field_name].isRequire ? element1.columnValue ? false : true : false
        this.modelFields[element1.field_name].message = this.modelFields[element1.field_name].error ? 'Trường bắt buộc nhập !' : ''
      }
    })
  }

}


// number


@Component({
  selector: 'app-type-number',
  template: `   <div class="field-group" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                  <input type="number" class="form-control" [(ngModel)]="element.columnValue"
                    name={{element.field_name}} [disabled]="element.isDisable" (change)="onChangeValue($event.target, element.field_name, element)"
                    [required]="element.isRequire && element.isVisiable && !element.isEmpty">
                  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <div *ngIf="submit && modelFields[element.field_name].error" class="alert-validation alert-danger"> 
                    <div [hidden]="!modelFields[element.field_name].error">
                      {{modelFields[element.field_name].message}}
                    </div>
                  </div>
                </div>
                `,
})

export class AppTypeNumberComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
  }

  onChangeValue(event, field_name, element) {
    // if(field_name === 'from_day' || field_name === 'to_day'){
     
    // }else{
    //   this.modelFields[field_name].error = this.modelFields[field_name].isRequire ? this.element.columnValue ? false : true : false
    //   this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
    // }
    // if(element.isRequire) {
    //   this.modelFields[field_name] = {...this.modelFields[field_name], ...ValidationNumberDayInMonth(event.value)}
    // }else{
    //     this.modelFields[field_name] = {...this.modelFields[field_name], ...ValidationNumberDayInMonthEmpty(event.value)}
    // }

    if(field_name === 'from_day' || field_name === 'to_day'){
      if(element.isRequire) {
        this.modelFields[field_name] = {...this.modelFields[field_name], ...ValidationNumberDayInMonth(event.value)}
      }else{
        this.modelFields[field_name] = {...this.modelFields[field_name], ...ValidationNumberDayInMonthEmpty(event.value)}
      }
    }else{
      if(element.isRequire) {
        this.modelFields[field_name] = {...this.modelFields[field_name], ...ValidationNumber(event.value)}
      }else{
        this.modelFields[field_name] = {...this.modelFields[field_name], ...ValidationNumberEmpty(event.value)}
      }
    }
    
  }
}



// currency

@Component({
  selector: 'app-type-currency',
  template: `   <div class="field-group text" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                  <input maxLength=18 type="text" (change)="changePrice($event, element.field_name, element)"
                  class="form-control" [(ngModel)]="element.columnValue" currency name={{element.field_name}}
                  [disabled]="element.isDisable"  [required]="element.isRequire && element.isVisiable && !element.isEmpty">
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
  @Input() modelFields;
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

  changePrice(event, field_name, element) {
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire ? this.element.columnValue ? false : true : false
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
  }
}


// checkbox

@Component({
  selector: 'app-type-checkbox',
  template: `   
                <div class="field-group checkbox">
                  <p-checkbox name={{element.field_name}} [binary]="true" label="{{element.columnLabel}}"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty" [disabled]="element.isDisable"
                  [(ngModel)]="element.columnValue" (onChange)="onChangeValue($event.value, element.field_name, element)"></p-checkbox>
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

export class AppTypeCheckboxComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    this.element.columnValue = this.element.columnValue == 'true' || this.element.columnValue == true ? true : false
  }

  onChangeValue(value, field_name, element) {
    this.modelFields[field_name].error = false
  }

}

// textarea

@Component({
  selector: 'app-type-textarea',
  template: `   
              <div class="field-group textarea">
                  <textarea type="text" placeholder="" class="form-control"
                  [(ngModel)]="element.columnValue" name={{element.field_name}} [disabled]="element.isDisable"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty"
                  (change)="onChangeValue($event.target, element.field_name, element)"
                  maxlength="200"
                  ></textarea>
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
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {

  }
  onChangeValue(value, field_name, element) {
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire ? this.element.columnValue ? false : true : false
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''

  }
}


// datetime

@Component({
  selector: 'app-type-datetime',
  template: `   
  <div class="field-group date" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
                  <p-calendar placeholder="DD/MM/YYYY" appendTo="body" [baseZIndex]="101" [disabled]="element.isDisable" (onSelect)="onChangeValue($event, element.field_name)"
                  [(ngModel)]="element.columnValue" [monthNavigator]="true" [yearNavigator]="true" (onBlur)="onChangeValue($event, element.field_name)"
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
  @Input() modelFields;
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

  onChangeValue(value, field_name) {
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire ? this.element.columnValue ? false : true : false;
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập' : '';
  }


}


// datefulltime

@Component({
  selector: 'app-type-datefulltime',
  template: `   
            <div class="field-group date" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
            <p-calendar placeholder="DD/MM/YYYY hh:ss" appendTo="body" [baseZIndex]="101" [disabled]="element.isDisable"
                  [(ngModel)]="element.columnValue" [monthNavigator]="true" [showTime]="true" hourFormat="24" [yearNavigator]="true"
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

export class AppTypeDatefulltimeComponent implements OnInit {
  @Input() element;
  @Input() modelFields;
  @Input() submit = false;
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    this.modelFields[this.element.field_name].error = false
  }

}


// timeonly

@Component({
  selector: 'app-type-timeonly',
  template: `   <div class="field-group date" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
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
    this.modelFields[this.element.field_name].error = false
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
    this.modelFields[this.element.field_name].error = false;
  }

}

// linkUrl
@Component({
  selector: 'app-type-linkurl',
  template: `   
            <div class="field-group attach-file">
                    <div class="control-image" style="display: flex" *ngIf="this.element.columnValue">
                      <input type="text" class="form-control" (change)="setvalueImage($event)" [value]="this.element.columnValue">
                      <button pButton pRipple type="button" (click)="removeAttach()" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text"></button>
                    </div>
                    <label  class="text-nowrap label-text" >{{element.columnLabel}}</label>
                    <div *ngIf="!this.element.columnValue" class="upload_file"><input class="" type="file"  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, application/msword, image/*, application/vnd.ms-powerpoint,
                    text/plain, application/vnd.ms-excel" (change)="onUploadOutputImage($event)" ></div>
                    <input type="file" style="display: none" id="sign_second" name="sign_second"  accept="image/jpeg,image/png,image/jpg,image/gif" (change)="onUploadOutputImage($event)">
                    <div *ngIf="element.isRequire && submit && !element.columnValue"
                        class="alert-validation alert-danger">
                        <div [hidden]="element.columnValue">
                          Trường bắt buộc nhập!
                        </div>
                    </div> 
                    <div *ngIf="imagesUpload && (fileType ==='image/jpeg' || fileType ==='image/png' || fileType ==='image/jpg' || fileType ==='image/gif') else otherFile" >
                      <p-image  src="{{imagesUpload}}" alt="Image" width="250" height="250" ></p-image>
                    </div>
                    <ng-template #otherFile class="">
                      <div *ngIf="imagesUpload">
                          <a style="display: block;
                          min-width: 60px;
                          line-height: 47px;
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
  fileType: any =''
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
  ) { }
  ngOnInit(): void {
    this.imagesUpload = this.element.columnValue ? this.element.columnValue : ''
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
      if(element.field_name === "meta_file_type"){
        this.fileType = element.columnValue;
      }
      if(element.field_name === "meta_file_url"){
        this.imagesUpload = element.columnValue;
      }
    })
  }

  onUploadOutputImage(event) {
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
          this.spinner.show();
        });
      });
    }
  }

}