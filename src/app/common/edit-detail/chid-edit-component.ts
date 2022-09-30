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
import { checkIsObject } from '../function-common/objects.helper';
import { MessageService } from 'primeng/api';
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
    element.columnValue = element.columnValue.trim();
    if (element.columnValue === '') {
      this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false
      this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : ''
      let numberDay = moment().daysInMonth();
      if (field_name === 'annualAdd')
        if (this.element.columnValue > numberDay) {
          this.modelFields[field_name].error = true;
          this.modelFields[field_name].message = "Phép bù đã nhập lớn hơn số ngày trong tháng này";
        }
      return;
    }else {
      this.modelFields[field_name].error =false;
      this.modelFields[field_name].message = ''
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
      <p-treeSelect [appendTo]="'body'" [name]="element.field_name" [filterInputAutoFocus]="true" [filter]="true" [options]="element.options || []" [(ngModel)]="element.columnValue" [filterInputAutoFocus]="true"  selectionMode="single" [disabled]="element.isDisable" placeholder="Select Item" (onNodeSelect)="selectNode($event)" [required]="element && element.isRequire && element?.isVisiable && !element.isEmpty"></p-treeSelect>
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

    this.element.columnValue  = typeof this.element.columnValue === 'object' ? this.element.columnValue : null
    checkIsObject
  }

  checkIsObject(data: any): boolean {
    return checkIsObject(data);
  }

  selectNode(event) {
    if(this.element.field_name === "org_Id"){
      this.setValue('', 'User_Id')
    }
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


// selectTrees nhiều

@Component({
  selector: 'app-type-selectTrees',
  template: `  
     <div class="field-group select treeselect" [ngClass]="'valid'" > 
     <label class="text-nowrap label-tex" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
     <p-treeSelect [appendTo]="'body'"
       [options]="element.options || []" [(ngModel)]="element.columnValue"  [filterInputAutoFocus]="true" [filter]="true" [metaKeySelection]="false" selectionMode="checkbox"
        [disabled]="element.isDisable" placeholder="Select Item" (onNodeSelect)="selectNode($event)"
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
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    checkIsObject
  }

  checkIsObject(data: any): boolean {
    return checkIsObject(data);
  }

  selectNode(event) {
    console.log("selectNode", this.element.columnValue)
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
  floorID = '';
  constructor(
    private apiService: ApiHrmService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
  ) { }
  async ngOnInit() {
    if (this.element.field_name === 'parentId') {
      const orgId = await this.getValueByKey('orgId');
      const adm_st = await this.getValueByKey('adm_st');
      this.getAgentLeaders(orgId, this.element, adm_st);
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
          if (element1.field_name === 'PayrollTypeId') {
            this.getPayrollTypeList(value, element1)
          }
          // if (element1.field_name === 'EmployeeId') {
          //   this.loading = true;
          //   this.getUserByPushByEmpId(value, element1)
          // }else 
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
          if ((element1.columnType === 'selectTree') && ((element1.field_name === 'orgId') || (element1.field_name === 'departmentId'))) {
            this.getOrganizeTree(value, element1);
          }else if (element1.columnType === 'selectTrees') {
            this.getOrganizeTree(value, element1);
          } else if (element1.field_name === 'jobId') {
            const positionTypeCd = await this.getValueByKey('positionCd');
            this.getJobTitles(value, element1, positionTypeCd)
          } else if (element1.field_name === 'full_name' || element1.field_name === 'empId' || element1.field_name === 'EmployeeId') {
            this.getUserByPush(value, element1)
          } else if (element1.field_name === 'work_cd') {
            this.getWorkTime(element1, value)
          }else if(element1.field_name === 'CompanyId') {
            this.getCompaniesByOrganize(element1, value)
          }
          // else if(element1.field_name === 'EmployeeId') {

          // }
        });
      });
    } else if (field_name === 'organize_id') {
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if (element1.field_name === 'requester_custId' || element1.field_name === 'empId') {
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
    } else if(field_name === 'floor_No') {
      this.floorID = value
      console.log('value', value)
      this.dataView.forEach(element => {
        element.fields.forEach(async element1 => {
          if(element1.field_name === 'roomId'){
            this.getRooms(element1, value);
            const emitType = {
              name: 'floor_no',
              id: value
            }
            this.callback.emit(emitType);
          }
        })
      })
    } else if(field_name === 'roomId'){
      const emitType = {
        name: 'roomId',
        id: value,
        floorID: this.floorID
      }
      console.log('emitType', emitType)
      this.callback.emit(emitType);
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

  getCompaniesByOrganize(element1, root_orgId) {
    const queryParams = queryString.stringify({ organizeId: root_orgId, filter: '' });
    this.apiService.getCompaniesByOrganize(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data.map(d => {
          return {
            label: d.companyName,
            value: `${d.companyId}`
          }
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
        this.loading = false
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
        // element1.columnValue = results.data[0];
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
                      <p-fileUpload accept="image/jpeg,image/png,image/jpg,image/gif,.mp4,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,application/msword,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document" *ngIf="!isUpload" [chooseLabel]="''" [chooseIcon]="''"  
                      [multiple]="isUploadMultiple ? true : null" [showUploadButton]="false" [showCancelButton]="false" [customUpload]="true" name="demo[]" 
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
                    <div class="file-uploaded" *ngIf="element.columnValue.length > 0">
                      <h3 class="uploaded-title">Đã upload xong {{ element.columnValue.length }} file</h3>
                      <ul *ngIf="uploadedFiles.length > 0">
                          <li class="d-flex middle bet" *ngFor="let file of uploadedFiles; let i=index">{{file}} 
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
                    <div class="file-uploaded" *ngIf="(element.columnValue.length > 0) && (uploadedFiles.length === 0)">
                    <ul>
                        <li class="d-flex middle bet" *ngFor="let file of element.columnValue; let i=index">{{file}} 
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
    this.element.columnValue = this.element.columnValue && (typeof this.element.columnValue === 'string') ? this.element.columnValue.split(',') : []
    this.dataView.forEach(element => {
      element.fields.forEach(async element1 => {
        if (((element1.field_name === 'AttachName') || (element1.field_name === 'attached_name') || (element1.field_name === 'attachName')) && element1.columnValue ) {
          this.uploadedFiles = element1.columnValue.split(',')
        } 
      });
    });
  }
  removeImage1(i) {
    this.element.columnValue.splice(i, 1);
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
        for(let index in event.currentFiles) {
          const getDAte = new Date();
          const getTime = getDAte.getTime();
          const storageRef = firebase.storage().ref();
          const uploadTask = storageRef.child(`s-hrm/images/${getTime}-${event.currentFiles[index].name}`).put(event.currentFiles[index]);
          uploadTask.on('state_changed', (snapshot) => {
          }, (error) => {
          }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              if(!this.isUploadMultiple){
                this.element.columnValue = []
              }
              this.element.columnValue.push(downloadURL)
              this.spinner.hide();
              this.dataView.forEach(element => {
                element.fields.forEach(async element1 => {
                  if ((element1.field_name === 'AttachName') || (element1.field_name === 'attached_name') || (element1.field_name === 'attachName')) {
                    if(!this.isUploadMultiple){
                      this.uploadedFiles = []
                    }
                    this.uploadedFiles.push(event.currentFiles[index].name);
                    element1.columnValue = this.uploadedFiles.toString();
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
                    element.fields.forEach(async element1 => {
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
          }
          
        }
        if (this.element.field_name === 'meta_file_url') {
          // danh sach file dinh kem, ct ns
          this.callback.emit(event.currentFiles);
        }
      }else{
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Không hỗ trợ định dạng file' });
      }
      setTimeout(() => {
        this.isUpload = false;
      }, 1000);
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
                          <li *ngIf="i < 33" (click)="activeName(i)" >
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
                     <div class="head"><input id="president_{{member.group}}_{{i}}" type="checkbox" style="margin-right: 5px" name="{{member.group}}_{{i}}" (change)="handleChangeParent(member, i)" [checked]="member?.isCheck" /> <h3 class="title">{{member.group}} ({{member.child.length}})</h3></div>
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
    ) { }
    ngOnInit(): void {
      this.modelFields[this.element.field_name].error = false;
      this.getSelectMembers();
    }

    getSelectMembers() {
      this.selectMembers = [];
      this.members = [];
      const dataNew = this.element.columnValue ?  this.element.columnValue.split(',') : [];
      for(let item of this.element.options) {
        for(let item1 of item.child) {
          if(dataNew.indexOf(item1.userId) > -1) {
            item1.isCheck = true;
            this.selectMembers.push({...item1, isCheck: this.selectMembers.length === 0 ? true : false});
          }
          const isCheckAll =item.child.filter(d => d.isCheck === true);
          if(isCheckAll.length === item.child.length) {
            item.isCheck = true;
          }
        }
       
      }
      this.element.options = [...this.element.options]
    }

    cancelAdd() {
      this.newMember = false
    }
    async searchEm() {
      // this.searchMember.emit(this.searchText);
      // const queryParams = queryString.stringify(
      //   { fullName: fullName, offSet: 0, pageSize: 1000, organizeId: organizeId, orgId: orgId  })
      //     this.apiService.getHrmFormsPerson(queryParams).subscribe( res => {
      this.spinner.show();
      const organizeId = await this.getValueByKey('organizeId');
      let orgId:any = await this.getValueByKey('org_Id');
      orgId = typeof orgId === 'string' ? orgId : orgId.orgId;
        const queryParams = queryString.stringify(
          { fullName: this.searchText, offSet: 0, pageSize: 50, organizeId: organizeId, orgId: orgId})
        this.apiService.getHrmFormsPerson(queryParams).subscribe( res => {
          this.spinner.hide();
          if(res.status === 'success') {
            this.members = cloneDeep(this.element.options);
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
      this.newMember = false;
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
      this.getSelectMembers();
      this.searchEm();
      if(this.members.length > 0) {
        this.element.options = cloneDeep(this.members);
        for(let item of this.element.options) {
          for(let item1 of item.child) {
            if(this.selectMembers.map(d => d.userId).indexOf(item1.userId) > -1) {
              item1.isCheck = true;
            }else {
              item1.isCheck = false;
            }
          }
          
        }
        // this.element.options = [...this.element.options]
      }
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
  }

// chips, member out company
@Component({
  selector: 'app-type-chips',
  template: `   <div class="fileds field-group">
                  <label class="text-nowrap label-text" >{{element.columnLabel}} <span style="color:red" *ngIf="element.isRequire">*</span></label>
                  <div class="">
                    <p-chips [(ngModel)]="element.columnValue" name="{{element.field_name}}"></p-chips>
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
  constructor(
    private apiService: ApiHrmService
  ) { }
  ngOnInit(): void {
    this.modelFields[this.element.field_name].error = false;
  }

  luau() {
    console.log(this.element.columnValue)
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
    this.modelFields[this.element.field_name].error = false;
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
    this.modelFields[this.element.field_name].error = false;
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
    this.modelFields[this.element.field_name].error = false;
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
