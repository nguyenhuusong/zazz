import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import * as numeral from 'numeral';
const apiBaseUrl = environment.apiBase;
const apiHrmServer = environment.apiHrmBase;
const apiCore = environment.apiCoreBase;
const apiShome = environment.apiShomeBase;
@Injectable()
export class ApiHrmV2Service {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService) { }

  options = {
    headers: new HttpHeaders({
      Authorization: this.authService.getAuthorizationHeaderValue(),
      'Content-Type': 'application/json',
      'X-Role-Token': localStorage.hasOwnProperty('md5') && localStorage.getItem('md5') ? localStorage.getItem('md5') : ''
    })
  };

  getOrganizeTreeV2(queryParams: any, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/organize/GetOrganizeTree?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getOrganizationsV2(queryParams: any, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/organize/GetOrganizations?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(item => {
          return {
            label: item.organizationName,
            value: `${item.organizeId}`,
            name: item.organizationName,
            code:  `${item.organizeId}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }


  getWorkTimesV2(queryParams: any, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/category/GetWorkTimes?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(item => {
          return {
            label: item.work_times + '-' + item.work_cd,
            value: item.work_cd
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getEmployeePageV2(queryParams: any, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/employee/GetEmployeePage?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name , result: repon.data.dataList.data.map(item => {
          return {
            label: item.full_name + '-' + item.phone1,
            value: item.empId
          }
        })};
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getEmployeePageCustIdV2(queryParams: any, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/employee/GetEmployeePage?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name , result: repon.data.dataList.data.map(item => {
          return {
            label: item.full_name + '-' + item.phone1,
            value: item.CustId
          }
        })};
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getWorkShiftsV2(queryParams: any, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/category/GetWorShifts?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(item => {
          return {
            name: item.shift_name + '-' + item.shift_cd,
            code: item.shift_cd,
            label: item.shift_name + '-' + item.shift_cd,
            value: item.shift_cd
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getWorktimeListV2(queryParams: any, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/worktime/GetWorktimeList?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return { label: d.work_times + '-' + d.work_name, value: d.work_cd }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getBankListV2(field_name): Observable<any> {
    return this.httpClient.get(`${apiCore}/api/v1/coreaccount/GetBankList`, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.bank_name + '-' + d.bank_code,
            value: d.bank_code
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getAgentLeadersV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiCore}/api/v1/coreagent/getAgentLeaders?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return { label: d.fullName, value: d.saler_id }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getOrgPositionsV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/organize/GetOrgPositions?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return { label: d.positionName, value: d.positionCd }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getPositionListV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/position/GetPositionList?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return { label: d.positionName, value: d.positionId.toUpperCase() };
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getPositionTitlesV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/position/GetPositionTitles?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return { label: d.positionTitle, value: d.positionTitleId }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getCompanyListV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/compay/GetCompanyList?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return { label: d.companyName, value: d.companyId }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getCompaniesByOrganize(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/compay/GetCompaniesByOrganize?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return { label: d.companyName, value: d.companyId }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getEmpLeadersV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/employee/GetEmpLeaders?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.fullName + ' [' + d.job_name + '-' + d.org_name + '] - ' + d.phone,
            value: d.empId
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getAccountPageV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiCore}/api/v1/coreaccount/GetAccountPage?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.dataList.data.map(d => {
          return {
            label: d.acc_no + '-' + d.link_acc_bank,
            value: d.acc_no
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getJobsV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/category/GetJobs?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.job_name,
            value: `${d.jobId.toUpperCase()}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getCompaniesByOrganizeV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/compay/GetCompaniesByOrganize?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.companyName,
            value: `${d.companyId}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getEmployeeSearchV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/employee/GetEmployeeSearch?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.fullName + '-' + d.phone,
            value: `${d.empId}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getEmployeeSearchGetUserIdV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/employee/GetEmployeeSearch?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.fullName + '-' + d.phone,
            value: `${d.userId}`,
            ...d
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }


  getHrmPayrollTypePageV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/payrollType/GetHrmPayrollTypePage?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.dataList.data.map(d => {
          return {
            label: `${d.name}`,
            value: `${d.id}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getUserByPushV2(queryParams, field_name): Observable<any> {
    return this.httpClient.put(`${apiHrmServer}/api/v1/notify/GetUserByPush?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.fullName + '-' + d.phone,
            value: `${d.userId}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getNotifyRefListV2(field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/notify/GetNotifyRefList`, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.refName,
            value: `${d.source_ref}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getContractTypesV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/contracttype/GetContractTypes?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.contractTypeName,
            value: `${d.contractTypeId}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

   
  getSalaryTypesV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/salary/GetSalaryTypes?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.salary_type_name,
            value: `${d.salary_type}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }
   
  getSalaryBasesV2( field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/salary/GetSalaryBases`, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.base_name + ' [' + numeral(d.base_amt).format('0,0') + ']',
            value: `${d.base_id}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getUsersByAdminV2( queryParams , field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/user/getUsersByAdmin?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: `${d.fullName} [${d.loginName}]`,
            value: d.userId
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getVacancyPageV2( queryParams , field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/recruitment/GetVacancyPage?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.dataList.data.map(d => {
          return {
            label: `${d.job_name}`,
            value: `${d.vacancyId}`
          }
        }) };
      }), catchError(error => {
        return throwError('GetVacancyPage not found!', error);
      })
    )
  }

  getPositionTitles( queryParams , field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v1/recruitment/GetPositionTitles?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: `${d.vacancy_name}`,
            value: `${d.vacancyId}`
          }
        }) };
      }), catchError(error => {
        return throwError('getPositionTitles not found!', error);
      })
    )
  }

  getEducationsV2(field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/category/GetEducations`, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: `${d.educationName}`,
            value: `${d.educationId}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getWorkplacesV2(field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/category/GetWorkplaces` , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: `${d.workplaceName}`,
            value: `${d.workplaceId}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getProductProjsV2(field_name): Observable<any> {
    return this.httpClient.get(`${apiCore}/api/v1/coreagent/GetProductProjs` , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: `${d.sub_prod_name}`,
            value: d.sub_prod_cd
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getMeetRoomsV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/meeting/GetMeetRooms?` + queryParams, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: `${d.room_name}`,
            value: `${d.roomId}`
          };
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getObjectListV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/category/GetObjectList?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: `${d.objName}`,
            value: `${d.objValue}`
          };
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getVehicleTypesV2(field_name): Observable<any> {
    return this.httpClient.get(`${apiShome}/api/v1/shome/GetVehicleTypes` , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.vehicleTypeName,
            value: `${d.vehicleTypeId}`
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getLeaveReasonsV2(field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/leave/GetLeaveReasons` , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.name,
            value: d.code
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getFloorNoV2(field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/meeting/GetFloorNo` , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return { 
            label: 'Tầng' + ' ' + d.floorNo, 
            value: d.floorNo 
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getHrmMeetingPersonV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/meeting/GetHrmMeetingPerson?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.meetingProperties };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getHrmFormsPersonV2(queryParams, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}/api/v2/forms/GetHrmFormsPerson?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.meetingProperties };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getRoleTypesV2(field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v2/userrole/GetRoleTypes` , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.name,
            value: d.id
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getEatingInputV2(queryParams, field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v1/eating/GetEatingInput?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.eatingProperties.map(d => {
          return {
            name: d.food_name,
            code: d.menu_date
          }
        }) };
      }), catchError(error => {
        return throwError('Capital not found!');
      })
    )
  }

  getBlockByOrganize(queryParams, field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v1/organize/GetBlockByOrganize?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.org_name,
            value: d.orgId
          }
        }) };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }

  getBanByOrganize(queryParams, field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v1/organize/GetBanByOrganize?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.org_name,
            value: d.orgId
          }
        }) };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }

  getDepartmentByOrganize(queryParams, field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v1/organize/GetDepartmentByOrganize?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.org_name,
            value: d.orgId
          }
        }) };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }

  getGroupByOrganize(queryParams, field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v1/organize/GetGroupByOrganize?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.org_name,
            value: d.orgId
          }
        }) };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }

  getTeamByOrganize(queryParams, field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v1/organize/GetTeamByOrganize?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.org_name,
            value: d.orgId
          }
        }) };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }

  getPayrollAppInfoPage(queryParams, field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v1/payrollAppInfo/GetPayrollAppInfoPage?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.dataList.data.map(d => {
          return {
            label: d.app_info_name,
            value: d.appInfoId
          }
        }) };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }

  getCompaniesByUserOrganize(queryParams, field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v2/compay/GetCompaniesByUserOrganize?` + queryParams , this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            label: d.companyName,
            value: d.companyId.toUpperCase()
          }
        }) };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }

  getCustObjectListV2(url, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}` + url, this.options).pipe(
      map((repon: any) => {
        if (repon.status === 'success' && repon.data && repon.data.length > 0) {
          console.log(field_name)
          return {
            key: field_name, result: repon.data.map(item => {
              return {
                ...item,
                label: item.name,
                name: item.name,
                code: item.value,
              }
            })
          };
        } else {
          return { key: field_name, result: [] }
        }

      }), catchError(error => {
        return of(error.error);
      })
    )
  }

  getCustObjectListTreeV2(url, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}` + url, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }
  
  getAutocompleteLinkApiV2(url, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}` + url, this.options).pipe(
      map((repon: any) => {
        console.log("field_name", field_name)
        return { key: field_name, result: repon.data.map(d => {
          return {
            name: d.fullName + '-' +d.code + '-' + d.phone,
            code: d.empId
          }
        }) };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }

  getAutocompleteLinkApiV2s(url, field_name): Observable<any> {
    return this.httpClient.get(`${apiHrmServer}` + url, this.options).pipe(
      map((repon: any) => {
        return { key: field_name, result: repon.data.map(d => {
          return {
            name: d.name,
            code: d.value
          }
        }) };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }


  // danh sách cty trả lương
  getUserCompanies(queryParams, field_name) {
    return this.httpClient.get(`${apiHrmServer}/api/v1/user/GetUserCompanies?` + queryParams , this.options).pipe(
      map((repon: any) => {
          let data = repon.data.filter( d => d.companyId != "00000000-0000-0000-0000-000000000000")
          return { key: field_name, result: data.map(d => {
            return {
              label: d.companyName,
              value: d.companyId.toUpperCase()
            }
          }) 
        };
      }), catchError(error => {
        return of(error.error);
      })
    )
  }
}

