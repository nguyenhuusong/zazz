import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { CardInfo, Project, TypeCard, Vehicle } from 'src/app/models/cardinfo.model';
import { BuildZone } from 'src/app/models/buildzone.model';
import { ElevatorFloor } from 'src/app/models/elevatorfloor.model';
const apiBaseUrl = environment.apiBase;
const apiHrmServer = environment.apiHrmBase;
const apiCore = environment.apiCoreBase;
const apiShome = environment.apiShomeBase;
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
  getCustObjectListNew(type = false,queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetObjectList?` + queryParams, this.options);
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
  
  getWorktimeList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/worktime/GetWorktimeList?` + queryParams, this.options)
  }

  setWorktimeInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/worktime/SetWorktimeInfo`, queryParams, this.options)
  }
  //góp ý
  getFeedbackInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/feedback/GetFeedbackInfo?` + queryParams, this.options)
  }

  getFeedbackPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/feedback/GetFeedbackPage?`+ queryParams, this.options)
  }

  // end thông báo
  getEmployeeSearch(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmployeeSearch?` + queryParams, this.options);
  }

  getReport(api, params): Observable<Blob> {
    return this.http.get(`${apiHrmServer}${api}?${params}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setIncomTaxImport(data, datect): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Authorization': this.authService.getAuthorizationHeaderValue(),
        // 'Content-Type': 'multipart/form-data'
      })
    };
    const formdata = new FormData();
    formdata.append('formFile', data);
    return this.http.post(`${apiHrmServer}/api/v2/incometax/SetIncomTaxImport?date_ct=${datect}`, formdata, options);
  }

  // IncomTax
  getIncomeTaxPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/incometax/GetIncomeTaxPage?${queryParams}`, this.options);
  }

  // notifi
  setNotifyToPushRun(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/notify/SetNotifyToPushRun`, params, this.options);
  }

  setAppNotifyStatus(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/notify/SetAppNotifyStatus`, params, this.options);
  }
  
  setNotifyStatus(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/notify/SetNotifyStatus`, params, this.options);
  }

  delAppNotifyInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/notify/DelAppNotifyInfo?` + queryParams, this.options);
  }

  delNotifyInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/notify/delNotifyInfo?` + queryParams, this.options);
  }

  getAppNotifyPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetAppNotifyPage?` + queryParams, this.options);
  }

  getNotifyPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyPage?` + queryParams, this.options);
  }

  getNotifyTempList(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyTempList`, this.options);
  }

  getNotifyRefPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyRefPage?` + queryParams, this.options);
  }

  getNotifyTempPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyTempPage?` + queryParams, this.options);
  }

  getNotifyRef(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyRef?` + queryParams, this.options);
  }

  getUserByPush(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/notify/GetUserByPush` , queryParams, this.options);
  }

  getNotifyTemp(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyTemp?` + queryParams, this.options);
  }

  delNotifyRef(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/notify/DelNotifyRef?` + queryParams, this.options);
  }

  delNotifyTemp(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/notify/DelNotifyTemp?` + queryParams, this.options);
  }

  getModuleList(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgRoots` , this.options);
  }

  setNotifyCreatePush(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/notify/SetNotifyCreatePush`, params, this.options);
  }

  setNotifyTemp(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/notify/SetNotifyTemp`, params, this.options);
  }

  setNotifyRef(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/notify/SetNotifyRef`, params, this.options);
  }

  getDocumentUrl<T>(filter, offset, pagesize) {
    return this.http.get<T>(apiBaseUrl + '/GetDocumentUrl?ProjectCd=&filter=' + filter + '&offSet=' + offset + '&pageSize=' + pagesize, this.options).toPromise();
  }

  setDocumentUrl<T>(documentUrl) {
    const doc = {
      projectCd: '',
      documentTitle: '',
      documentUrl
    };
    return this.http.post<T>(apiBaseUrl + '/SetDocumentUrl', doc, this.options).toPromise();
  }
  
  getAppNotifyInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetAppNotifyInfo?` + queryParams, this.options);
  }

  getNotifyInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyInfo?` + queryParams, this.options);
  }
  
  setAppNotifyInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/notify/SetAppNotifyInfo`, params, this.options);
  }

  setNotifyInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/notify/SetNotifyInfo`, params, this.options);
  }

  delNotifyPushs(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/notify/DelNotifyPushs`, queryParams, this.options);
  }

  getNotifyCommentList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyCommentList?` + queryParams, this.options);
  }

  getNotifyToPushs(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyToPushs?` + queryParams, this.options);
  }
  
  getNotifyCommentChilds(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyCommentChilds?` + queryParams, this.options);
  }

  getNotifyPushStatus(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyPushStatus`, this.options);
  }

  setNotifyCommentAuth(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/notify/SetNotifyCommentAuth`, params, this.options);
  }

  delNotifyPush(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/notify/DelNotifyPush?` + queryParams, this.options);
  }

  setNotifyComment(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/notify/SetNotifyComment`, params, this.options);
  }


  getIncomeTaxInfo(id): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/incometax/GetIncomeTaxInfo?id=${id}`, this.options);
  }

  getIncomeTaxTypes(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/incometax/GetIncomeTaxTypes`, this.options);
  }

  setIncomTaxInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/incometax/SetIncomTaxInfo`, params, this.options);
  }

  deleteIncomeTaxStatus(id): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/incometax/SetIncomeTaxStatus?id=${id}`, this.options);
  }

  setSalaryRecordInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/salary/SetSalaryRecordInfo`, queryParams, this.options)
  }

  setSalaryRecordApprove(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/salary/SetSalaryRecordApprove`, queryParams, this.options)
  }

  getEatingPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/eating/GetEatingPage?` + queryParams, this.options)
  }

  getSalaryInfoPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryInfoPage?` + queryParams, this.options)
  }
  
  getSalaryEmployeePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/getSalaryEmployeePage?` + queryParams, this.options)
  }
  
  getSalaryRecordInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryRecordInfo?` + queryParams, this.options)
  }
  
  setSalaryCreateDraft(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/salary/SetSalaryCreateDraft`, queryParams, this.options)
  }

  getTimekeepingPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/timekeeping/GetTimekeepingPage?` + queryParams, this.options)
  }

  getEmployeeSalaryMonthPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/timekeeping/GetEmployeeSalaryMonthPage?` + queryParams, this.options)
  }

  getTimekeepingInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/timekeeping/getTimekeepingInfo?` + queryParams, this.options)
  }

  getTimekeepingDetail(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/timekeeping/GetTimekeepingDetail?` + queryParams, this.options)
  }

  updateTimeKeeping(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/timekeeping/UpdateTimeKeeping` , queryParams, this.options)
  }

  exportTimekeeping(queryParams): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v1/timekeeping/ExportTimekeeping/?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  getExportReport(url,queryParams: any): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/report/${url}?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  exportReportLocalhost(url): Observable<Blob> {
    return this.http.get(url, {
      responseType: "blob"
    });
  }
  
  getSalaryRecordPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryRecordPage?` + queryParams, this.options)
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

  setContractSignedUpload(id, params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/contract/SetContractSignedUpload?` + id, params, this.options)
  }

  getContractInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetContractInfo?` + queryParams, this.options)
  }

  getContractMetaPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetContractMetaPage?` + queryParams, this.options)
  }

  getSalaryComponentPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetSalaryComponentPage?` + queryParams, this.options)
  }

  setContractCreate(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetContractCreate` , queryParams, this.options)
  }

  setContractSigned(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/contract/SetContractSigned?` + queryParams, null, this.options)
  }

  setContractComplete(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/contract/SetContractComplete?` + queryParams, null, this.options)
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

  getFeedbackType(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/feedback/GetFeedbackType`, this.options)
  }

  setAccountInfo(params): Observable<any> {
    return this.http.post<any>(`${apiCore}/api/v1/coreaccount/SetAccountInfo`, params, this.options)
  }

 
  setEmpContact(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmpContact`, params, this.options)
  }
  
  getEmpContact(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmpContact?` + queryParams, this.options)
  }

  getTerminateReasons(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/terminate/GetTerminateReasons?`, this.options)
  }

  getEmployeeData(linkurl, queryParams): Observable<any> {
    if(linkurl === 'GetEmpQualification') {
      return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/${linkurl}?` + queryParams, this.options)
    }else {
      return this.http.get<any>(`${apiHrmServer}/api/v2/employee/${linkurl}?` + queryParams, this.options)
    }
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

  getUserCompanies(queryParams) {
    return this.http.get<any>(`${apiHrmServer}/api/v1/user/GetUserCompanies?` + queryParams, this.options)
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

  getContractPageByEmpId(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetContractPageByEmpId?` + queryParams, this.options)
  }

  setEmpDependent(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetEmpDependent`, params, this.options)
  }
  

  setContractStatus(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/contract/SetContractStatus`, params, this.options)
  }
  
  setContractCancel(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/contract/SetContractCancel`, params, this.options)
  }

  removeUser(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/user/RemoveUser?` + queryParams, this.options)
  }

  deleteUser(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiCore}/api/v1/coreuser/DeleteUser?` + queryParams, this.options)
  }

  hrmDelEmpWorking(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/working/DelEmpWorking?` + queryParams, this.options);
  }

  delContractInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/contract/DelContractInfo?` + queryParams, this.options)
  }
  
  delEmpAttach(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employee/DelEmpAttach?` + queryParams, this.options)
  }
  
  // delEmpContact(queryParams): Observable<any> {
  //   return this.http.delete<any>(`${apiHrmServer}/api/v2/employee/DelEmpContact?` + queryParams, this.options)
  // }

  exportResume(queryParams: any): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/employee/ExportResume?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setRecordInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetRecordInfo`, params, this.options)
  }

  getEmpDependentPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetEmpDependentPage?` + queryParams, this.options)
  }
  
  getEmpDependent(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetEmpDependent?` + queryParams, this.options)
  }

  delEmpDependent(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/contract/DelEmpDependent?` + queryParams, this.options)
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
  getMeetRoomInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetMeetRoomInfo?` + queryParams, this.options);
  }
  setMeetingInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/meeting/SetMeetingInfo`, data, this.options);
  }
  setMeetRoomInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/meeting/SetMeetRoomInfo`, data, this.options);
  }
  delMeetRoomInfo(id): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/meeting/DelMeetRoomInfo?roomId=` + id, this.options);
  }
  delMeetingInfo(query): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/meeting/DelMeetingInfo?` + query, this.options);
  }
  getMeetRooms(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetMeetRooms?${queryParams}`, this.options);
  }

  // meetingFloor
  getMeetingFloorPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetMeetingFloorPage?` + queryParams, this.options);
  }

  getMeetingFloorInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetMeetingFloorInfo${queryParams}`, this.options);
  }

  setMeetingFloorInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/meeting/SetMeetingFloorInfo`, data, this.options);
  }
  
  delMeetingFloorInfo(params): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/meeting/DelMeetingFloorInfo` + params, this.options);
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

  getOrganizeParam(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/report/GetOrganizeParam?` + queryParams, this.options)
  }

  getDepartmentParams(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/report/GetDepartmentParams?` + queryParams, this.options)
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

  getContractTypes(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contracttype/GetContractTypes?${queryParams}`, this.options)
  }

  getPrintFiles(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/GetPrintFiles`,queryParams, this.options)
  }

  // Thai sản

  getMaternityPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/maternity/GetMaternityPage?` + queryParams, this.options)
  }

  getMaternityChildInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/maternity/GetMaternityChildInfo?` + queryParams, this.options)
  }

  getMaternityPregnancInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/maternity/GetMaternityPregnancInfo?` + queryParams, this.options)
  }

  getMaternityInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/maternity/GetMaternityInfo?` + queryParams, this.options)
  }

  setMaternityInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/maternity/SetMaternityInfo`, params, this.options)
  }

  setMaternityPolicyInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/maternity/SetMaternityPolicyInfo`, params, this.options)
  }

  setMaternityChildInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/maternity/SetMaternityChildInfo`, params, this.options)
  }

  setMaternityPregnancyInfo(url,params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/maternity/${url}`, params, this.options)
  }

  delMaternityInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/maternity/DelMaternityInfo?` + queryParams, this.options)
  }

  delMaternityPolicyInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/maternity/DelMaternityPolicyInfo?` + queryParams, this.options)
  }

  delMaternityPregnancyInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/maternity/DelMaternityPregnancyInfo?` + queryParams, this.options)
  }

  delMaternityChildInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/maternity/DelMaternityChildInfo?` + queryParams, this.options)
  }
  
  


  // Tuyển dụng

  getWorkflowPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/work/GetWorkflowPage?` + queryParams, this.options)
  }

  getWorkflowInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/work/GetWorkflowInfo?` + queryParams, this.options)
  }

  setWorkApprove(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/work/SetWorkApprove`, params, this.options)
  }

  getCandidatePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetCandidatePage?` + queryParams, this.options)
  }
  
  getCandidatePotentialPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetCandidatePotentialPage?` + queryParams, this.options)
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

  importCandidates(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/ImportCandidates`, data, customOptions);
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

  getVacancyReplicationInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetVacancyReplicationInfo?` + queryParams, this.options)
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

  getCandidatesViewInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetCandidatesViewInfo?` + queryParams, this.options)
  }

  setCandidateInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/SetCandidateInfo`, params, this.options)
  }

  recruiUpdateStatus(queryParams, params = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/UpdateStatus?`+ queryParams, params, this.options)
  }

  getRecruitMailInput(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetRecruitMailInput?` + queryParams, this.options)
  }

  sendRecruitMail(data = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/SendRecruitMail`, data, this.options)
  }

  updateInterviewResult(query, data = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/UpdateInterviewResult?` + query, data, this.options)
  }

  exportVacancy(queryParams): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v1/recruitment/ExportVacancy/?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  getAgencyOrganizeMap(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizeMap`, this.options);
  }

  getEmployeePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmployeePage?` + queryParams, this.options);
  }

  deleteEmployee(employeeId): Observable<string> {
    return this.http
      .delete<string>(`${apiHrmServer}/api/v2/employee/DeleteEmployee?empId=${employeeId}`, this.options);
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

  getEmployeeStatus(queryParams= null): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmployeeStatus?` + queryParams, this.options);
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

  getLeaveReasonPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/leave/GetLeaveReasonPage?` + queryParams, this.options)
  }

  delLeaveReason(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/leave/DelLeaveReason?` + queryParams, this.options)
  }
  
  getLeaveReason(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/leave/GetLeaveReason?` + queryParams, this.options)
  }

  getLeaveInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/leave/GetLeaveInfo?` + queryParams, this.options)
  }

  setLeaveHrmInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/leave/SetLeaveHrmInfo`, queryParams, this.options)
  }

  setLeaveInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/leave/SetLeaveInfo`, queryParams, this.options)
  }

  checkLeaveOverLap(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/leave/CheckLeaveOverLap`, queryParams, this.options)
  }

  setLeaveReason(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/leave/SetLeaveReason`, queryParams, this.options)
  }

  cancelLeaveStatuses(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/leave/CancelLeaveStatuses`, params, this.options)
  }

  getEatingInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/eating/GetEatingInfo?` + queryParams, this.options)
  }

  delEatingInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/eating/DelEatingInfo?` + queryParams, this.options)
  }

  getEatingForCreateInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/eating/GetEatingForCreateInfo?` + queryParams, this.options)
  }

  getEatingList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/eating/GetEatingList?` + queryParams, this.options)
  }

  getOrganizeLevelList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizeLevelList?` + queryParams, this.options);
  }

  getOrganizeList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizeList?` + queryParams, this.options);
  }

  getOrganizations(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizations?` + queryParams, this.options);
  }

  organizeGetDepartments(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetDepartments?${queryParams}`, this.options)
  }

  setListEmployeeChange(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetListEmployeeChange`, queryParams, this.options)
  }

  delOrganize(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/organize/DelOrganize?` + queryParams, this.options)
  }

  setOrganize(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/organize/SetOrganize`, queryParams, this.options)
  }

  getPositionList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionList?` + queryParams, this.options)
  }

  getPositionTitles(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionTitles?` + queryParams, this.options)
  }

  setOrganizeInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/organize/SetOrganizeInfo`, queryParams, this.options)
  }

  getUsersByCust(custId): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiBaseUrl}/api/v1/user/GetUsersByCust?custId=${custId}`, this.options);
  }

  getUserSearchPage(filter): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiCore}/api/v1/coreuser/GetUserSearchPage?filter=${filter}`, this.options)
  }

  setOrganizePosition(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/organize/SetOrganizePosition`, queryParams, this.options)
  }

  getReportList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/report/GetReportList?` + queryParams, this.options)
  }
  
  setUserAdd(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/user/SetUserAdd`, params, this.options)
  }
  
  setOrganizeCompany(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/organize/SetOrganizeCompany`, queryParams, this.options)
  }

  getPositionPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionPage?` + queryParams, this.options)
  }

  delPositionInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/position/DelPositionInfo?` + queryParams, this.options)
  }

  delWorkplaceInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/workplace/DelWorkplaceInfo?` + queryParams, this.options)
  }

  getWorkplacePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/workplace/GetWorkplacePage?` + queryParams, this.options)
  }

  getOrganizeConfig(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizeConfig?` + queryParams, this.options)
  }

  setOrganizeConfig(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/organize/SetOrganizeConfig`,queryParams, this.options)
  }

  getBanByOrganize(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetBanByOrganize?` + queryParams, this.options)
  }

  getDepartmentByOrganize(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetDepartmentByOrganize?` + queryParams, this.options)
  }

  getGroupByOrganize(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetGroupByOrganize?` + queryParams, this.options)
  }

  getTeamByOrganize(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetTeamByOrganize?` + queryParams, this.options)
  }

  getPositionInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionInfo?` + queryParams, this.options)
  }

  setPositionInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/position/SetPositionInfo`, params, this.options)
  }

  getWorkplaceInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/workplace/GetWorkplaceInfo?` + queryParams, this.options)
  }
  
  setWorkplaceInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/workplace/SetWorkplaceInfo`, queryParams, this.options)
  }

  getCompanyPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/compay/GetCompanyPage?` + queryParams, this.options)
  }

  getCompaniesByUserOrganize(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/compay/GetCompaniesByUserOrganize?` + queryParams, this.options)
  }

  setCompanyInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/compay/SetCompanyInfo`, params, this.options)
  }
  
  setEatingInfo(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/eating/SetEatingInfo`, params, this.options)
  }

  getEatingExport(queryParams: any): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/eating/GetEatingExport?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  gxportEatingPage(queryParams: any): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/eating/ExportEatingPage?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  exportEatingInfo(queryParams: any): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/eating/ExportEatingInfo?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  delCompanyInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/compay/DelCompanyInfo?` + queryParams, this.options)
  }

  getCompanyInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/compay/GetCompanyInfo?` + queryParams, this.options)
  }

  delComAuthorizeInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/compay/DelComAuthorizeInfo?` + queryParams, this.options)
  }

  getComAuthorizeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/compay/GetComAuthorizeInfo?` + queryParams, this.options)
  }

  setComAuthorizeInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/compay/SetComAuthorizeInfo`, params, this.options)
  }

  getContractTypePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contracttype/GetContractTypePage?` + queryParams, this.options)
  }

  getContractPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetContractPage?` + queryParams, this.options)
  }

  
  getContractTypeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contracttype/GetContractTypeInfo?` + queryParams, this.options)
  }
  
  setContractTypeInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contracttype/SetContractTypeInfo`, params, this.options)
  }

  uploadFileContract(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contracttype/UploadFileContract`, params, this.options)
  }

  delContractTypeInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/contracttype/DelContractTypeInfo?` + queryParams, this.options)
  }

  // api cũ
  getCardCustomers<T>(filter): Observable<T> {
    return this.http
      .get<T>(`${apiShome}/api/v1/shome/GetCardCustomers?${filter}`, this.options);
  }

  getCardInfo<T>(cardNum: string, customerPhoneNumber: string, HardwareId: string): Observable<T> {
    return this.http
      .get<T>(`${apiBaseUrl}/api/v1/shome/GetCardInfo?` +
        `cardNum=${cardNum}&` +
        `customerPhoneNumber=${customerPhoneNumber}&` +
        `hardwareId=${HardwareId}`, this.options);
  }

  getBuildCdByProjectCd<T>(projectCd: string): Observable<T> {
    return this.http
      .get<T>(`${apiShome}/api/v1/shome/GetBuildCdByProjectCd?` +
        `projectCd=${projectCd}`, this.options);
  }

  getMasElevatorCards(filter, offset, pagesize): Observable<CardInfo[]> {
    return this.http
      .get<CardInfo[]>(`${apiShome}/api/v1/shome/GetMasElevatorCards?` +
        `filter=${filter}&` +
        `offSet=${offset}&` +
        `pageSize=${pagesize}`, this.options);
  }

  GetBuildFloorByProjectCdBuildCd(buildZone, projectCd, buildCd): Observable<BuildZone[]> {
    return this.http
      .get<BuildZone[]>(`${apiShome}/api/v1/shome/GetBuildFloorByProjectCdBuildCd?` +
        `projectCd=${projectCd}&` +
        `buildZone=${buildZone}&` +
        `buildCd=${buildCd}&`, this.options);
  }

  getElevatorDevicePage(filter, offset, pagesize, projectCd, buildZone, buildCd, floorNumber = null): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${apiShome}/api/v1/shome/GetElevatorDevicePage?` +
        `filter=${filter}&` +
        `offSet=${offset}&` +
        `pageSize=${pagesize}&` +
        `buildCd=${buildCd}&` +
        `projectCd=${projectCd}&` +
        `floorNumber=${floorNumber}&` +
        `buildZone=${buildZone}`
        , this.options);
  }

  getEmployeeCardPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/cardvehicle/GetEmployeeCardPage?` + queryParams, this.options);
  }

  getEmployeeList(queryParams): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiBaseUrl}/api/v2/employee/GetEmployeeList?` + queryParams, this.options)
  }

  setVehicleRemove(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/cardvehicle/SetVehicleRemove`, params, this.options);
  }

  lockCardVehicle<T>(cardVehicleId) {
    const card = { status: 1, cardVehicleId };
    return this.http.put<T>(`${apiHrmServer}/api/v2/cardvehicle/SetVehicleLock`, card, this.options);
  }

  getUserPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/user/GetUserPage?` + queryParams, this.options)
  }

  getEmployeeVehiclePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/cardvehicle/GetEmployeeVehiclePage?` + queryParams, this.options);
  }

  getEmployeeVehicleInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/cardvehicle/GetEmployeeVehicleInfo?` + queryParams, this.options);
  }

  setEmployeeVehicleInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/cardvehicle/SetEmployeeVehicleInfo`, params, this.options)
  }

  setVehicleApprove<T>(data) {
    return this.http.put<T>(`${apiHrmServer}/api/v2/cardvehicle/SetVehicleApprove`, data, this.options);
  }

  getVehicleTypes(): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiBaseUrl}/api/v1/shome/GetVehicleTypes`, this.options);
  }

  unlockCardVehicle<T>(cardVehicleId) {
    const card = { status: 0, cardVehicleId };
    return this.http.put<T>(`${apiHrmServer}/api/v2/cardvehicle/SetVehicleLock`, card, this.options);
  }

  getCardVehicleDetail(cardVehicleId): Observable<Vehicle> {
    return this.http
      .get<Vehicle>(`${apiBaseUrl}/api/v1/shome/GetCardVehicleDetail?cardVehicleId=${cardVehicleId}`, this.options);
  }

  getDetailEmployeeVehicleInfo(cardVehicleId): Observable<Vehicle> {
    return this.http
      .get<Vehicle>(`${apiHrmServer}/api/v2/cardvehicle/GetDetailEmployeeVehicleInfo?cardVehicleId=${cardVehicleId}`, this.options);
  }

  approveCardVehicle<T>(cardVehicleId) {
    const card = { cardVehicleId, status: 1 };
    return this.http.put<T>(`${apiBaseUrl}/api/v1/shome/SetCardVehicleServiceAuth`, card, this.options).toPromise();

  }

  lockCardNV<T>(cardCd) {
    const card = { cardCd, status: 1 };
    return this.http.put<T>(`${apiHrmServer}/api/v2/cardvehicle/SetCardLock`, card, this.options);
  }

  setCardVehicle<T>(cardVehicleId, cardCd = null, vehicleTypeId, vehicleNo, vehicleColor = null, vehicleName, startTime, endTime, note = null, custId = null, imageLinks = null) {
    const cardSet = {
      cardVehicleId, cardCd, vehicleTypeId, vehicleNo, vehicleColor, vehicleName, serviceId: 0,
      startTime, endTime, note, status: 0, custId, imageLinks: imageLinks
    };
    return this.http.put<T>(`${apiHrmServer}/api/v2/cardvehicle/SetServiceVehicle`, cardSet, this.options);
  }

  setCardVip<T>(cardCd, employeeId, cardName) {
    const card = {
      employeeId: employeeId, cardName, cardCd,
      issueDate: '', expireDate: '', cardTypeId: 0, isVIP: true
    };
    return this.http.post<T>(`${apiShome}/api/v1/shome/SetCardVip`, card, this.options);
  }

  unlockCardNV<T>(cardCd) {
    const card = { cardCd, status: 0 };
    return this.http.put<T>(`${apiHrmServer}/api/v2/cardvehicle/SetCardLock`, card, this.options);
  }

  deleteCard(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/cardvehicle/DeleteCard?` + queryParams, this.options)
  }

  GetElevatorFloorPage(filter, offset, pagesize, projectCd, buildCd, buildZone): Observable<ElevatorFloor[]> {
    return this.http
      .get<ElevatorFloor[]>(`${apiShome}/api/v1/shome/GetElevatorFloorPage?` +
        `filter=${filter}&` +
        `offSet=${offset}&` +
        `pageSize=${pagesize}&` +
        `projectCd=${projectCd}&` +
        `buildCd=${buildCd}&` +
        `buildZone=${buildZone}&`
        , this.options);
  }

  setMasElevatorFloor(params): Observable<string> {
    return this.http
      .post<string>(`${apiShome}/api/v1/shome/SetMasElevatorFloor`, params, this.options);
  }

  getFloorTypeByBuildCd(buildCd): Observable<BuildZone[]> {
    return this.http
      .get<BuildZone[]>(`${apiShome}/api/v1/shome/GetFloorTypeByBuildCd?` +
        `buildCd=${buildCd}&`, this.options);
  }

  getBuildByProjectCd(projectCd): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiShome}/api/v1/shome/GetBuildCdByProjectCd?` +
        `projectCd=${projectCd}&`, this.options);
  }

  setMasElevatorDevice(params): Observable<string> {
    return this.http
      .post<string>(`${apiShome}/api/v1/shome/SetMasElevatorDevice`, params, this.options);
  }

  getFoorInfoGo(filter, projectCd, buildZone, buildCd, hardWareId, offset, pagesize): Observable<CardInfo[]> {
    return this.http
      .get<CardInfo[]>(`${apiShome}/api/v1/shome/GetFoorInfoGo?` +
        `filter=${filter}&` +
        `projectCd=${projectCd}&` +
        `buildZone=${buildZone}&` +
        `buildCd=${buildCd}&` +
        `hardWareId=${hardWareId}&` +
        `offSet=${offset}&` +
        `pageSize=${pagesize}`, this.options);
  }

  addRoleCard(mEcard: CardInfo): Observable<any> {
    return this.http.post<any>(`${apiShome}/api/v1/shome/SetMasElevatorCard`, mEcard, this.options);
  }

  getElevatorCardRole<T>(): Observable<T> {
    return this.http
      .get<T>(`${apiShome}/api/v1/shome/GetElevatorCardRole`, this.options);
  }
  
  getCardTypeList(): Observable<TypeCard[]> {
    return this.http.get<TypeCard[]>(`${apiBaseUrl}/api/v2/customer/GetCardTypeList`, this.options);
  }

  getProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${apiBaseUrl}/api/v1/shome/GetProjects`, this.options);
  }

  getElevatorFloors<T>(buildCd: string): Observable<T> {
    return this.http
      .get<T>(`${apiShome}/api/v1/shome/GetElevatorFloors?` +
        `buildCd=${buildCd}`, this.options);
  }

  deleteRoleCard(MasECid): Observable<string> {
    return this.http
      .delete<string>(`${apiShome}/api/v1/shome/DeleteMasElevatorCard?MasECid=${MasECid}`, this.options);
  }

  getBuildZoneByBuildCd(projectCd, buildCd): Observable<BuildZone[]> {
    return this.http
      .get<BuildZone[]>(`${apiShome}/api/v1/shome/GetBuildZoneByBuildCd?` +
        `buildCd=${buildCd}&projectCd=${projectCd}`, this.options);
  }

  getEmployeeCardInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/cardvehicle/GetEmployeeCardInfo?` + queryParams, this.options)
  }

  setEmployeeCardInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/cardvehicle/SetEmployeeCardInfo`, queryParams, this.options)
  }
  
  getParameterPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/work/GetParameterPage?` + queryParams, this.options)
  }

  getInvParameter(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/work/GetInvParameter?` + queryParams, this.options)
  }

  setInvParameter(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/work/SetInvParameter`, params, this.options)
  }

  // AnnualLeave
  getAnnualLeavePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/annualleave/GetAnnualLeavePage?` + queryParams, this.options)
  }

  getAnnualAddPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/annualleave/GetAnnualAddPage?` + queryParams, this.options)
  }

  getAnnualAddInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/annualleave/GetAnnualAddInfo?` + queryParams, this.options)
  }

  setAnnualAddInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/annualleave/SetAnnualAddInfo`, queryParams, this.options)
  }

  setAnnualAddOrgInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/annualleave/SetAnnualAddOrgInfo`, queryParams, this.options)
  }

  delAnnualAddInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/annualleave/DelAnnualAddInfo?` + queryParams, this.options)
  }

  exportAnnualleave(queryParams: any): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/annualleave/ExportAnnualleave?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  getLeaveRequestMonthInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/annualleave/GetLeaveRequestMonthInfo?` + queryParams, this.options)
  }

  annualleaveImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/annualleave/Import`, data, customOptions);
  }

  // TimeLine
  getStatusTimelineEmployee(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetStatusTimelineEmployee`, this.options)
  }
  
  getStatusTimelineTerminate(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/terminate/GetStatusTimelineTerminate`, this.options)
  }

  // Holiday

  getHolidayPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/holiday/GetHolidayPage?` + queryParams, this.options)
  }

  holidayPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/holiday/HolidayPage?` + queryParams, this.options)
  }

  getHolidayInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/holiday/GetHolidayInfo?` + queryParams, this.options)
  }

  getHolidayDate(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/holiday/GetHolidayDate?` + queryParams, this.options)
  }

  setHolidayInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/holiday/SetHolidayInfo` , queryParams, this.options)
  }

  delHoliday(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/holiday/DelHoliday?` + queryParams, this.options)
  }

  deleteHoliday(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/holiday/DeleteHoliday?` + queryParams, this.options)
  }

  setHolidayAdd(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/holiday/SetHolidayAdd`, params , this.options)
  }

  setHolidayCreate(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/holiday/SetHolidayCreate`, params , this.options)
  }
  
  contractImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/Import`, data, customOptions);
  }

  setListContractStatus(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/contract/SetListContractStatus`, params, this.options);
  }

  getDashboardInfo(params): Observable<any> {
    // return this.http.get<any>(`${apiHrmServer}/api/v2/dashboard/GetDashboardInfo?` + queryParams, this.options)
    return this.http.post<any>(`${apiHrmServer}/api/v2/dashboard/GetDashboardInfo`, params , this.options)
  }

  getFormPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/form/GetFormPage?` + queryParams, this.options)
  }

  getFormInfo(formId: string): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/form/GetFormInfo?formId=${formId}`, this.options)
  }

  setFormInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/form/SetFormInfo`, data , this.options)
  }

  delFormInfo(formId): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/form/DelFormInfo?formId=${formId}`, this.options)
  }

  getFormTypePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/form/GetFormTypePage?` + queryParams, this.options)
  }

  getFormTypes(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/form/GetFormTypes?` + queryParams, this.options)
  }

  getFormTypeInfo(formTypeId: string): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/form/GetFormTypeInfo?formTypeId=${formTypeId}`, this.options)
  }

  setFormTypeInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/form/SetFormTypeInfo`, data , this.options)
  }

  delFormTypeInfo(formId: string): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/form/DelFormTypeInfo?formId=${formId}`, this.options)
  }
  employeeImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/Import`, data, customOptions);
  }

  ImportVehicle(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/cardvehicle/ImportVehicle`, data, customOptions);
  }
  
  importCards(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/cardvehicle/ImportCards`, data, customOptions);
  }

  
  uploadDrive(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/form/UploadDrive`, data, customOptions);
  }

  getTimekeepingWifiPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/timekeeping/GetTimekeepingWifiPage?` + queryParams, this.options)
  }

  getTimekeepingWifiInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/timekeeping/GetTimekeepingWifiInfo?${queryParams}`, this.options)
  }

  setTimekeepingWifiInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/timekeeping/SetTimekeepingWifiInfo`, data , this.options)
  }

  delTimekeepingWifiInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/timekeeping/DelTimekeepingWifiInfo?${queryParams}`, this.options)
  }

  // quá trình thay đổi lương
  getHrmPayrollRecordPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollRecord/GetHrmPayrollRecordPage?` + queryParams, this.options)
  }

  getHrmPayrollRecordInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollRecord/GetHrmPayrollRecordInfo?${queryParams}`, this.options)
  }

  setHrmPayrollRecordInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payrollRecord/SetHrmPayrollRecordInfo`, data , this.options)
  }

  delHrmPayrollRecord(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/payrollRecord/DelHrmPayrollRecord?${queryParams}`, this.options)
  }

  timekeepingDeviceStatus(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/timekeeping/TimekeepingDeviceStatus`, data , this.options)
  }

  // new qt thay doi luong
  getSalaryInfoPageDevM(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryInfoPage?` + queryParams, this.options)
  }

  getSalaryInfoDevM(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryInfo?` + queryParams, this.options)
  }

  getSalaryInfoPageByEmpId(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryInfoPageByEmpId?` + queryParams, this.options)
  }

  setSalaryInfoDevM(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/salaryInfo/SetSalaryInfo`, data , this.options)
  }

  delSalaryInfoDevM(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/salaryInfo/DelSalaryInfo?${queryParams}`, this.options)
  }

  // loai bang luong
  getHrmPayrollTypePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollType/GetHrmPayrollTypePage?` + queryParams, this.options)
  }

  getHrmPayrollTypeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollType/GetHrmPayrollTypeInfo?${queryParams}`, this.options)
  }

  setHrmPayrollTypeInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payrollType/SetHrmPayrollTypeInfo`, data , this.options)
  }

  delHrmPayrollType(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/payrollType/DelHrmPayrollType?${queryParams}`, this.options)
  }

  getHrmMeetingPerson(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetHrmMeetingPerson?${queryParams}`, this.options)
  }

  getHrmFormsPerson(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/forms/GetHrmFormsPerson?${queryParams}`, this.options)
  }

  // Forms

  getFormGeneral(queryParams, urlLink): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/forms/${urlLink}?${queryParams}`, this.options)
  }

  getFormPersonal(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/forms/GetFormPersonal?${queryParams}`, this.options)
  }

  getFormsInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/forms/getFormsInfo?${queryParams}`, this.options)
  }

  setFormsInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/forms/SetFormsInfo`,queryParams, this.options)
  }

  setFormsTypeInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/forms/SetFormsTypeInfo`,queryParams, this.options)
  }

  shareToApp(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/forms/ShareToApp?` + queryParams, null, this.options)
  }

  uploadDrives(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/forms/UploadDrive`, data, customOptions);
  }

  delFormsInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/forms/DelFormsInfo?${queryParams}`, this.options)
  }

  delFormsTypeInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/forms/DelFormsTypeInfo?${queryParams}`, this.options)
  }

  getFormsTypePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/forms/GetFormsTypePage?${queryParams}`, this.options)
  }

  getFormsTypes(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/forms/GetFormsTypes?${queryParams}`, this.options)
  }

  getFormsTypeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/forms/GetFormsTypeInfo?${queryParams}`, this.options)
  }

  getCompaniesByOrganize(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/compay/GetCompaniesByOrganize?` + queryParams, this.options);
  }

  // thành phần lương
  getHrmPayrollAttributePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollAttribute/GetHrmPayrollAttributePage?` + queryParams, this.options)
  }

  getHrmPayrollAttributeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollAttribute/GetHrmPayrollAttributeInfo?${queryParams}`, this.options)
  }

  setHrmPayrollAttributeInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payrollAttribute/SetHrmPayrollAttributeInfo`, data , this.options)
  }

  delHrmPayrollAttribute(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/payrollAttribute/DelHrmPayrollAttribute?${queryParams}`, this.options)
  }

  getFloorNo(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/meeting/GetFloorNo`, this.options)
  }
  checkTimeHrm(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/meeting/CheckTimeHrm`, data , this.options)
  }

  getHrmCardByCustId(query): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/cardvehicle/GetHrmCardByCustId?${query}`, this.options)
  }

  // tính lương
  // bang luong
  getPayrollInfoPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payroll/GetPayrollInfoPage?` + queryParams, this.options)
  }
  getPayrollInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payroll/GetPayrollInfo?${queryParams}`, this.options)
  }
  setPayrollInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payroll/SetPayrollInfo`, data , this.options)
  }
  delPayrollInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/payroll/DelPayrollInfo?${queryParams}`, this.options)
  }
  getPayrollComponentPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payroll/GetPayrollComponentPage?${queryParams}`, this.options)
  }
  getPayrollComponentInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payroll/GetPayrollComponentInfo?${queryParams}`, this.options)
  }
  setPayrollComponentInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payroll/SetPayrollComponentInfo`,queryParams, this.options)
  }
  delPayrollComponent(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/payroll/DelPayrollComponent?${queryParams}`, this.options)
  }

  // tham số
  getPayrollParamPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollparam/GetPayrollParamPage?` + queryParams, this.options)
  }
  getPayrollParam(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollparam/GetPayrollParam?${queryParams}`, this.options)
  }
  setPayrollParam(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payrollparam/SetPayrollParam`, data , this.options)
  }
  delPayrollParam(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/payrollparam/DelPayrollParam?${queryParams}`, this.options)
  }

  // thành phần lương
  getComponentPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollComponent/GetComponentPage?` + queryParams, this.options)
  }
  getComponentInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollComponent/GetComponentInfo?${queryParams}`, this.options)
  }
  setComponentInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payrollComponent/SetComponentInfo`, data , this.options)
  }
  delComponent(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/payrollComponent/DelComponent?${queryParams}`, this.options)
  }

  // cap bac luong
  getPayrollBasePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollbase/GetPayrollBasePage?` + queryParams, this.options)
  }
  getPayrollBaseInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollbase/GetPayrollBaseInfo?${queryParams}`, this.options)
  }
  setPayrollBaseInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payrollbase/SetPayrollBaseInfo`, data , this.options)
  }
  delPayrollBase(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/payrollbase/DelPayrollBase?${queryParams}`, this.options)
  }

  getPayrollRankPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollbase/GetPayrollRankPage?${queryParams}`, this.options)
  }

  getPayrollRankInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/payrollbase/GetPayrollRankInfo?${queryParams}`, this.options)
  }

  delPayrollRank(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/payrollbase/DelPayrollRank?${queryParams}`, this.options)
  }

  setPayrollRankInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payrollbase/SetPayrollRankInfo`, queryParams, this.options)
  }

  employeeGetTerminatePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetTerminatePage?` + queryParams, this.options)
  }
  recruitAgain(query, data = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/RecruitAgain?` + query, data , this.options)
  } 
  getUserOrganizeRole(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/user/GetUserOrganize`, this.options)
  }

  // tuye dung -> mail
  
  getRecruitSendMailPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetRecruitSendMailPage?` + queryParams, this.options)
  }
  getRecruitMailPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetRecruitMailPage?` + queryParams, this.options)
  }
  getRecruitMailInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetRecruitMailInfo?${queryParams}`, this.options)
  }
  setRecruitMailInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/SetRecruitMailInfo`, data , this.options)
  }
  delRecruitMailInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitment/DelRecruitMailInfo?${queryParams}`, this.options)
  }

  updateCandidatesPotential(queryParams, data = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/UpdateCandidatesPotential?${queryParams}`, data , this.options)
  }

  // vong tuyen dung
  
  getRecruitRoundPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetRecruitRoundPage?` + queryParams, this.options)
  }
  getRecruitRoundInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetRecruitRoundInfo?${queryParams}`, this.options)
  }
  setRecruitRoundInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/SetRecruitRoundInfo`, data , this.options)
  }
  delRecruitRoundInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitment/DelRecruitRoundInfo?${queryParams}`, this.options)
  }
  getRecruitRoundTitles(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetRecruitRoundTitles?` + queryParams, this.options)
  }

  // nguon tuyen dung
  getRecruitSourcePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetRecruitSourcePage?` + queryParams, this.options)
  }
  getRecruitSourceInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitment/GetRecruitSourceInfo?${queryParams}`, this.options)
  }
  setRecruitSourceInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitment/SetRecruitSourceInfo`, data , this.options)
  }
  delRecruitSourceInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitment/DelRecruitSourceInfo?${queryParams}`, this.options)
  }

  //EmpTrain

  getEmpQualification(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/GetEmpQualification?` + queryParams, this.options)
  }
  getEmpWorkedPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/GetEmpWorkedPage?` + queryParams, this.options)
  }
  getEmpWorked(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/GetEmpWorked?` + queryParams, this.options)
  }
  setEmpQualification(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeetrain/SetEmpQualification`, data , this.options)
  }
  setEmpWorked(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeetrain/SetEmpWorked`, data , this.options)
  }
  delEmpWorked(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employeetrain/DelEmpWorked?${queryParams}`, this.options)
  }
  getEducationPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/GetEmpEducationPage?` + queryParams, this.options)
  }
  addEducation(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/AddEducation?` + queryParams, this.options)
  }
  getEmpEducation(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/GetEmpEducation?` + queryParams, this.options)
  }
  getTrainningPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/GetTrainningPage?` + queryParams, this.options)
  }
  addTraining(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/AddTraining?` + queryParams, this.options)
  }
  delEmpEducation(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employeetrain/DelEmpEducation?` + queryParams, this.options)
  }
  setEmpEducation(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeetrain/SetEmpEducation` ,queryParams, this.options)
  }
  getSkillPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/GetSkillPage?` + queryParams, this.options)
  }
  addSkill(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/AddSkill?` + queryParams, this.options)
  }
  getCertificatePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/GetCertificatePage?` + queryParams, this.options)
  }
  addCertificate(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/AddCertificate?` + queryParams, this.options)
  }
  getTrainFile(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/GetTrainFile?` + queryParams, this.options)
  }
  setTrainFile(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeetrain/SetTrainFile`, queryParams, this.options)
  }
  delTrainFile(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employeetrain/DelTrainFile?` + queryParams, this.options)
  }

  getEmpTrainPage(queryParams, linkurl): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeetrain/${linkurl}?` + queryParams, this.options)
  }

  // EmpProfile
  getEmpProfile(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpProfile?` + queryParams, this.options)
  }
  setEmpProfile(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/SetEmpProfile` , queryParams, this.options)
  }
  getEmpIdcardPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpIdcardPage?` + queryParams, this.options)
  }
  lockEmployee(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/LockEmployee` ,  queryParams, this.options)
  }
  unLockEmployee(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/UnLockEmployee` ,  queryParams, this.options)
  }
  setEmployeeOpen(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/SetEmployeeOpen` ,  queryParams, this.options)
  }
  setEmployeeApprove(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/SetEmployeeApprove` ,  queryParams, this.options)
  }
  getEmpRecordPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpRecordPage?` +  queryParams, this.options)
  }
  addEmpRecord(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/AddEmpRecord?` +  queryParams, this.options)
  }
  empproFileGetEmpAttach(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpAttach?` +  queryParams, this.options)
  }
  empproFileSetEmpAttach(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/SetEmpAttach` ,  queryParams, this.options)
  }
  empproFileDelEmpAttach(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employeeprofile/DelEmpAttach?` + queryParams, this.options)
  }
  getEmpPersonalPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpPersonalPage?` +  queryParams, this.options)
  }
  addEmpPersonal(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/AddEmpPersonal?` +  queryParams, this.options)
  }
  getEmpContactPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpContactPage?` +  queryParams, this.options)
  }
  // ct hồ sơ ns - thông tin cá nhân - lien hệ
  empProfileGetEmpContact(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpContact?` +  queryParams, this.options)
  }
  empProfileSetEmpContact(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/SetEmpContact` ,  queryParams, this.options)
  }
  delEmpContact(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employeeprofile/DelEmpContact?` +  queryParams, this.options)
  }

  // EmpWorking
  
  getEmpWorkingPageByEmpId(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpWorkingPageByEmpId?` +  queryParams, this.options)
  }

  getEmpProcessPageByEmpId(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpProcessPageByEmpId?` +  queryParams, this.options)
  }

  getEmpWorkJob(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpWorkJob?` +  queryParams, this.options)
  }
  getEmpWorking(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpWorking?` +  queryParams, this.options)
  }
  setEmpWorking(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/working/SetEmpWorking` ,  queryParams, this.options)
  }
  delEmpWorking(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/working/DelEmpWorking?` +  queryParams, this.options)
  }
  getEmpWorkingPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpWorkingPage?` +  queryParams, this.options)
  }
  setEmpWorkingChanges(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/working/SetEmpWorkingChanges` ,  queryParams, this.options)
  }
 

  
  // deleteEmployee(queryParams): Observable<any> {
  //   return this.http.delete<any>(`${apiHrmServer}/api/v2/employeeprofile/DeleteEmployee?` + queryParams, this.options)
  // }

  
  // contract
  getEmpByContract(query): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/contract/GetEmpByContract?` + query, this.options);
  }
  
  getObjects(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetObjects?` + queryParams, this.options);
  }

}
