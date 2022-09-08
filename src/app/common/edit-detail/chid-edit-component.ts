import { cloneDeep } from 'lodash';
import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as queryString from 'querystring';
import * as firebase from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { stringtodate } from '../function-common/common';
import * as numeral from 'numeral';
import * as moment from 'moment';
import { ValidationNumberDayInMonth, ValidationNumberDayInMonthEmpty, ValidationNumber, ValidationNumberEmpty } from './validation';
import { checkIsObject } from '../function-common/objects.helper';
@Component({
  selector: 'app-type-text',
  template: ` <div class="field-group text" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="modelFields[element.field_name] && modelFields[element.field_name].isRequire">*</span></label>
                  <input type="text" class="form-control" [(ngModel)]="element.columnValue" (change)="onChangeValue($event.target, element.field_name, element)"
                  name={{element.field_name}} [disabled]="element.isDisable"
                  (focus)="foucusIn($event)"
                  (focusout)="foucusOut($event)"
                  [required]="element.isRequire && element.isVisiable && !element.isEmpty">
                  <div *ngIf="modelFields[element.field_name] && modelFields[element.field_name].isRequire && submit && modelFields[element.field_name].error"
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
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
    let numberDay = moment().daysInMonth();
    if (field_name === 'annualAdd')
      if (this.element.columnValue > numberDay) {
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
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
  }

}


// selectTree

@Component({
  selector: 'app-type-selectTree',
  template: `  
     <div class="field-group select treeselect" [ngClass]="'valid'" > 
     <label class="text-nowrap label-tex" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
      <p-treeSelect [options]="element.options || []" [(ngModel)]="element.columnValue" [filterInputAutoFocus]="true"  selectionMode="single" [disabled]="element.isDisable" placeholder="Select Item" (onNodeSelect)="selectNode($event)" [required]="element && element.isRequire && element?.isVisiable && !element.isEmpty"></p-treeSelect>
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
    console.log('element', this.element)
    checkIsObject
  }

  checkIsObject(data: any): boolean {
    return checkIsObject(data);
  }

  selectNode(event) {
    console.log("selectNode", event.node)
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
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false;
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
    console.log('a:', cloneDeep(this.element));
    if (event && event.element) {
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
          <div class="field-group select " [ngClass]=" element.columnValue ? 'valid' : 'invalid' " >
          <div class="uni-load " [ngClass]="loading ? 'loading' : ''"></div>
          <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                <p-dropdown appendTo="body" [baseZIndex]="100" [autoDisplayFirst]="false"
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
                <div *ngIf="modelFields[element.field_name] && modelFields[element.field_name].isRequire && submit && modelFields[element.field_name].error"
                  class="alert-validation alert-danger">
                  <div [hidden]="!modelFields[element.field_name].error">
                  {{modelFields[element.field_name].message}}
                </div>
            </div>
                `,
})
export class AppTypeDropdownComponent implements OnInit, AfterViewChecked {
  @Input() element;
  @Input() dataView;
  @Input() paramsObject;
  @Output() callback = new EventEmitter<any>();
  @Input() modelFields;
  @Input() submit = false;
  loading = false;
  constructor(
    private apiService: ApiHrmService,
    private changeDetector: ChangeDetectorRef,
  ) { }
  async ngOnInit() {
    if (this.element.field_name === 'parentId') {
      const orgId = await this.getValueByKey('orgId');
      const adm_st = await this.getValueByKey('adm_st');
      this.getAgentLeaders(orgId, this.element, adm_st);
    }
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
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
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false;
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
    }else if (field_name === 'CompanyId') {
      this.dataView.forEach(element => {
        element.fields.forEach(element1 => {
          if (element1.field_name === 'EmployeeId') {
            this.loading = true;
            this.getUserByPushByEmpId(value, element1)
          }else if (element1.field_name === 'PayrollTypeId') {
            this.getPayrollTypeList(value, element1)
          }
        });
      });
    } else if (field_name === 'type_salary') {
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
    } else if (field_name === 'organizeId') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.columnType === 'selectTree' && (element1.field_name === 'orgId' || element1.field_name === 'departmentId')) {
            this.getOrganizeTree(value, element1);
          } else if (element1.field_name === 'jobId') {
            const positionTypeCd = await this.getValueByKey('positionCd');
            this.getJobTitles(value, element1, positionTypeCd)
          } else if (element1.field_name === 'full_name' || element1.field_name === 'empId') {
            this.getUserByPush(value, element1)
          } else if (element1.field_name === 'work_cd') {
            this.getWorkTime(element1, value)
          }
        });
      });
    } else if (field_name === 'organize_id') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'requester_custId') {
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
          } else if (element1.field_name === 'email') {
            this.setValue(items[0].email, element1.field_name)
          } else if (element1.field_name === 'departmentName') {
            this.setValue(items[0].departmentName, element1.field_name)
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
    } else if (field_name === 'holi_type') {
      this.callback.emit(value);
    }
  }

  getWorkTime(element1, root_orgId) {
    const queryParams = queryString.stringify({ organizeId: root_orgId });
    this.apiService.getWorktimeList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.work_times + '-' + d.work_name, value: d.work_cd }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : '';
      }
    })
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
      element.fields.forEach(element1 => {
        if (element1.field_name === field_name) {
          element1.columnValue = value;
          this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !element1.columnValue ? true : false;
          this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
        }
      });
    });
  }


  getUserByPush(orgId, element1) {
    const queryParams = queryString.stringify({ orgId: orgId });
    this.apiService.getEmployeeSearch(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.loading = false;
        element1.options = results.data.map(d => {
          return {
            label: d.fullName + '-' + d.phone,
            value: element1.field_name === 'CustId' ? d.custId : d.userId,
            ...d
          }
        });
        // element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  
  getUserByPushByEmpId(orgId, element1) {
    const queryParams = queryString.stringify({ orgId: orgId });
    this.apiService.getEmployeeSearch(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.fullName + '-' + d.phone,
            value: `${d.empId}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getPayrollTypeList(orgId, element1) {
    const queryParams = queryString.stringify({organizeId: orgId});
    this.apiService.getHrmPayrollTypePage(queryParams).subscribe(results => {
      if (results.status === 'success') {
        if(results.data && results.data.dataList.data.length > 0){
          element1.options = cloneDeep(results.data.dataList.data).map(d => {
            return {
              label: `${d.name}`,
              value: `${d.id}`
            }
          });
        }else {
          element1.options = []
        }
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
        this.modelFields[element1.field_name].error = this.modelFields[element1.field_name].isRequire && !element1.columnValue ? true : false;
        this.modelFields[element1.field_name].message = this.modelFields[element1.field_name].error ? 'Trường bắt buộc nhập !' : ''
      }
    })
  }

}


// number


@Component({
  selector: 'app-type-number',
  template: `   <div class="field-group" [ngClass]=" element.columnValue ? 'valid' : 'invalid' ">
  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <input type="number" class="form-control" [(ngModel)]="element.columnValue"
                    name={{element.field_name}} [disabled]="element.isDisable" (change)="onChangeValue($event.target, element.field_name, element)"
                    [required]="element.isRequire && element.isVisiable && !element.isEmpty">
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

    if (field_name === 'from_day' || field_name === 'to_day') {
      if (element.isRequire) {
        this.modelFields[field_name] = { ...this.modelFields[field_name], ...ValidationNumberDayInMonth(event.value) }
      } else {
        this.modelFields[field_name] = { ...this.modelFields[field_name], ...ValidationNumberDayInMonthEmpty(event.value) }
      }
    } else {
      if (element.isRequire) {
        this.modelFields[field_name] = { ...this.modelFields[field_name], ...ValidationNumber(event.value) }
      } else {
        this.modelFields[field_name] = { ...this.modelFields[field_name], ...ValidationNumberEmpty(event.value) }
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
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
  }
}


// checkbox

@Component({
  selector: 'app-type-checkbox',
  template: `   
                <div class="field-group checkbox">
                <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                 <div class="checkbox-wrap"> <p-checkbox name={{element.field_name}} [binary]="true" 
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
    this.modelFields[field_name].error = false
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
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''

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
    if (changes.element && this.element && this.element.columnValue) {
      if (typeof this.element.columnValue === 'string') {
        this.element.columnValue = stringtodate(this.element.columnValue);
      }
    }
  }
  ngOnInit(): void {
  }

  onChangeValue(value, field_name) {
    this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false;
    this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập' : '';
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
                  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <p-multiSelect [options]="element.options" [(ngModel)]="element.columnValue" (onChange)="onChangeValue($event.value, element.field_name)"
                  name={{element.field_name}} defaultLabel="Select a option" optionLabel="name" display="chip">
                </p-multiSelect>

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
            <label  class="text-nowrap label-text" >{{element.columnLabel}}</label>
                    <div class="control-image" style="display: flex" *ngIf="this.element.columnValue">
                      <input type="text" class="form-control" (change)="setvalueImage($event)" [value]="this.element.columnValue">
                      <button pButton pRipple type="button" (click)="removeAttach()" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text"></button>
                      <div *ngIf="imagesUpload && (fileType ==='image/jpeg' || fileType ==='image/png' || fileType ==='image/jpg' || fileType ==='image/gif') else otherFile" >
                        <p-image  src="{{imagesUpload}}" alt="Image" width="250" height="250" ></p-image>
                      </div>
                    </div>
                    <div *ngIf="!this.element.columnValue" class="upload_file"><input class="" type="file"  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, application/msword, image/*, application/vnd.ms-powerpoint,
                    text/plain, application/vnd.ms-excel" (change)="onUploadOutputImage($event)" ></div>
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
  fileType: any = ''
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
      if (element.field_name === "meta_file_type") {
        this.fileType = element.columnValue;
      }
      if (element.field_name === "meta_file_url") {
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
          this.spinner.hide();
        });
      });
    }
    if (this.element.field_name === 'file_attach') {
      this.spinner.show();
      let fomrData = new FormData();
      fomrData.append('file', event.target.files[0]);
      this.apiService.uploadDrive(fomrData)
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



// linkUrl
@Component({
  selector: 'app-type-linkurl-drag',
  template: `   
            <div>
            <div class="wrap-upload">
                      <p-fileUpload [chooseLabel]="''" [chooseIcon]="''" [showUploadButton]="false" [showCancelButton]="false" [customUpload]="true" name="demo[]" url="./upload.php" 
                       (onSelect)="uploadHandler($event)" [maxFileSize]="10000000">
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
                    <div class="file-uploaded" *ngIf="uploadedFiles.length">
                      <h3 class="uploaded-title">Đã upload xong</h3>
                      <ul>
                          <li class="d-flex middle bet" *ngFor="let file of uploadedFiles">{{file.name}} 
                            <span (click)="removeImage($event)">
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
  @Input() submit = false;
  uploadedFiles: any[] = [];
  downloadURL = '';
  imagesUpload = '';
  fileType: any = ''
  constructor(
    private apiService: ApiHrmService,
    private spinner: NgxSpinnerService,
  ) { }
  ngOnInit(): void {
    this.dataView.forEach(element => {
      element.fields.forEach(async element1 => {
        if (element1.field_name === 'AttachName' && element1.columnValue) {
          this.uploadedFiles.push({name: element1.columnValue});
        } 
      });
    });
  }

  removeImage(event) {
    this.downloadURL = ''
    this.element.columnValue = '';
    this.uploadedFiles = []
  }
  
  uploadHandler(event) {
       this.uploadedFiles = []
      // for(let file of event.files) {
      
      // }
      this.spinner.show();
      if (event.currentFiles[0] && event.currentFiles[0].size > 0) {
        const getDAte = new Date();
        const getTime = getDAte.getTime();
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`s-hrm/images/${getTime}-${event.currentFiles[0].name}`).put(event.currentFiles[0]);
        uploadTask.on('state_changed', (snapshot) => {
        }, (error) => {
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.element.columnValue = downloadURL;
            this.spinner.hide();
            this.dataView.forEach(element => {
              element.fields.forEach(async element1 => {
                if (element1.field_name === 'AttachName') {
                  element1.columnValue = event.currentFiles[0].name;
                  this.uploadedFiles.push({name: event.currentFiles[0].name});
                } 
              });
            });
          }).catch(error => {
            this.spinner.hide();
          });
        });
    }
  }


}