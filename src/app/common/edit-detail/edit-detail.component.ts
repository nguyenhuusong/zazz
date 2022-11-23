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
import { findNodeInTree } from '../function-common/objects.helper';
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
    this.dataViewNew = [...this.dataView];
    this.dataView = [];
    this.dataViewNew.forEach(element => {
      element.fields.forEach(async element1 => {
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
              promissall.push(this.apiHrmV2Service.getCustObjectListV2(element1.columnObject, element1.field_name));
            }
          }
        //   if (element1.field_name === 'project_cd') {
        //   } else if ((element1.field_name === 'orgId') || (element1.field_name === 'departmentId') || (element1.field_name === 'org_Id')) {
        //     if ((element1.columnType === 'selectTree') || (element1.columnType === 'selectTrees')) {
        //       const root_orgId = this.getValueByKey('organizeId');
        //       promissall.push(this.apiHrmV2Service.getOrganizeTreeV2(queryString.stringify({ parentId: root_orgId }), element1.field_name));
        //     } else {
        //       promissall.push(this.apiHrmV2Service.getOrganizationsV2(queryString.stringify({ filter: '' }), element1.field_name));
        //     }
        //   } else if (element1.field_name === 'actionlist') {
        //     this.getActionlist(element1)
        //   } else if (element1.field_name === 'work_cds') {
        //     promissall.push(this.apiHrmV2Service.getWorkTimesV2(queryString.stringify({ empId: null }), element1.field_name));
        //   } else if (element1.field_name === 'empId') {
        //     let root_orgId = this.getValueByKey('organize_id');
        //     let organizeIds = ''
        //     this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        //       if(results && results.length>0){
        //         organizeIds = results
        //       }
        //     });
        //     promissall.push(this.apiHrmV2Service.getEmployeePageV2(queryString.stringify(
        //       { orgId: root_orgId, pageSize: 100000, organizeIds: organizeIds, companyIds: '00000000-0000-0000-0000-000000000000' }), element1.field_name));
        //   } else if (element1.field_name === 'shift_cds') {
        //     promissall.push(this.apiHrmV2Service.getWorkShiftsV2(queryString.stringify({ empId: null }), element1.field_name));
        //   } else if (element1.field_name === 'work_cd') {
        //     let root_orgIdOrigin = this.getValueByKey('organizeId');
        //     if (!root_orgIdOrigin) {
        //       root_orgIdOrigin = this.detailInfo?.organizeId;
        //     }
        //     promissall.push(this.apiHrmV2Service.getWorkTimesV2(queryString.stringify({ empId: this.detail.empId }), element1.field_name));
        //   } else if (element1.field_name === 'shift_cd') {
        //     promissall.push(this.apiHrmV2Service.getWorkShiftsV2(queryString.stringify({ empId: this.detail.empId }), element1.field_name));
        //   } else if (element1.field_name === 'bank_code') {
        //     promissall.push(this.apiHrmV2Service.getBankListV2(element1.field_name));
        //   } else if (element1.field_name === 'parentId') {
        //       let url = this.router.url.split('?');
        //       if(url[0] === '/cai-dat/cai-dat-to-chuc/chi-tiet-to-chuc'){
        //         this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        //           if(results && results.length>0){
        //             promissall.push(this.apiHrmV2Service.getOrganizeTreeV2(queryString.stringify({ parentId: results }), element1.field_name));
        //           }
        //         });
        //       }else{
        //         const orgId = this.getValueByKey('orgId');
        //         const adm_st = this.getValueByKey('adm_st');
        //         promissall.push(this.apiHrmV2Service.getAgentLeadersV2(queryString.stringify({ orgId: orgId, admin_is: adm_st }), element1.field_name));
        //       }
            
        //   } else if (element1.field_name === 'posistionCd') {
        //     const root_orgId = this.detail.organizeId ? this.detail.organizeId : null;
        //     promissall.push(this.apiHrmV2Service.getOrgPositionsV2(queryString.stringify({ orgId: root_orgId }), element1.field_name));
        //   } else if (element1.field_name === 'positionId') {
        //     const orgId = this.getValueByKey('organizeId');
        //     promissall.push(this.apiHrmV2Service.getPositionListV2(queryString.stringify({ orgId: orgId }), element1.field_name));
        //   } else if (element1.field_name === 'positionTitleId') {
        //     const positionId = this.getValueByKey('positionId');
        //     promissall.push(this.apiHrmV2Service.getPositionTitlesV2(queryString.stringify({ PositionId: positionId }), element1.field_name));
        //   }else if (element1.field_name === 'companyId' || element1.field_name === 'company_id') {
        //     promissall.push(this.apiHrmV2Service.getCompanyListV2(queryString.stringify({ orgId: this.detail.organizeId ? this.detail.organizeId : null }), element1.field_name));
        //   }else if (element1.field_name === 'companyId3') {
        //     promissall.push(this.apiHrmV2Service.getUserCompanies(queryString.stringify({ organizeIds: this.organizeInfoServiceId }), element1.field_name));
        //     element1.columnValue = element1.columnValue.toUpperCase();
        //   } else if (element1.field_name === 'reportTo' || element1.field_name === 'reportTo1') {
        //     const root_orgId = this.detail ? this.detail.organizeId : null
        //     promissall.push(this.apiHrmV2Service.getEmpLeadersV2(queryString.stringify({ root_orgId: root_orgId }), element1.field_name));
        //   } else if (element1.field_name === 'acc_no') {
        //     const cif_no = this.detail.cif_no
        //     promissall.push(this.apiHrmV2Service.getAccountPageV2(queryString.stringify({ cif_no: cif_no, offSet: 0, pageSize: 1000 }), element1.field_name));
        //   } else if (element1.field_name === 'jobId') {
        //     const root_orgId = this.getValueByKey('organizeId');
        //     const positionTypeCd = this.getValueByKey('positionCd');
        //     promissall.push(this.apiHrmV2Service.getJobsV2(queryString.stringify({ orgId: root_orgId, positionTypeCd: positionTypeCd }), element1.field_name));
        //   } else if (element1.field_name === 'organizeId') {
        //     promissall.push(this.apiHrmV2Service.getOrganizationsV2(queryString.stringify({ filter: '' }), element1.field_name));
        //     if(element1.columnType === 'dropdown' || element1.columnType === 'select'){
        //       this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        //         if(results && results.length>0){
        //           // const dataValidation = {
        //           //   key: element1.field_name,
        //           //   isRequire: false,
        //           //   error: false,
        //           //   message: ''
        //           // }
        //           // this.modelFields[element1.field_name] = dataValidation
        //           element1.columnValue = results;
        //           // element1.isDisable = true;
        //         }
        //         if(this.noDisableInput) {
        //           element1.columnValue = element1.columnValue;
        //           element1.isDisable = false;
        //         }
        //       });
        //     }
        //   } else if (element1.field_name === 'CompanyId') {
        //     const root_orgId = this.getValueByKey('organizeId');
        //     promissall.push(this.apiHrmV2Service.getCompaniesByOrganizeV2(queryString.stringify({ organizeId: root_orgId, filter: '' }), element1.field_name));
        //   } else if (element1.field_name === 'EmployeeId') {
        //     const org_cds = this.getValueByKey('CompanyId');
        //     promissall.push(this.apiHrmV2Service.getEmployeeSearchV2(queryString.stringify({ orgId: org_cds }), element1.field_name));
        //   } else if (element1.field_name === 'PayrollTypeId') {
        //     const org_cds = this.getValueByKey('CompanyId');
        //     promissall.push(this.apiHrmV2Service.getHrmPayrollTypePageV2(queryString.stringify({ organizeId: org_cds }), element1.field_name));
        //   } else if (element1.field_name === 'organize_id' ||  (element1.field_name === 'org_cds')) {
        //     promissall.push(this.apiHrmV2Service.getOrganizationsV2(queryString.stringify({ filter: '' }), element1.field_name));
        //     if(element1.columnType === 'dropdown' || element1.columnType === 'select'){
        //       this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        //         if(results && results.length>0){
        //           element1.columnValue = results;
        //           element1.isDisable = true
        //         }
        //       });
        //     }else if( element1.columnType === "multiSelect" ) {
        //       this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        //         if(results && results.length>0){
        //           element1.columnValue = results
        //           element1.isDisable = true
        //         }
        //       });
        //     }
        //   }else if (element1.field_name === 'full_name') {
        //     const org_cds = this.getValueByKey('org_cds');
        //     promissall.push(this.apiHrmV2Service.getEmployeeSearchV2(queryString.stringify({ orgId: org_cds }), element1.field_name));
        //   } else if (element1.field_name === 'requester_custId') {
        //     const root_orgId = this.getValueByKey('organize_id');
        //     promissall.push(this.apiHrmV2Service.getEmployeePageV2(queryString.stringify({ orgId: root_orgId, pageSize: 100000 }), element1.field_name));
        //   } else if (element1.field_name === 'source_ref') {
        //     promissall.push(this.apiHrmV2Service.getNotifyRefListV2(element1.field_name));
        //   } else if (element1.field_name === 'contractTypeId') {
        //     promissall.push(this.apiHrmV2Service.getContractTypesV2(queryString.stringify({ organizeId: this.detail.organizeId }), element1.field_name));
        //   } else if (element1.field_name === 'salary_type') {
        //     const contractTypeId = this.getValueByKey('contractTypeId');
        //     promissall.push(this.apiHrmV2Service.getSalaryTypesV2(queryString.stringify({ contractTypeId: contractTypeId }), element1.field_name));
        //   } else if (element1.field_name === 'base_id') {
        //     promissall.push(this.apiHrmV2Service.getSalaryBasesV2(element1.field_name));
        //   } else if (element1.field_name === 'hiring_man_id') {
        //     promissall.push(this.apiHrmV2Service.getUsersByAdminV2(queryString.stringify({ admin_st: null }), element1.field_name));
        //   } else if (element1.field_name === 'hiring_user_id') {
        //     promissall.push(this.apiHrmV2Service.getUsersByAdminV2(queryString.stringify({ admin_st: 0 }), element1.field_name));
        //   } else if (element1.field_name === 'vacancyId') {
        //     promissall.push(this.apiHrmV2Service.getPositionTitles(queryString.stringify({ organizeIds: '' }), element1.field_name));
        //     // promissall.push(this.apiHrmV2Service.getVacancyPageV2(queryString.stringify({ active_st: 1 }), element1.field_name));
        //   } else if (element1.field_name === 'educationId') {
        //     promissall.push(this.apiHrmV2Service.getEducationsV2(element1.field_name));
        //   } else if (element1.field_name === 'workplaceId') {
        //     promissall.push(this.apiHrmV2Service.getWorkplacesV2(element1.field_name));
        //   } else if (element1.field_name === 'sub_prod_cd' && element1.columnType === 'checkboxList') {
        //     promissall.push(this.apiHrmV2Service.getProductProjsV2(element1.field_name));
        //   } else if (element1.field_name === 'roomId') {
        //     // const floorId = this.getValueByKey('floor_No');
        //     // promissall.push(this.apiHrmV2Service.getMeetRoomsV2(queryString.stringify({ filter: '', floor_No: floorId }), element1.field_name));
        //   } else if (element1.field_name === 'content_type' || element1.field_name === 'isPublish') {
        //     promissall.push(this.apiHrmV2Service.getObjectListV2(queryString.stringify({ objKey: element1.columnObject }), element1.field_name));
        //   } 
        //   // else if (element1.field_name === 'vehicleTypeId') {
        //   //   promissall.push(this.apiHrmV2Service.getVehicleTypesV2(element1.field_name));
        //   // } 
        //   else if (element1.field_name === 'year_of_birth') {
        //     this.GetYearPicker(element1);
        //   } else if (element1.field_name === 'annualMonth') {
        //     this.GetAnnualMonth(element1);
        //   } else if (element1.field_name === 'reason_code') {
        //     promissall.push(this.apiHrmV2Service.getLeaveReasonsV2(element1.field_name));
        //   } else if (element1.field_name === 'parent_type_id' || element1.field_name === 'form_type') {
        //     await this.getFormTypePage(element1);
        //   } else if(element1.field_name === 'workplace_id'){
        //     promissall.push(this.apiHrmV2Service.getWorkplacesV2(element1.field_name));
        //   } else if(element1.field_name === 'floor_No'){
        //     promissall.push(this.apiHrmV2Service.getFloorNoV2(element1.field_name));
        //   }else if(element1.field_name === 'form_status'){
        //     this.getFormStatus(element1)
        //   }else if(element1.field_name === 'roleType') {
        //     promissall.push(this.apiHrmV2Service.getRoleTypesV2(element1.field_name));
        //     element1.columnValue = parseInt(element1.columnValue)
        //   }else if(element1.field_name === 'menuParentId') {
        //     element1.options = this.menus.map(t => {
        //       return {
        //         label: t.title,
        //         value: `${t.menuId}`
        //       }
        //     });
        //   }else if(element1.field_name === 'custId'){
        //     const root_orgId = this.getValueByKey('organizeId');
        //     promissall.push(this.apiHrmV2Service.getEmployeePageCustIdV2(queryString.stringify({ organizeIds: this.organizeInfoServiceId, pageSize: 100000, companyIds: "00000000-0000-0000-0000-000000000000" }), element1.field_name));
        //   }else if( element1.field_name === 'menu_date') {
        //     promissall.push(this.apiHrmV2Service.getEatingInputV2(queryString.stringify({ }), element1.field_name));
        //   }else if( element1.field_name === 'blockId') {
        //     const root_orgId = this.getValueByKey('organizeId');
        //     promissall.push(this.apiHrmV2Service.getBlockByOrganize(queryString.stringify({ organizeId: root_orgId}), element1.field_name));
        //   }else if( element1.field_name === 'banId') {
        //     const root_orgId = this.getValueByKey('organizeId');
        //     const parentId = this.getValueByKey('blockId');
        //     promissall.push(this.apiHrmV2Service.getBanByOrganize(queryString.stringify({ organizeId: root_orgId, parentId: parentId}), element1.field_name));
        //   }else if( element1.field_name === 'orgId3') {
        //     const root_orgId = this.getValueByKey('organizeId');
        //     const parentId = this.getValueByKey('banId');
        //     promissall.push(this.apiHrmV2Service.getDepartmentByOrganize(queryString.stringify({ organizeId: root_orgId, parentId: parentId}), element1.field_name));
        //   }else if( element1.field_name === 'groupId') {
        //     const root_orgId = this.getValueByKey('organizeId');
        //     const parentId = this.getValueByKey('orgId');
        //     promissall.push(this.apiHrmV2Service.getGroupByOrganize(queryString.stringify({ organizeId: root_orgId, parentId: parentId}), element1.field_name));
        //   }else if( element1.field_name === 'teamId') {
        //     const root_orgId = this.getValueByKey('organizeId');
        //     const parentId = this.getValueByKey('groupId');
        //     promissall.push(this.apiHrmV2Service.getTeamByOrganize(queryString.stringify({ organizeId: root_orgId, parentId: parentId}), element1.field_name));
        //   }else if( element1.field_name === 'baseId') {
        //     this.organizeInfoService.organizeInfo$.subscribe((results: any) => {
        //       if(results && results.length>0){
        //         promissall.push(this.apiHrmV2Service.getPayrollAppInfoPage(queryString.stringify({ organizeIds: results}), element1.field_name));
        //       } 
        //     });
        //   }else if( element1.field_name === 'companies') {
        //     promissall.push(this.apiHrmV2Service.getCompaniesByUserOrganize(queryString.stringify({ organizeIds: this.organizeInfoServiceId}), element1.field_name));
        //   }else {
        //     if (element1.columnObject) {
        //       promissall.push(this.apiHrmV2Service.getObjectListV2(queryString.stringify({ objKey: element1.columnObject }), element1.field_name));
        //     }
        //   }
        // } else if (element1.columnType === 'input') {
        //   if (element1.field_name === 'annualYear') {
        //     this.GetAnnualYear(element1);
        //   }
        // }else if( element1.columnType === 'members') {
        //   const organizeId = this.getValueByKey('organizeId');
        //   const orgId = this.getValueByKey('org_Id');
        //   // this.getHrmMeetingPerson(element1, null, organizeId, orgId);
        //   if(element1.columnValue){
        //     if(organizeId || organizeId === null){
        //       promissall.push(this.apiHrmV2Service.getHrmFormsPersonV2(queryString.stringify({ offSet: 0, pageSize: 1000, fullName: null, organizeId: organizeId }), element1.field_name));
        //     }else{
        //       promissall.push(this.apiHrmV2Service.getHrmMeetingPersonV2(queryString.stringify({ offSet: 0, pageSize: 1000, fullName: null }), element1.field_name));
        //     }
        //   }
        // }else if( element1.columnType === 'linkUrlDrag') {
        //   if (element1.field_name === 'link_view') {
        //     element1.columnValue = element1.columnValue ? element1.columnValue.split(',') : element1.columnValue;
        //     // tem filed columnValue
        //   }
        // }else if(element1.columnType === 'timeonly') {
        //   if(element1.columnValue){
        //     let tmp = element1.columnValue.split(':');
        //     element1.columnValue = new Date();
        //     element1.columnValue.setHours(parseInt(tmp[0]));
        //     element1.columnValue.setMinutes(parseInt(tmp[1]));
        //   }
        //  }else if( element1.columnType === 'chips') {
        //   element1.columnValue = element1.columnValue ? element1.columnValue.split(',') : [];
        // }
      });
    });
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
                this.setValueAndOptionsAutocomplete(element1, datas[0].result);
              } else if (element1.columnType === 'checkboxradiolist') {
                const datas = results.filter(d => d.key === element1.field_name);
                this.setCheckboxradiolistValue(element1, datas[0].result)
              } else if ((element1.columnType === 'selectTree') || (element1.columnType === 'selectTrees')) {
                const datas = results.filter(d => d.key === element1.field_name);
                this.setSelectTreeValue(element1, datas[0].result)
              } else if (element1.columnType === 'multiSelect') {
                const datas = results.filter(d => d.key === element1.field_name);
                this.setMultiSelectValue(element1, datas[0].result)
              } else if (element1.columnType === 'members') {
                const datas = results.filter(d => d.key === element1.field_name);
                this.setMembers(element1, datas[0].result)
              } else {
                const datas = results.filter(d => d.key === element1.field_name);
                this.setValueAndOptions(element1, datas[0].result);
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

  setMembers(element1, datas) {
    element1.options = [...datas];
    element1.options.forEach(member => {
      member.isCheck = false;
      member.child.forEach(user => {
        user.isCheck = false;
      })
    })
  }

  setSelectTreeValue(element1, datas) {
    element1.options = datas;
    if ((element1.columnType === 'selectTrees') && (element1.field_name === 'org_Id')) {
      const ids = element1.columnValue ? element1.columnValue.split(',') : []
      const results = [];
      this.findNodeInTree1(element1.options, ids, element1, results);
      element1.columnValue = results;

    } else {
      if (element1.columnValue) {
        this.findNodeInTree(element1.options, element1.columnValue.toUpperCase(), element1);
      } else {
        element1.columnValue = null;
      }
    }
  }

  setMultiSelectValue(element1, datas) {
    element1.options = []
    element1.options = cloneDeep(datas);
    if (element1.columnValue) {
      let newarray = [];
      element1.options.forEach(element => {
        if (element1.columnValue.split(",").indexOf(element.value) > -1) {
          newarray.push(element.value.toString());
        }
      });
      
      element1.columnValue = newarray;
    }
  }

  setCheckboxradiolistValue(element1, results) {
    element1.options = cloneDeep(results);
    element1.columnValue = element1.columnValue ? element1.columnValue : '';
    let newarray = []
    element1.options.forEach(element => {
      if (typeof element1.columnValue === 'string' && element1.columnValue.split(",").indexOf(element.value) > -1) {
        newarray.push(element);
      }
    });
    element1.columnValue = newarray.map(d => d.value);
  }

  setValueAndOptions(element1, results) {
    element1.options = cloneDeep(results);
    element1.columnValue = element1.columnValue ? element1.columnValue : ''
  }

  setValueAndOptionsAutocomplete(element1, results) {
    element1.options = cloneDeep(results).map(d => {
      return {
        name: d.name,
        code: `${d.id}`,
        ...d
      }
    });
    element1.columnValue = element1.columnValue ? element1.options[0] : ''
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

  loopEveryNodeTree(list): void {
    for (let i = 0; i < list.length; i++) {
      if (Array.isArray(list[i].children) && list[i].children.length) {
        list[i] = this.getNode(list[i]);
        this.loopEveryNodeTree(list[i].children);
      } else {
        list[i] = this.getNode(list[i]);
      }
    }
  }

  async getFormTypePage(element1) {
    try {
      
      const queryParams = queryString.stringify({ form_type_id: this.formTypeId})
      const response = (await lastValueFrom(this.apiService.getFormsTypes(queryParams))).data;
      this.loopEveryNodeTree(response);
      element1.options = response;
      this.findNodeInTree(element1.options, element1.columnValue, element1);
      this.dataView = cloneDeep(this.dataView);
    } catch (error) {
      console.error('error:', error);
    }
  }

  findNodeInTree(list, nodeId, element1): any {
    for (let i = 0; i < list.length; i++) {
      if (list[i].data === nodeId ) {
         element1.columnValue = list[i];
        }else if (Array.isArray(list[i].children) && list[i].children.length) {
          this.findNodeInTree(list[i].children, nodeId, element1);
        }
    }
  }
  

  getActionlist(element1) {
    element1.options = cloneDeep(this.dropdownList).map(d => {
      return {
        label: d.itemName,
        value: d.id
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

  findNodeInTree1(list, ids, element1, results): any {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children && list[i].children.length) {
        this.findNodeInTree1(list[i].children, ids, element1, results);
      }
      if (ids.includes(list[i].data)) {
        results.push(list[i]);
      }
    }
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


  getFormStatus(element1) {
    element1.options = [
      { label: 'Đang hoạt động', value: 1},
      { label: 'Hết hạn', value: 2},
      { label: 'Đã đẩy lên app', value: 3},
    ]
    element1.columnValue = element1.columnValue ? parseInt(element1.columnValue) : ''
    // if(parseInt(element1.columnValue) === 3){
    //   element1.options = [
    //     { label: 'Đang hoạt động', value: 1},
    //     { label: 'Hết hạn', value: 2},
    //     { label: 'Đã đẩy lên app', value: 3},
    //   ]
    //   element1.isDisable = true;
    // }
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
