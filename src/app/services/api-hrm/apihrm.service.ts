import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
const apiBaseUrl = environment.apiBase;
const apiHrmServer = environment.apiHrmBase;
const apiCore = environment.apiCoreBase;
@Injectable()
export class ApiHrmService {
  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  options = {
    headers: new HttpHeaders({
      Authorization: this.authService.getAuthorizationHeaderValue(),
      'Content-Type': 'application/json',
    })
  };

  // Dashboard
  getCustObjectListNew(type = false, queryParams): Observable<any> {
    if (type) {
      return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetObjectList?` + queryParams, this.options);
    } else {
      return this.http.get<any>(`${apiCore}/api/v1/customer/GetCustObjectList?` + queryParams, this.options);
    }
  }


  // Worktime
  getWorktimePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/worktime/GetWorktimePage?` + queryParams, this.options);
  }

  DelWorktimeInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/worktime/DelWorktimeInfo?` + queryParams, this.options)
  }

  getWorktimeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/worktime/GetWorktimeInfo?` + queryParams, this.options)
  }

  setWorktimeInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/worktime/SetWorktimeInfo`, queryParams, this.options)
  }


  // end thông báo
  getEmployeeSearch(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmployeeSearch?` + queryParams, this.options);
  }

  get(url, params): Observable<Blob> {
    return this.http.get(`${url}?${params}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setIncomeTaxStatus(id): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/incometax/SetIncomeTaxStatus?id=` + id, this.options);
  }
  deleteReportIncomeTaxs(params): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/report/DeleteReportIncomeTaxs?` + params, this.options);
  }
  getMeetingPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetMeetingPage?` + queryParams, this.options);
  }
  getMeetRoomPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetMeetRoomPage?` + queryParams, this.options);
  }
  getMeetingInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetMeetingInfo${queryParams}`, this.options);
  }
  getMeetRoomInfo(roomId): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetMeetRoomInfo?room_id=${roomId}`, this.options);
  }
  setMeetingInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/meeting/SetMeetingInfo`, data, this.options);
  }
  setMeetRoomInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/meeting/SetMeetRoomInfo`, data, this.options);
  }
  delMeetRoomInfo(id): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/meeting/DelMeetRoomInfo?room_id=` + id, this.options);
  }
  delMeetingInfo(id): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/meeting/DelMeetingInfo?meet_ud=` + id, this.options);
  }
  getMeetRooms(filter = ''): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetMeetRooms?filter=${filter}`, this.options);
  }

  getProductProjs(): Observable<any> {
    return this.http
      .get<any>(`${apiCore}/api/v1/coreagent/GetProductProjs`, this.options)
  }

  getAgencyOrganizeList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiCore}/api/v1/coreagent/getAgencyOrganizeList?` + queryParams, this.options);
  }

  getManagerList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiCore}/api/v1/coresystem/GetManagerList?` + queryParams, this.options);
  }

  // from new
  getAgentLeaders(queryParams): Observable<any> {
    return this.http.get<any>(`${apiCore}/api/v1/coreagent/getAgentLeaders?` + queryParams, this.options);
  }

  getOrganizeTree(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizeTree?` + queryParams, this.options);
  }

  getOrgPositions(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgPositions?` + queryParams, this.options);
  }

  getOrganizePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizePage?` + queryParams, this.options);
  }

  getContract(queryParams): Observable<any> {
    return this.http.get<any>(`${apiCore}/api/v1/coresaler/GetContract?` + queryParams, this.options)
  }

  getOrganizeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizeInfo?` + queryParams, this.options)
  }

  getCompanyList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/compay/GetCompanyList?` + queryParams, this.options)
  }

  getUsersByAdmin(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/user/getUsersByAdmin?` + queryParams, this.options)
  }

  getEducations(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetEducations`, this.options)
  }

  getWorkplaces(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetWorkplaces`, this.options)
  }

  getNotifyRefList(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyRefList`, this.options)
  }

  getVacancyPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetVacancyPage?` + queryParams, this.options)
  }

  getOrgRoots(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgRoots`, this.options)
  }

  getSalaryTypes(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryTypes?` + queryParams, this.options)
  }

  getJobs(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetJobs?` + queryParams, this.options)
  }

  getAccountPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiCore}/api/v1/coreaccount/GetAccountPage?` + queryParams, this.options)
  }

  getEmpLeaders(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmpLeaders?` + queryParams, this.options)
  }

  getBankList(): Observable<any> {
    return this.http.get<any>(`${apiCore}/api/v1/coreaccount/GetBankList`, this.options)
  }

  getWorkTimes(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetWorkTimes?` + queryParams, this.options);
  }

  getWorkShifts(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetWorShifts?` + queryParams, this.options);
  }

  getSalaryBases(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryBases`, this.options)
  }

  getContractTypes(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetContractTypes`, this.options)
  }

  // Tuyển dụng
  getCandidatePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetCandidatePage?` + queryParams, this.options)
  }

  delCandidateInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitment/DelCandidateInfo?` + queryParams, this.options)
  }

  getJobTitles(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetJobTitles`, this.options)
  }

  getCandidateStatus(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetCandidateStatus?`, this.options)
  }

  delVacancyInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitment/DelVacancyInfo?` + queryParams, this.options)
  }

  getJobPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetJobPage?` + queryParams, this.options)
  }

  delJobInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitment/DelJobInfo?` + queryParams, this.options)
  }

  getVacancyInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetVacancyInfo?` + queryParams, this.options)
  }

  setVacancyInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/SetVacancyInfo`, params, this.options)
  }

  getJobInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetJobInfo?` + queryParams, this.options)
  }

  setJobInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/SetJobInfo`, params, this.options)
  }

  getCandidateInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetCandidateInfo?` + queryParams, this.options)
  }

  setCandidateInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/SetCandidateInfo`, params, this.options)
  }

  
  getAgencyOrganizeMap(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizeMap`, this.options);
  }

  getEmployeePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmployeePage?` + queryParams, this.options);
  }

  deleteEmployee(employeeId): Observable<string> {
    return this.http
      .delete<string>(`${apiHrmServer}/api/v2/employee/DeleteEmployee?employeeId=${employeeId}`, this.options);
  }

  setEmployeeOpenhrm(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeOpen`, params, this.options)
  }

  setEmployeeClose(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeClose`, params, this.options)
  }

  setEmployeeApprovehrm(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeApprove`, params, this.options)
  }

  getEmployeeStatus(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmployeeStatus`, this.options);
  }

  getTerminatePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/terminate/GetTerminatePage?` + queryParams, this.options);
  }

  setTerminateStatus(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/terminate/SetTerminateStatus`, params, this.options)
  }

  delTerminateInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/terminate/DelTerminateInfo?` + queryParams, this.options)
  }

  getObjectGroup(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetObjectGroup?` + queryParams, this.options);
  }

  getLeavePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/leave/GetLeavePage?` + queryParams, this.options)
  }
  

}
