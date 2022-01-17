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

  getIdentityCardInfomation(image: File) {
    const options = {
      headers: new HttpHeaders({
        'key': 'WZWfWCN2VPDxbYsV6sRfR0N1fV8x030h'
      })
    };
    const formdata = new FormData();
    formdata.append('image', image, 'TanTano');
    formdata.append('request_id', '14071996');
    return this.http.post('https://api.cloudekyc.com/v3.2/ocr/recognition', formdata, options);
  }

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
  
  setContractInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetContractInfo`, params, this.options)
  }

  setTerminateInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/terminate/SetTerminateInfo`, queryParams, this.options)
  }

  getTerminateInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/terminate/GetTerminateInfo?` + queryParams, this.options);
  }

  setContractDraft(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetContractDraft`, params, this.options)
  }

  setContractUpload(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetContractUpload`, params, this.options)
  }

  getContractInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetContractInfo?` + queryParams, this.options)
  }

  setEmpAttach(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmpAttach`, params, this.options)
  }

  getEmpAttach(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmpAttach?` + queryParams, this.options)
  }

  getAccountInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiCore}/api/v1/coreaccount/GetAccountInfo?` + queryParams, this.options)
  }

  setAccountInfo(params): Observable<any> {
    return this.http.post<any>(`${apiCore}/api/v1/coreaccount/SetAccountInfo`, params, this.options)
  }

  setEmpWorking(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmpWorking`, params, this.options)
  }

  setEmpDependent(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmpDependent`, params, this.options)
  }

  setEmpContact(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmpContact`, params, this.options)
  }
  
  getEmpWorking(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmpWorking?` + queryParams, this.options)
  }

  getEmpDependent(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmpDependent?` + queryParams, this.options)
  }

  getEmpContact(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmpContact?` + queryParams, this.options)
  }

  getTerminateReasons(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/terminate/GetTerminateReasons?`, this.options)
  }

  getEmployeeData(linkurl, queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/${linkurl}?` + queryParams, this.options)
  }

  setEmployeeInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeInfo`, params, this.options)
  }

  lockUser<T>(userId): Observable<T> {
    return this.http.post<T>(`${apiHrmServer}/api/v1/user/LockUser`, { userId }, this.options);
  }

  unLockUser<T>(userId): Observable<T> {
    return this.http.post<T>(`${apiHrmServer}/api/v1/user/UnLockUser`, { userId }, this.options);
  }

  setEmployeeCancel(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeCancel`, params, this.options)
  }
  
  setEmployeeTermilate(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeTermilate`, params, this.options)
  }

  setEmployeeRehired(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeRehired`, params, this.options)
  }

  setEmployeeChange(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/setEmployeeChange`, params, this.options)
  }

  getRecordInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetRecordInfo?` + queryParams, this.options)
  }

  setContractStatus(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/contract/SetContractStatus`, params, this.options)
  }

  removeUser(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/user/RemoveUser?` + queryParams, this.options)
  }

  delEmpWorking(queryParams): Observable<any> {
    return this.http.get<any>(`${apiCore}/api/v2/employee/DelEmpWorking?` + queryParams, this.options);
  }

  delContractInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/contract/DelContractInfo?` + queryParams, this.options)
  }
  
  delEmpAttach(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employee/DelEmpAttach?` + queryParams, this.options)
  }

  delEmpDependent(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employee/DelEmpDependent?` + queryParams, this.options)
  }
  
  delEmpContact(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employee/DelEmpContact?` + queryParams, this.options)
  }

  setRecordInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetRecordInfo`, params, this.options)
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
