import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring'
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AgGridFn } from 'src/app/utils/common/function-common';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import * as numeral from 'numeral';
import { delay, of, tap, timer } from 'rxjs';
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
  ) { }
  @Output() callback = new EventEmitter<any>();
  @Output() callbackcancel = new EventEmitter<any>();
  @Output() callback1 = new EventEmitter<any>();
  @Output() callbackButton = new EventEmitter<any>();
  @Input() thongtinnhanvienNew: boolean = false;
  @Input() isNested: boolean = false;
  @Input() manhinh;
  @Input() dataView = [];
  @Input() projects = [];
  includeImage = false;
  @Input() paramsObject;
  @Input() detailInfo = null;
  @Input() isViewButtonTop = true;
  buttonSave = 'Update';
  @Input() optionsButtonsEdit: any = [
    { label: 'Hủy', value: 'Cancel', class: 'p-button-secondary', icon: 'pi pi-times' },
    { label: 'Lưu lại', value: 'Update', class: '', icon: 'pi pi-check' }
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
  public modules: Module[] = AllModules;
  public agGridFn = AgGridFn;
  query = {
    filter: '',
    offset: 0,
    pageSize: 15,
    gridWidth: 0
  };
  modelFields = {};
  ngOnInit(): void {
    this.callApiDrop();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  resetData(value) {
    this.callbackcancel.emit(value);
  }
  submit = false

  callApiDrop() {
    let array = [...this.dataView];
    this.dataView =[];
    array.forEach(element => {
      element.fields.forEach(async element1 => {
        if (element1.columnType === 'markdown' || element1.columnType === 'linkUrl') {
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
        if (element1.columnType === 'select' || element1.columnType === 'dropdown' || element1.columnType === 'selectTree'
          || element1.columnType === 'checkboxList' || element1.columnType === 'checkboxradiolist'
          || element1.columnType === 'multiSelect') {
          //callApi intentions
          if (element1.field_name === 'project_cd') {

          } else if (element1.field_name === 'orgId' || element1.field_name === 'departmentId') {
            if (element1.columnType === 'selectTree') {
              element1.isVisiable = false;
              const root_orgId = await this.getValueByKey('organizeId');
              setTimeout(() => {
                this.getOrganizeTree(root_orgId, element1);
              }, 100);
            } else {
              setTimeout(() => {
                this.getOrgRoots(element1);
              }, 100);
            }
          } else if (element1.field_name === 'actionlist') {
           setTimeout(() => {
            this.getActionlist(element1)
           }, 500);
          } else if (element1.field_name === 'work_cds') {
            this.getWorkTimes(element1, null)
          } else if (element1.field_name === 'empId') {
            const root_orgId = await this.getValueByKey('organizeId');
            setTimeout(() => {
            this.getEmployeePage(root_orgId, element1);
            }, 500);
          } else if (element1.field_name === 'shift_cds') {
            this.getWorkShifts(element1, null)
          } else if (element1.field_name === 'work_cd') {
            setTimeout(() => {
              this.getWorkTime(element1, this.detail.empId)
            }, 100);
          } else if (element1.field_name === 'shift_cd') {
            this.getWorkShift(element1, this.detail.empId)
          } else if (element1.field_name === 'bank_code') {
            this.getBankList(element1)
          } else if (element1.field_name === 'parentId') {
            const orgId =await this.getValueByKey('orgId');
            const adm_st =await this.getValueByKey('adm_st');
            this.getAgentLeaders(orgId, element1, adm_st);
          } else if (element1.field_name === 'posistionCd') {
            const root_orgId = this.detail.organizeId ? this.detail.organizeId : null;
            this.getOrgPositions(root_orgId, element1);
          } else if (element1.field_name === 'positionId') {
            const orgId =await this.getValueByKey('orgId');
            setTimeout(() => {
              this.getPositionList(orgId, element1);
            }, 100);
          
          } else if (element1.field_name === 'positionTitleId') {
            const positionId =await this.getValueByKey('positionId');
            this.getPositionTitles(positionId, element1);
          } if (element1.field_name === 'companyId') {
            this.getCompanyList(this.detail.organizeId ? this.detail.organizeId : null, element1);
          } else if (element1.field_name === 'company_id') {
            this.getCompanyList(this.detail.organizeId ? this.detail.organizeId : null, element1);
          } else if (element1.field_name === 'reportTo') {
            const root_orgId = this.detail ? this.detail.organizeId : null
            this.getEmpLeaders(element1, root_orgId);
          } else if (element1.field_name === 'acc_no') {
            const cif_no = this.detail.cif_no
            this.getAccountList(element1, cif_no);
          } else if (element1.field_name === 'jobId') {
            const root_orgId =await this.getValueByKey('organizeId');
            const positionTypeCd =await this.getValueByKey('positionCd');
            this.getJobTitles(root_orgId, element1, positionTypeCd);
          } else if (element1.field_name === 'organizeId') {
            this.getOrgRoots(element1);
          }else if(element1.field_name === 'organize_id'){
            this.getOrgRoots(element1);
          } else if (element1.field_name === 'org_cds') {
            this.getOrgRootsMuti(element1);
          } else if (element1.field_name === 'full_name') {
            const org_cds =await this.getValueByKey('org_cds');
            this.getUserByPush(org_cds, element1);
          }else if(element1.field_name === 'requester_custId'){
            // const org_cds =await this.getValueByKey('org_cds');
            const root_orgId = await this.getValueByKey('organize_id');
            console.log(root_orgId, 'root_orgId')
            this.getEmployeePage(root_orgId, element1);
          } else if (element1.field_name === 'source_ref') {
            this.getNotifyRefList(element1);
          } else if (element1.field_name === 'contractTypeId') {
            this.getContractTypes(element1);
          } else if (element1.field_name === 'salary_type') {
            const contractTypeId =await this.getValueByKey('contractTypeId');
            this.getSalaryTypes(contractTypeId, element1);
          } else if (element1.field_name === 'base_id') {
            this.getSalaryBases(element1);
          } else if (element1.field_name === 'hiring_man_id') {
            this.getUsersByAdmin(element1, 1);
          } else if (element1.field_name === 'hiring_user_id') {
            this.getUsersByAdmin(element1, 0);
          } else if (element1.field_name === 'vacancyId') {
            this.getVacancyPage(element1);
          } else if (element1.field_name === 'educationId') {
            this.getEducations(element1);
          } else if (element1.field_name === 'workplaceId') {
            this.getWorkplaces(element1);
          } else if (element1.field_name === 'sub_prod_cd' && element1.columnType === 'checkboxList') {
            this.getProductProjs(element1);
          } else if (element1.field_name === 'roomId') {
            this.getMeetRooms(element1);
          } else if (element1.field_name === 'content_type' || element1.field_name === 'isPublish') {
            this.GetCustObjectList(element1);
          } else if (element1.field_name === 'vehicleTypeId') {
            this.getVehicleTypes(element1);
          } else if (element1.field_name === 'year_of_birth') {
            this.GetYearPicker(element1);
          } else if (element1.field_name === 'annualMonth') {
            this.GetAnnualMonth(element1);
          }else if(element1.field_name === 'reason_code') { 
            this.getLeaveReasons(element1)
          } else if (element1.field_name === 'parent_type_id' || element1.field_name === 'form_type') {
            this.getFormTypePage(element1);
          } else {
            if(element1.columnObject) {
              this.getCustObjectListNew(element1);
            }
          }
        }else if(element1.columnType === 'input'){
          if (element1.field_name === 'annualYear') {
            this.GetAnnualYear(element1);
          } 
        }
      });
    });
    setTimeout(() => {
      this.dataView =array;
    console.log(this.dataView)

    }, 1000);
  }

  getFormTypePage(element1) {
    this.apiService.getFormTypes()
    .subscribe(response => {
      if (response.status === 'success') {
        element1.options = cloneDeep(response.data)
        .map(d => {
          return {
            label: d.formTypeName,
            value: d.formTypeId
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue: ''
      } else {
        console.error(response.message);
      }
    })
  }

  getLeaveReasons(element1) {
      this.apiServiceCore.getLeaveReasons().subscribe(results => {
        if (results.status === 'success') {
          element1.options = cloneDeep(results.data).map(d => {
            return {
              label: d.name,
              value: d.code
            }
          });
          element1.columnValue = element1.columnValue ? element1.columnValue: ''
        }
      })
  }

  getActionlist(element1) {
    element1.options = cloneDeep(this.dropdownList).map(d => {
      return {
        name: d.itemName,
        code: d.id
      }
    });
    if (element1.columnValue) {
      let newarray = []
      element1.options.forEach(element => {
        if (element1.columnValue.split(",").indexOf(element.code) > -1) {
          newarray.push(element);
        }
      });
      element1.columnValue = newarray;
    }
  }

  getWorkShift(element1, empId) {
    const queryParams = queryString.stringify({ empId: empId });
    this.apiService.getWorkShifts(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.shift_name + '-' + d.shift_cd, value: d.shift_cd }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  GetYearPicker(element1) {
    let minYear = 1990;
    let maxYear = 2030;
    let listYears = []
    for (let i = minYear; i <= maxYear; i++) {
      listYears.push({ label: i, value: i.toString() })
    }
    element1.options = listYears;
    element1.columnValue = element1.columnValue ? element1.columnValue : ''

  }

  GetAnnualMonth(element1) {
    let listMonths = []
    for (let i = 1; i <= 12; i++) {
      listMonths.push({ label: 'Tháng ' + i, value: i.toString() })
    }
    element1.options = listMonths;
    element1.columnValue = element1.columnValue ? element1.columnValue : ''
  }

  GetAnnualYear(element1) {
    element1.columnValue = moment().year();
  }

  getWorkTime(element1, empId) {
    const queryParams = queryString.stringify({ empId: empId });
    this.apiService.getWorkTimes(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.work_times + '-' + d.work_name, value: d.work_cd }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : '';
      }
    })
  }


  getContractTypes(element1) {
    if(this.detail.organizeId){
      const queryParams = queryString.stringify({ organizeId: this.detail.organizeId });
      this.apiService.getContractTypes(queryParams).subscribe(results => {
        if (results.status === 'success') {
          element1.options = cloneDeep(results.data).map(d => {
            return {
              label: d.contractTypeName,
              value: `${d.contractTypeId}`
            }
          });
          element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
        }
      })
    }
  }

  getSalaryBases(element1) {
    this.apiService.getSalaryBases().subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.base_name + ' [' + numeral(d.base_amt).format('0,0') + ']',
            value: `${d.base_id}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getWorkShifts(element1, empId) {
    const queryParams = queryString.stringify({ empId: empId });
    this.apiService.getWorkShifts(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            name: d.shift_name + '-' + d.shift_cd,
            code: d.shift_cd
          }
        });
        if (element1.columnValue) {
          let newarray = []
          element1.options.forEach(element => {
            if (element1.columnValue.split(",").indexOf(element.code) > -1) {
              newarray.push(element);
            }
          });
          element1.columnValue = newarray;
        }
      }
    })
  }

  getWorkTimes(element1, empId) {
    const queryParams = queryString.stringify({ empId: empId });
    this.apiService.getWorkTimes(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            name: d.work_times + '-' + d.work_cd,
            code: d.work_cd
          }
        });
        if (element1.columnValue) {
          let newarray = []
          element1.options.forEach(element => {
            if (element1.columnValue.split(",").indexOf(element.code) > -1) {
              newarray.push(element);
            }
          });
          element1.columnValue = newarray;
        }
      }
    })
  }
  getBankList(element1) {
    this.apiService.getBankList().subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.bank_name + '-' + d.bank_code,
            value: d.bank_code
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getEmpLeaders(element1, root_orgId) {
    const queryParams = queryString.stringify({ root_orgId: root_orgId });
    this.apiService.getEmpLeaders(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.fullName + ' [' + d.job_name + '-' + d.org_name + ']',
            value: d.empId
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }


  getAccountList(element1, cif_no) {
    const queryParams = queryString.stringify({ cif_no: cif_no, offSet: 0, pageSize: 1000 });
    this.apiService.getAccountPage(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data.dataList.data).map(d => {
          return {
            label: d.acc_no + '-' + d.link_acc_bank,
            value: d.acc_no
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
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.job_name,
            value: `${d.jobId}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getSalaryTypes(contractTypeId, element1) {
    const queryParams = queryString.stringify({ contractTypeId: contractTypeId });
    this.apiService.getSalaryTypes(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.salary_type_name,
            value: `${d.salary_type}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getUserByPush(orgId, element1) {
    this.apiService.getUserByPush({ organizeId: orgId, orgIds: [orgId] }).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.fullName + '-' + d.phone,
            value: `${d.userId}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getEmployeePage(orgId, element1) {
    const queryParams = queryString.stringify({ orgId: orgId, pageSize: 100000000 });
    this.apiService.getEmployeePage(queryParams).subscribe(results => {
      if (results.status === 'success') {
        const options = results.data.dataList.data.map(d => {
            return {
              label: d.full_name + '-' + d.phone1,
              value: d.empId
            }
          });
          element1.options =options
          element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getOrgRootsMuti(element1) {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        if (element1.columnType === 'multiSelect') {
          element1.options = []
          element1.options = cloneDeep(results.data).map(d => {
            return {
              name: d.organizationName,
              code: `${d.organizeId}`
            }
          });
          if (element1.columnValue) {
            let newarray = [];
            element1.options.forEach(element => {
              if (element1.columnValue.split(",").indexOf(element.code) > -1) {
                newarray.push(element);
              }
            });
            element1.columnValue = newarray;
            console.log( element1.columnValue)
          }
        } else {
          element1.options = cloneDeep(results.data).map(d => {
            return {
              label: d.organizationName + ' - ' + d.organizationCd,
              value: `${d.organizeId}`
            }
          });
          element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
        }

      }
    })
  }
  getOrgRoots(element1) {
    const queryParams = queryString.stringify({ filter: '' });
    this.apiService.getOrganizations(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.organizationName,
            value: `${d.organizeId}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getVehicleTypes(element1) {
    this.apiService.getVehicleTypes().subscribe((results: any) => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.vehicleTypeName,
            value: `${d.vehicleTypeId}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getNotifyRefList(element1) {
    this.apiService.getNotifyRefList().subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: d.refName,
            value: `${d.source_ref}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getVacancyPage(element1) {
    const queryParams = queryString.stringify({ active_st: 1 });
    this.apiService.getVacancyPage(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data.dataList.data).map(d => {
          return {
            label: `${d.vacancy_name}`,
            value: `${d.vacancyId}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getEducations(element1) {
    this.apiService.getEducations().subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: `${d.educationName}`,
            value: `${d.educationId}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getWorkplaces(element1) {
    this.apiService.getWorkplaces().subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: `${d.workplaceName}`,
            value: `${d.workplaceId}`
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getMeetRooms(element1): void {
    this.apiService.getMeetRooms()
      .subscribe(results => {
        if (results.status === 'success') {
          element1.options = cloneDeep(results.data).map(d => {
            return {
              label: `${d.room_name}`,
              value: `${d.roomId}`
            };
          });
          element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : '';
        }
      });
  }

  GetCustObjectList(element1): void {
    this.apiServiceCore.getCustObjectList(element1.columnObject)
      .subscribe(results => {
        if (results.status === 'success') {
          element1.options = cloneDeep(results.data).map(d => {
            return {
              label: `${d.objName}`,
              value: `${d.objValue}`
            };
          });
          element1.columnValue = element1.columnValue ? element1.columnValue : '';
          if(element1.field_name === 'content_type' && element1.columnValue) {
            this.modelMarkdow.type = element1.columnValue;
          }
        }
      });
  }

  getUsersByAdmin(element1, admin_st) {
    const queryParams = queryString.stringify({ admin_st: admin_st });
    this.apiService.getUsersByAdmin(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return {
            label: `${d.fullName} [${d.loginName}]`,
            value: d.userId
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
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.fullName, value: d.saler_id }
        });
        element1.columnValue = element1.columnValue ? parseInt(element1.columnValue) : ''
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
  getPositionList(orgId, element1) {
    const queryParams = queryString.stringify({ orgId: orgId });
    this.apiService.getPositionList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data.map(d => {
          return { label: d.positionName, value: d.positionId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getOrgPositions(orgId, element1) {
    const queryParams = queryString.stringify({ orgId: orgId });
    this.apiService.getOrgPositions(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.positionName, value: d.positionCd }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getCompanyList(orgId, element1) {
    const queryParams = queryString.stringify({ orgId: orgId });
    this.apiService.getCompanyList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.companyName, value: d.companyId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getOrganizeTree(orgId, element1) {
    const queryParams = queryString.stringify({ parentId: orgId });
    this.apiService.getOrganizeTree(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data;
        if (element1.columnValue) {
          const queryParams1 = queryString.stringify({ parentId: element1.columnValue });
          this.apiService.getOrganizeTree(queryParams1).subscribe(results => {
            if (results.status === 'success' && results.data.length > 0) {
              element1.columnValue = results.data.length > 0 ? results.data[0] : null;
              element1.isVisiable = true;
            } else {
              element1.columnValue = null;
              element1.isVisiable = true;
            }
          })
        } else {
          element1.columnValue = null;
          element1.isVisiable = true;
        }
      }
    })
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

  getManagerList(element1) {
    const queryParams = queryString.stringify({ userRole: 1, byReport: 1 });
    this.apiService.getManagerList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.fullName + ' [' + d.loginName + ']', value: d.userId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
      }
    })
  }

  getAgencyOrganizeList(element1) {
    const queryParams = queryString.stringify({ sub_prod_cd: '003001', org_level: -1 });
    this.apiService.getAgencyOrganizeList(queryParams).subscribe(results => {
      if (results.status === 'success') {
        element1.options = cloneDeep(results.data).map(d => {
          return { label: d.org_name + '-' + d.org_cd, value: d.orgId }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue.toLowerCase() : ''
      }
    })
  }

  getProductProjs(element1) {
    this.apiService.getProductProjs().subscribe(results => {
      if (results.status === 'success') {
        element1.options = results.data.map(res => {
          return {
            label: `${res.sub_prod_name}`,
            value: res.sub_prod_cd
          }
        });
        element1.columnValue = element1.columnValue ? element1.columnValue : ''
        if (element1.columnValue && typeof element1.columnValue === 'string') {
          let newarray = []
          element1.options.forEach(element => {
            if (element1.columnValue.split(",").indexOf(element.value) > -1) {
              newarray.push(element);
            }
          });
          element1.columnValue = newarray.map(d => d.value);
        }
      }
    })
  }

  getCustObjectListNew(element1) {
    const opts1 = { params: new HttpParams({ fromString: `objKey=${element1.columnObject}` }) };
    this.apiService.getCustObjectListNew(null, opts1.params.toString()).subscribe(results => {
      element1.options = cloneDeep(results.data).map(d => {
        return {
          label: d.objName,
          value: d.objValue
        }
      });
      element1.columnValue = element1.columnValue ? element1.columnValue : ''
      if (element1.columnValue && element1.columnType === 'checkboxradiolist') {
        let newarray = []
        element1.options.forEach(element => {
          if (typeof element1.columnValue === 'string' && element1.columnValue.split(",").indexOf(element.value) > -1) {
            newarray.push(element);
          }
        });
        element1.columnValue = newarray.map(d => d.value);
      }
    });
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
      this.submit = false;
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
      this.callbackButton.emit({type: 'rehire', data: null});
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
          data.columnValue = typeof data.columnValue === 'string' ? `${data.columnValue}:00` : moment(data.columnValue).format('HH:mm:ss');
        } else if (data.columnType === 'selectTree') {
          data.columnValue = data.columnValue ? data.columnValue.data : null;
          delete data.options;
        } else if (data.columnType === 'currency') {
          data.columnValue = numeral(data.columnValue).value()
        } else if ((data.columnType === 'select' || data.columnType === 'multiSelect' || data.columnType === 'dropdown' || data.columnType === 'checkboxList') && data.options) {
          if (data.columnType === 'multiSelect') {
            if (data.columnValue && data.columnValue.length > 0) {
              data.columnValue = data.columnValue.map(d => d.code);
              data.columnValue = data.columnValue.toString()
            }else {
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

}
