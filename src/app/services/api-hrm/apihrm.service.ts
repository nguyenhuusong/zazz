import { inject, Injectable } from '@angular/core';
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
  private http = inject(HttpClient);
  private authService = inject(AuthService)
  constructor() {
  }
  options = {
    headers: new HttpHeaders({
      Authorization: this.authService.getAuthorizationHeaderValue(),
      'Content-Type': 'application/json',
      'X-Role-Token': localStorage.hasOwnProperty('md5') && localStorage.getItem('md5') ? localStorage.getItem('md5') : ''
    })
  };
  optionsExport = {
    headers: new HttpHeaders({
      Authorization: this.authService.getAuthorizationHeaderValue(),
    }),
    responseType: "blob"
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
  
  getWorktimeList(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/worktime/GetWorktimeList`, this.options)
  }

  setWorktimeInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/worktime/SetWorktimeInfo`, queryParams, this.options)
  }

  getWorktimeImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/worktime/GetWorktimeImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
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

  getNotifyTempList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyTempList?` + queryParams, this.options);
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

  setNotifyTo(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/notify/SetNotifyTo`, queryParams, this.options);
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

  getNotifyTo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyTo?` + queryParams, this.options);
  }

  setNotifyToDraft(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/notify/SetNotifyToDraft`, queryParams, this.options);
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

  setSalaryRecordFinal(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/salary/SetSalaryRecordFinal`, queryParams, this.options)
  }

  setSalaryRecordClose(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/salary/SetSalaryRecordClose`, queryParams, this.options)
  }

  delSalaryRecord(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/salary/DelSalaryRecord`+ queryParams, this.options)
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
  
  getSalaryWorkTimePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryWorkTimePage?` + queryParams, this.options)
  }

  getSalaryEatingPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/eating/GetSalaryEatingPage?` + queryParams, this.options)
  }

  getSalarySupportPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryevaluate/GetSalarySupportPage?` + queryParams, this.options)
  }

  getSalaryDeductPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryDeductPage?` + queryParams, this.options)
  }

  getSalaryPartimePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salarypartime/GetSalaryPartimePage?` + queryParams, this.options)
  }

  getSalaryEvaluatePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryevaluate/GetSalaryEvaluatePage?` + queryParams, this.options)
  }
  
  getSalaryRecordInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryRecordInfo?` + queryParams, this.options)
  }

  getSalaryWorkStatus(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/getSalaryWorkStatus?` + queryParams, this.options)
  }

  getSalaryTotalEmp(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryTotalEmp?` + queryParams, this.options)
  }

  getSalaryTotalPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salary/GetSalaryTotalPage?` + queryParams, this.options)
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

  getPrintFilesTerminate(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/terminate/GetPrintFiles` ,queryParams, this.options);
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

  getContractRecord(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetContractRecord?` + queryParams, this.options)
  }

  setContractCreate(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetContractDraft` , queryParams, this.options)
  }

  setContractRecord(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetContractRecord` , queryParams, this.options)
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

  setCandidateRegisters<T>(data): Observable<T> {
    return this.http.post<T>(`${apiHrmServer}/api/v1/user/SetCandidateRegisters`, data, this.options);
  }

  setCandidateRegister<T>(data): Observable<T> {
    return this.http.post<T>(`${apiHrmServer}/api/v1/recruitcandidate/SetCandidateRegUser`, data, this.options);
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

  resetPasswordOtp(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/user/ResetPasswordOtp`, params, this.options);
  }

  hrmDelEmpWorking(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/working/DelEmpWorking?` + queryParams, this.options);
  }

  setEmpWorkJob(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/working/SetEmpWorkJob`, params, this.options)
  }

  delContractInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/contract/DelContractInfo?` + queryParams, this.options)
  }
  
  delEmpAttach(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employee/DelEmpAttach?` + queryParams, this.options)
  }
  
  getEmpFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmpFilter`, this.options)
  }

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

  setOrganizeExport(queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/organize/SetOrganizeExport?` + queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setOrganizeImport(queryParams): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v1/organize/SetOrganizeImport`,  queryParams, customOptions);
  }

  setOrganizeAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/organize/SetOrganizeAccept`,  queryParams, this.options);
  }

  getContract(queryParams): Observable<any> {
    return this.http.get<any>(`${apiCore}/api/v1/coresaler/GetContract?` + queryParams, this.options)
  }

  getOrganizeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrganizeInfo?` + queryParams, this.options)
  }

  getCompanies(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/compay/GetCompanies?` + queryParams, this.options)
  }

  getOrganizeParam(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/report/GetOrganizeParam?` + queryParams, this.options)
  }

  getDepartmentParams(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/report/GetDepartmentParams?` + queryParams, this.options)
  }

  getUsersByAdmin(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/userrole/getUsersByAdmin?` + queryParams, this.options)
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

  getNotifyFields(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/notify/GetNotifyFields`, this.options)
  }

  getVacancyPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitvacancy/GetVacancyPage?` + queryParams, this.options)
  }

  getVacancyFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitvacancy/GetVacancyFilter`, this.options)
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

  getContractTypeTemplatePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contracttype/GetContractTypeTemplatePage?${queryParams}`, this.options)
  }

  getContractTypeTemplate(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contracttype/GetContractTypeTemplate?${queryParams}`, this.options)
  }

  delContractTypeTemplate(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/contracttype/DelContractTypeTemplate?${queryParams}`, this.options)
  }

  setContractTypeTemplate(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contracttype/SetContractTypeTemplate`, queryParams, this.options)
  }

  getPrintFiles(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/GetPrintFiles`,queryParams, this.options)
  }

  getContractImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/contract/GetContractImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
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

  getMaternityPregnancPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/maternity/GetMaternityPregnancPage?` + queryParams, this.options)
  }

  getMaternityChildPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/maternity/GetMaternityChildPage?` + queryParams, this.options)
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

  setMaternityPregnancyInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/maternity/SetMaternityPregnancyInfo`, params, this.options)
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
    return this.http.put<any>(`${apiHrmServer}/api/v2/work/SetWorkApprove`, params, this.options)
  }

  getCandidatePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitcandidate/GetCandidatePage?` + queryParams, this.options)
  }

  getCandidateFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitcandidate/GetCandidateFilter`, this.options)
  }
  
  getCandidatePotentialPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitcandidate/GetCandidatePotentialPage?` + queryParams, this.options)
  }

  delCandidateInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitcandidate/DelCandidateInfo?` + queryParams, this.options)
  }

  getCandidateStatus(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitcandidate/GetCandidateStatus?`, this.options)
  }

  importCandidates(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitcandidate/ImportCandidates`, data, customOptions);
  }
  setCandidatesImport(queryParams): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitcandidate/SetCandidatesImport`,  queryParams, customOptions);
  }

  setCandidatesAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitcandidate/SetCandidatesAccept`, queryParams, this.options)
  }

  setCandidateExportDraft(params): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v1/recruitcandidate/SetCandidateExportDraft`, params, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  getCandidateImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v1/recruitcandidate/GetCandidateImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  

  delVacancyInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitvacancy/DelVacancyInfo?` + queryParams, this.options)
  }


  getVacancyInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitvacancy/GetVacancyInfo?` + queryParams, this.options)
  }

  getVacancyReplicationInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitvacancy/GetVacancyReplicationInfo?` + queryParams, this.options)
  }

  setVacancyInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitvacancy/SetVacancyInfo`, params, this.options)
  }

  getCandidateInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitcandidate/GetCandidateInfo?` + queryParams, this.options)
  }

  getCandidatesViewInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitcandidate/GetCandidatesViewInfo?` + queryParams, this.options)
  }

  setCandidateInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitcandidate/SetCandidateInfo`, params, this.options)
  }

  submitCandidateCV(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitcandidate/SubmitCandidateCV`, params, this.options)
  }

  updateCandidates(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitcandidate/UpdateCandidates`, params, this.options)
  }

  recruiUpdateStatus(queryParams, params = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitcandidate/UpdateStatus?`+ queryParams, params, this.options)
  }

  getRecruitMailInput(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitemail/GetRecruitMailInput?` + queryParams, this.options)
  }

  sendRecruitMail(data = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitemail/SendRecruitMail`, data, this.options)
  }

  updateInterviewResult(query, data = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitcandidate/UpdateInterviewResult?` + query, data, this.options)
  }



  exportVacancy(queryParams): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v1/recruitvacancy/ExportVacancy/?${queryParams}`, {
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

  /* 
    @ apiUrl: api search for result
    0: search employee 
    1: Search vehicle
  */
  getEmployeeSearchPopup(apiUrl, queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}${ apiUrl }?` + queryParams, this.options);
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
  
  setEmployeeBlockV2(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeBlock`, params, this.options)
  }

  setEmployeeOpenV2(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeOpen`, params, this.options)
  }

  lockEmployeeV2(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/LockEmployee`, params, this.options)
  }

  unLockEmployeeV2(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/UnLockEmployee`, params, this.options)
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

  getTerminateHiringePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/terminate/GetTerminateHiringePage?` + queryParams, this.options);
  }

  getTerminateFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/terminate/GetTerminateFilter`, this.options);
  }

  setTerminateStatus(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/terminate/SetTerminateStatus`, params, this.options)
  }

  setTerminateApproves(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/terminate/SetTerminateApproves`, params, this.options)
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
    return this.http.get<any>(`${apiHrmServer}/api/v2/leavereason/GetLeaveReasonPage?` + queryParams, this.options)
  }

  setLeaveReasonExport(queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/leavereason/SetLeaveReasonExport?` + queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  getLeaveReasonImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/leavereason/GetLeaveReasonImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setLeaveReasonImport(params): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/leavereason/SetLeaveReasonImport`, params, customOptions);
  }

  setLeaveReasonExportDraft(params): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/leavereason/SetLeaveReasonExportDraft`, params, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  getLeaveReasonFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/leavereason/GetLeaveReasonFilter`, this.options)
  }

  delLeaveReason(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/leavereason/DelLeaveReason?` + queryParams, this.options)
  }
  
  getLeaveReason(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/leavereason/GetLeaveReason?` + queryParams, this.options)
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
    return this.http.post<any>(`${apiHrmServer}/api/v2/leavereason/SetLeaveReason`, queryParams, this.options)
  }

  cancelLeaveStatuses(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/leave/CancelLeaveStatuses`, params, this.options)
  }
  
  setLeaveReasonAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/leavereason/SetLeaveReasonAccept`, queryParams, this.options)
  }

  exportLeave(queryParams): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/leave/ExportLeave/?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
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

  getOrgLevelList(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgLevelList?` + queryParams, this.options);
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

  setEmployeeAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/SetEmployeeAccept`, queryParams, this.options)
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
  // Position

  getPositionPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionPage?` + queryParams, this.options)
  }

  getPositionTitlePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionTitlePage?` + queryParams, this.options)
  }

  getPositionTitleInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionTitleInfo?` + queryParams, this.options)
  }

  setPositionTitleInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/position/SetPositionTitleInfo` ,  queryParams, this.options)
  }

  delPositionInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/position/DelPositionInfo?` + queryParams, this.options)
  }

  delPositionTitleInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/position/DelPositionTitleInfo?` + queryParams, this.options)
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

  delProvinceInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/workplace/DelProvinceInfo?` + queryParams, this.options)
  }

  getProvincePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/workplace/GetProvincePage?` + queryParams, this.options)
  }

  getProvinceInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/workplace/GetProvinceInfo?` + queryParams, this.options)
  }
  
  setProvinceInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/workplace/SetProvinceInfo`, queryParams, this.options)
  }

  setWorkplaceInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/workplace/SetWorkplaceInfo`, queryParams, this.options)
  }

  getWorkplaceImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/workplace/GetWorkplaceImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
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
  
  exportEatingList(queryParams: any): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/eating/ExportEatingList?${queryParams}`, {
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

  setCompanyAuthDefault(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/compay/SetCompanyAuthDefault`, queryParams, this.options)
  }

  getComAuthorizeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/compay/GetComAuthorizeInfo?` + queryParams, this.options)
  }

  setCompanyExport(queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/compay/SetCompanyExport?` + queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  getCompanyImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/compay/GetCompanyImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  setComAuthorizeInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/compay/SetComAuthorizeInfo`, params, this.options)
  }

  setCompanyImport(params): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/compay/SetCompanyImport`, params, customOptions);
  }

  setCompanyExportDraft(params): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/compay/SetCompanyExportDraft`, params, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setCompanyAccept(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/compay/SetCompanyAccept`, params, this.options)
  }
  

  getComAuthorizePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/compay/GetComAuthorizePage?` + queryParams, this.options)
  }

  getContractTypePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contracttype/GetContractTypePage?` + queryParams, this.options)
  }

  getContractPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetContractPage?` + queryParams, this.options)
  }

  getContractFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contract/GetContractFilter`, this.options)
  }

  
  getContractTypeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/contracttype/GetContractTypeInfo?` + queryParams, this.options)
  }
  
  setContractTypeInfo(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contracttype/SetContractTypeInfo`, params, this.options)
  }

  setContractTypeExport(params): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/contracttype/SetContractTypeExport?` + params, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  // uploadFileContract(params): Observable<any> {
  //   return this.http.post<any>(`${apiHrmServer}/api/v2/contracttype/UploadFileContract`, params, this.options)
  // }


  uploadFileContract(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/contracttype/UploadFileContract`, data, customOptions);
  }

  delContractTypeInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/contracttype/DelContractTypeInfo?` + queryParams, this.options)
  }

  getContractTypeImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/contracttype/GetContractTypeImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setContractTypeImport(data): Observable<Blob> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/contracttype/SetContractTypeImport`, data, customOptions);
  }

  setContractTypeAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contracttype/SetContractTypeAccept`,  queryParams, this.options);
  }

  setContractTypeExportDraft(params): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/contracttype/SetContractTypeExportDraft`, params, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }


  // api cũ
  // getCardCustomers<T>(filter): Observable<T> {
  //   return this.http
  //     .get<T>(`${apiShome}/api/v1/shome/GetCardCustomers?${filter}`, this.options);
  // }

  getCardCustomers(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/elevator/GetCardCustomers?` + queryParams, this.options)
  }

  getCardInfo<T>(cardNum: string, customerPhoneNumber: string, HardwareId: string): Observable<T> {
    return this.http
      .get<T>(`${apiBaseUrl}/api/v1/shome/GetCardInfo?` +
        `cardNum=${cardNum}&` +
        `customerPhoneNumber=${customerPhoneNumber}&` +
        `hardwareId=${HardwareId}`, this.options);
  }

  // getBuildCdByProjectCd<T>(projectCd: string): Observable<T> {
  //   return this.http
  //     .get<T>(`${apiShome}/api/v1/shome/GetBuildCdByProjectCd?` +
  //       `projectCd=${projectCd}`, this.options);
  // }

  getBuildCdByProjectCd(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/elevator/GetBuildCdByProjectCd?` + queryParams, this.options);
  }

  // getMasElevatorCards(filter, offset, pagesize): Observable<CardInfo[]> {
  //   return this.http
  //     .get<CardInfo[]>(`${apiShome}/api/v1/shome/GetMasElevatorCards?` +
  //       `filter=${filter}&` +
  //       `offSet=${offset}&` +
  //       `pageSize=${pagesize}`, this.options);
  // }

  getMasElevatorCards(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/elevator/GetMasElevatorCards?` + queryParams, this.options)
  }

  GetBuildFloorByProjectCdBuildCd(buildZone, projectCd, buildCd): Observable<BuildZone[]> {
    return this.http
      .get<BuildZone[]>(`${apiShome}/api/v1/shome/GetBuildFloorByProjectCdBuildCd?` +
        `projectCd=${projectCd}&` +
        `buildZone=${buildZone}&` +
        `buildCd=${buildCd}&`, this.options);
  }

  // getElevatorDevicePage(filter, offset, pagesize, projectCd, buildZone, buildCd, floorNumber = null): Observable<Project[]> {
  //   return this.http
  //     .get<Project[]>(`${apiShome}/api/v1/shome/GetElevatorDevicePage?` +
  //       `filter=${filter}&` +
  //       `offSet=${offset}&` +
  //       `pageSize=${pagesize}&` +
  //       `buildCd=${buildCd}&` +
  //       `projectCd=${projectCd}&` +
  //       `floorNumber=${floorNumber}&` +
  //       `buildZone=${buildZone}`
  //       , this.options);
  // }

  getEmployeeCardPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/cardvehicle/GetEmployeeCardPage?` + queryParams, this.options);
  }

  getEmployeeList(queryParams): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiBaseUrl}/api/v2/employee/GetEmployeeList?` + queryParams, this.options)
  }

  setVehicleRemove(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/cardvehicle/SetVehicleRemove`, params, this.options);
  }

  lockCardVehicle<T>(cardVehicleId) {
    const card = { statusLock: 1, cardVehicleId };
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

  getEmpVehicleInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/cardvehicle/GetEmpVehicleInfo?` + queryParams, this.options);
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
    const card = { statusLock: 0, cardVehicleId };
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

  setCustomerResident(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/cardvehicle/SetCustomerResident`, params, this.options)
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

  // setMasElevatorDevice(params): Observable<string> {
  //   return this.http
  //     .post<string>(`${apiShome}/api/v1/shome/SetMasElevatorDevice`, params, this.options);
  // }

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

  setMasElevatorCard(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/elevator/SetMasElevatorCard`, queryParams, this.options)
  }
  getElevatorCardRole<T>(): Observable<T> {
    return this.http
      .get<T>(`${apiShome}/api/v1/shome/GetElevatorCardRole`, this.options);
  }
  getCardTypeList(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/elevator/GetCardTypeList`, this.options)
  }
  getProjects(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/elevator/GetProjects`, this.options)
  }
  getElevatorFloors(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/elevator/GetElevatorFloors?` + queryParams, this.options)
  }
  getElevatorDevicePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/elevator/GetElevatorDevicePage?` + queryParams, this.options)
  }
  setMasElevatorDevice(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/elevator/SetMasElevatorDevice`, queryParams, this.options)
  }
  getElevatorFloorPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/elevator/GetElevatorFloorPage?` + queryParams, this.options)
  }
  setMasElevatorFloor(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/elevator/SetMasElevatorFloor`, queryParams, this.options)
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

  getEmpVehiclePageByEmp(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/cardvehicle/GetEmpVehiclePageByEmp?` + queryParams, this.options)
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

  getTerminateStatus(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/terminate/GetTerminateStatus?` + queryParams, this.options)
  }

  getTerminateMetaPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/terminate/GetTerminateMetaPage?` + queryParams, this.options)
  }

  setTerminateMetaUpload(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/terminate/SetTerminateMetaUpload`, queryParams, this.options)
  }

  setTerminateAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/terminate/SetTerminateAccept`, queryParams, this.options)
  }

  setTerminateImport(queryParams): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/terminate/SetTerminateImport`, queryParams, customOptions)
  }

  setTerminateExportDraft(queryParams): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/terminate/SetTerminateExportDraft`, queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }
  setTerminateExportTemp(queryParams): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/terminate/SetTerminateExportTemp`, queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
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

  setContractExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/contract/SetContractExportDraft`, data, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setListContractStatus(params): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/contract/SetListContractStatus`, params, this.options);
  }

  setContractAccept(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/contract/SetContractAccept`, params, this.options);
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
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/setEmployeeImport`, data, customOptions);
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
    return this.http.get<any>(`${apiHrmServer}/api/v1/timekeepingwifi/GetTimekeepingWifiPage?` + queryParams, this.options)
  }

  getTimekeepingWifiInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/timekeepingwifi/GetTimekeepingWifiInfo?${queryParams}`, this.options)
  }

  setTimekeepingWifiExport(queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/timekeepingwifi/SetTimekeepingWifiExport?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  setTimekeepingWifiInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/timekeepingwifi/SetTimekeepingWifiInfo`, data , this.options)
  }

  setTimekeepingWifiImport(params): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v1/timekeepingwifi/SetTimekeepingWifiImport`, params, customOptions);
  }

  setTimekeepingWifiExportDraft(params): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v1/timekeepingwifi/SetTimekeepingWifiExportDraft`, params, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  delTimekeepingWifiInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/timekeepingwifi/DelTimekeepingWifiInfo?${queryParams}`, this.options)
  }

  getTimekeepingWifiImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v1/timekeepingwifi/GetTimekeepingWifiImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
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

  // timekeepingDeviceStatus(data): Observable<any> {
  //   return this.http.post<any>(`${apiHrmServer}/api/v1/timekeeping/TimekeepingDeviceStatus`, data , this.options)
  // }

  // new qt thay doi luong
  getSalaryInfoPageNew(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryInfoPage?` + queryParams, this.options)
  }

  getSalaryInfoFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryInfoFilter`, this.options)
  }

  getSalaryInfoNew(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryInfo?` + queryParams, this.options)
  }

  getSalaryMetaPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryMetaPage?` + queryParams, this.options)
  }

  getSalaryInfoPageByEmpId(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryInfoPageByEmpId?` + queryParams, this.options)
  }

  getSalaryComponentPageV1(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryComponentPage?` + queryParams, this.options)
  }

  getSalaryRecord(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryRecord?` + queryParams, this.options)
  }

  setSalaryInfoNew(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/salaryInfo/SetSalaryInfo`, data , this.options)
  }

  setSalaryInfoImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v1/salaryInfo/SetSalaryInfoImport`, data , customOptions)
  }

  setSalaryInfoExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v1/salaryInfo/SetSalaryInfoExportDraft`, data , {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  setSalaryInfoAccept(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/salaryInfo/SetSalaryInfoAccept`, data , this.options)
  }

  setSalaryRecord(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/salaryInfo/SetSalaryRecord`, data , this.options)
  }

  setSalaryDraft(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/salaryInfo/SetSalaryDraft`, data , this.options)
  }

  delSalaryInfoNew(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/salaryInfo/DelSalaryInfo?${queryParams}`, this.options)
  }
  
  getSalaryInfoImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v1/salaryInfo/GetSalaryInfoImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
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

  getFormTypeTreePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/forms/GetFormTypeTreePage?${queryParams}`, this.options)
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

  setPayrollBaseImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v1/payrollbase/SetPayrollBaseImport`, data , customOptions);
  } 

  setPayrollBaseExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v1/payrollbase/SetPayrollBaseExportDraft`, data , {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  } 

  getPayrollBaseImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v1/payrollbase/GetPayrollBaseImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  recruitAgain(query, data = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employee/RecruitAgain?` + query, data , this.options)
  } 

  setPayrollBaseExport(query): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/payrollbase/SetPayrollBaseExport?` + query, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  } 

  getUserOrganizeRole(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/user/GetUserOrganize`, this.options)
  }

  // tuye dung -> mail
  
  getRecruitSendMailPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitemail/GetRecruitSendMailPage?` + queryParams, this.options)
  }
  getRecruitMailPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitemail/GetRecruitMailPage?` + queryParams, this.options)
  }
  getRecruitMailInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitemail/GetRecruitMailInfo?${queryParams}`, this.options)
  }
  setRecruitMailInfo(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitemail/SetRecruitMailInfo`, data , this.options)
  }
  delRecruitMailInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitemail/DelRecruitMailInfo?${queryParams}`, this.options)
  }

  updateCandidatesPotential(queryParams, data = null): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitcandidate/UpdateCandidatesPotential?${queryParams}`, data , this.options)
  }

  getCandidateAgain(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitcandidate/GetCandidateAgain?${queryParams}`, this.options)
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
  getEmpRecord(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpRecord?` +  queryParams, this.options)
  }
  setEmpRecord(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/SetEmpRecord` , queryParams, this.options)
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
  defaultEmpContact(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/DefaultEmpContact`, queryParams, this.options)
  }

  getEmpRecordTypePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpRecordTypePage?` +  queryParams, this.options)
  }

  setEmpRecordTypeInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeeprofile/SetEmpRecordTypeInfo` , queryParams, this.options)
  }

  getEmpRecordTypeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employeeprofile/GetEmpRecordTypeInfo?` +  queryParams, this.options)
  }

  delEmpRecordTypeInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/employeeprofile/DelEmpRecordTypeInfo?` +  queryParams, this.options)
  }

  setEmployeeExport(queryParams: any): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/employee/SetEmployeeExport?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  getEmployeeImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/employee/GetEmployeeImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  getEmployeeSearchPopupVehicle(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmployeeSearchPopupVehicle?` +  queryParams, this.options)
  }

  // EmpWorking
  
  getEmpWorkingPageByEmpId(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpWorkingPageByEmpId?` +  queryParams, this.options)
  }

  getEmpProcessPageByEmpId(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpProcessPageByEmpId?` +  queryParams, this.options)
  }

  getEmpProcessFilter(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpProcessFilter`, this.options)
  }

  getEmpProcessPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpProcessPage?` +  queryParams, this.options)
  }

  getEmpWorkJob(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpWorkJob?` +  queryParams, this.options)
  }

  getEmpWorking(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpWorking?` +  queryParams, this.options)
  }
  
  getEmpProcessInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpProcessInfo?` +  queryParams, this.options)
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

  setEmpProcessInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/working/SetEmpProcessInfo` ,  queryParams, this.options)
  }

  delEmpProcessInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/working/DelEmpProcessInfo?` + queryParams  , this.options)
  }
 
  getEmpWorkingFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/working/GetEmpWorkingFilter`  , this.options)
  }

  setEmpProcessImport(queryParams): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/working/SetEmpProcessImport`,  queryParams, customOptions);
  }
  

  setEmpProcessAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/working/SetEmpProcessAccept`,  queryParams, this.options);
  }

  setEmpProcessExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/working/SetEmpProcessExportDraft`, data,  {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  getEmpProcessImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/working/GetEmpProcessImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
 
  // contract
  getEmpByContract(query): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/contract/GetEmpByContract?` + query, this.options);
  }
  
  getObjects(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/category/GetObjects?` + queryParams, this.options);
  }

  //EmpInsurance
  getEmployeeChangeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/employee/GetEmployeeChangeInfo?` + queryParams, this.options);
  }
  getEmpByInsurance(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empinsurance/GetEmpByInsurance?` + queryParams, this.options);
  }
  getInsuranceImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/empinsurance/GetInsuranceImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }


  // SetEmpByInsuranceInfo --> SetEmpByInsurance
  setEmpByInsuranceInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empinsurance/SetEmpByInsurance` ,  queryParams, this.options)
  }
  getEmpAttactInsurPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empinsurance/GetEmpAttactPage?` + queryParams, this.options);
  }
  getEmpAttachInsur(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empinsurance/GetEmpAttach?` + queryParams, this.options);
  }
  setEmpAttachInsur(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empinsurance/SetEmpAttach` ,  queryParams, this.options)
  }
  delEmpAttachInsur(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/empinsurance/DelEmpAttach?` + queryParams  , this.options)
  }
  getEmpInsurancePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empinsurance/GetEmpInsurancePage?` + queryParams, this.options);
  }
  getInsurancePageByEmp(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empinsurance/GetInsurancePageByEmp?` + queryParams, this.options);
  }
  getInsurancePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empinsurance/GetInsurancePage?` + queryParams, this.options);
  }
  getEmpInsuranceInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empinsurance/GetEmpInsuranceInfo?` + queryParams, this.options);
  }

  getInsuranceInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empinsurance/GetInsuranceInfo?` + queryParams, this.options);
  }
  setInsuranceInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empinsurance/SetInsuranceInfo` ,  queryParams, this.options)
  }

  setInsuranceDraft(data): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empinsurance/SetInsuranceDraft`, data , this.options)
  }
  
  setEmpInsuranceInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empinsurance/SetEmpInsuranceInfo` ,  queryParams, this.options)
  }
  delEmpInsurance(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/empinsurance/DelEmpInsurance?` + queryParams  , this.options)
  }
  delInsuranceInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/empinsurance/DelInsuranceInfo?` + queryParams  , this.options)
  }
  insurSetEmployeeChange(params): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/employeejob/SetEmployeeChange`, params, this.options)
  }
  setEmpByInsurance(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empinsurance/SetEmpByInsurance` ,  queryParams, this.options)
  }

  getFilter(url): Observable<any> {
    return this.http.get<any>(`${apiHrmServer + url} `, this.options)
  }

  imgaetest(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`https://apiidentity.sunshinegroup.vn/Identify/idcard`, data, customOptions)
  }

  // Job

  getJobPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/jobs/GetJobPage?` + queryParams, this.options);
  }

  getJobInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/jobs/GetJobInfo?` + queryParams, this.options);
  }

  getJobTitles(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/jobs/GetJobs`, this.options);
  }
  
  setJobExport (queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/jobs/SetJobExport?` + queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  delJobInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/jobs/DelJobInfo?` + queryParams, this.options);
  }

  setJobInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/jobs/SetJobInfo`, queryParams, this.options);
  }

  setJobImport(queryParams): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v1/jobs/SetJobImport`, queryParams, customOptions);
  }

  setJobExportDraft(queryParams): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v1/jobs/SetJobExportDraft`, queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  getJobImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v1/jobs/GetJobImportTemp/`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  // GetOrgLevelFilter
  getOrgLevelFilter(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgLevelFilter?` + queryParams, this.options);
  }

  getOrgLevelPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgLevelPage?` + queryParams, this.options);
  }

  getOrgLevelInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgLevelInfo?` + queryParams, this.options);
  }
  
  delOrgLevelInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/organize/DelOrgLevelInfo?` + queryParams, this.options);
  }

  setOrgLevelInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/organize/SetOrgLevelInfo`, queryParams, this.options);
  }

  getOrgCompanyPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgCompanyPage?` + queryParams, this.options);
  }

  setOrgCompany(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/organize/SetOrgCompany`, queryParams, this.options);
  }

  getOrgPositionPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgPositionTitlePage?` + queryParams, this.options);
  }

  getPositionTypePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionTypePage?` + queryParams, this.options);
  }

  getPositionTypeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionTypeInfo?` + queryParams, this.options);
  }

  setPositionTypeInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/position/SetPositionTypeInfo`, queryParams, this.options);
  }

  delPositionTypeInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/position/DelPositionTypeInfo?` + queryParams, this.options);
  }

  getOrgPosition(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/position/GetPositionTitles?` + queryParams, this.options);
  }

  getPositionTitleImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/position/GetPositionTitleImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  getPositionImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/position/GetPositionImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setOrgPosition(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/organize/SetOrgPositionTitle`, queryParams, this.options);
  }

  getOrgJobPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/organize/GetOrgJobPage?` + queryParams, this.options);
  }

  setOrgJob(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/organize/SetOrgJob`, queryParams, this.options);
  }
  
  setOrganizeExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v1/organize/SetOrganizeExportDraft`, data,  {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  //Customer

  getCustSearch(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/customer/GetCustSearch?` + queryParams, this.options);
  }

  // TimekeepingChart
  getTimekeepingLate(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/timekeepingchart/GetTimekeepingLate?` + queryParams, this.options);
  }
  getLeaveForMonth(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/timekeepingchart/GetLeaveForMonth?` + queryParams, this.options);
  }
  getLeaveForOrganize(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/timekeepingchart/GetLeaveForOrganize?` + queryParams, this.options);
  }
  getLeavePieChart(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/timekeepingchart/GetLeavePieChart?` + queryParams, this.options);
  }
  
  getTotalEatingChart(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/timekeepingchart/GetTotalEatingChart?` + queryParams, this.options);
  }
  

  //TerminateReason
  getTerminateReasonFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/TerminateReason/GetTerminateReasonFilter`, this.options);
  }
  getTerminateReasonPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/TerminateReason/GetTerminateReasonPage?` + queryParams, this.options);
  }

  getTerminateReasonInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/TerminateReason/GetTerminateReasonInfo?` + queryParams, this.options);
  }

  delTerminateReasonInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/TerminateReason/DelTerminateReasonInfo?` + queryParams, this.options);
  }

  setTerminateReasonInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/TerminateReason/SetTerminateReasonInfo`, queryParams, this.options);
  }

  // EmpOtherGET /api/v2/empother/GetEmpOtherInfo

  getEmpOtherInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empother/GetEmpOtherInfo?` + queryParams, this.options);
  }

  getEmpUserPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empother/GetEmpUserPage?` + queryParams, this.options);
  }

  getEmployeeByUtility(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empother/GetEmployeeByUtility?` + queryParams, this.options);
  }

  getEmpDeviceFilter(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empother/GetEmpDeviceFilter?` + queryParams, this.options);
  }

  getEmpDevicePage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empother/GetEmpDevicePage?` + queryParams, this.options);
  }

  getEmpUserInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empother/GetEmpUserInfo?` + queryParams, this.options);
  }
  
  getEmpDeviceByEmp(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empother/GetEmpDeviceByEmp?` + queryParams, this.options);
  }

  getEmpDevice(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empother/GetEmpDevice?` + queryParams, this.options);
  }

  delEmpDevices(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/empother/DelEmpDevices?` + queryParams, this.options);
  }

  delEmpUserInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/empother/DelEmpUserInfo?` + queryParams, this.options);
  }

  setEmpOtherInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empother/SetEmpOtherInfo` , queryParams, this.options);
  }

  setEmpUserInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empother/SetEmpUserInfo` , queryParams, this.options);
  }

  setEmpDeviceStatus(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empother/SetEmpDeviceStatus` , queryParams, this.options);
  }

  // RecruitPlan
  getRecruitPlanFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitplan/GetRecruitPlanFilter`, this.options);
  }

  getRecruitPlanPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitplan/GetRecruitPlanPage?` + queryParams, this.options);
  }

  getRecruitPlanDetail(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitplan/GetRecruitPlanDetail?` + queryParams, this.options);
  }

  delRecruitPlanDetail(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitplan/DelRecruitPlanDetail?` + queryParams, this.options);
  }

  setRecruitPlanDetail(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitplan/SetRecruitPlanDetail`,  queryParams, this.options);
  }

  getRecruitPlanDetailPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitplan/GetRecruitPlanDetailPage?` + queryParams, this.options);
  }

  setRecruitPlanExport(queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v1/recruitplan/SetRecruitPlanExport?` + queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  getRecruitPlan(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/recruitplan/GetRecruitPlan?` + queryParams, this.options);
  }

  delRecruitPlan(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/recruitplan/DelRecruitPlan?` + queryParams, this.options);
  }

  setRecruitPlan(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitplan/SetRecruitPlan` , queryParams, this.options);
  }

  setRecruitPlanImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitplan/SetRecruitPlanImport`, data, customOptions);
  }

  setRecruitPlanAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/recruitplan/SetRecruitPlanAccept`,  queryParams, this.options);
  }

  getRecruitPlanImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v1/recruitplan/GetRecruitPlanImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  setRecruitPlanExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v1/recruitplan/SetRecruitPlanExportDraft`, data, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setPositionTitleImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/position/SetPositionTitleImport`, data, customOptions);
  }

  setPositionImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/position/SetPositionImport`, data, customOptions);
  }

  setPositionExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/position/SetPositionExportDraft`, data, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setPositionTitleExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/position/SetPositionTitleExportDraft`, data, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setWorkplaceImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/workplace/SetWorkplaceImport`, data, customOptions);
  }

  setWorkplaceExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/workplace/SetWorkplaceExportDraft`, data,  {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setWorktimeImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/worktime/SetWorktimeImport`, data, customOptions);
  }

  setWorktimeExportDraft(queryParams): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/worktime/SetWorktimeExportDraft` , queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }


  setPositionTitleExport(queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/position/SetPositionTitleExport?` + queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  setPositionExport(queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/position/SetPositionExport?` + queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  setWorkplaceExport(queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/workplace/SetWorkplaceExport?` + queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  setWorktimeExport(queryParams): Observable<Blob> {
    return this.http.get(`${apiHrmServer}/api/v2/worktime/SetWorktimeExport?` + queryParams,{
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    })
  }

  setJobAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/jobs/SetJobAccept`,  queryParams, this.options);
  }

  setWorktimeAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/worktime/SetWorktimeAccept`,  queryParams, this.options);
  }

  setWorkplaceAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/workplace/SetWorkplaceAccept`,  queryParams, this.options);
  }

  setTimekeepingWifiAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/timekeepingwifi/SetTimekeepingWifiAccept`,  queryParams, this.options);
  }

  setPayrollBaseAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/payrollbase/SetPayrollBaseAccept`,  queryParams, this.options);
  }

  setPositionTitleAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/position/SetPositionTitleAccept`,  queryParams, this.options);
  }

  setInsuranceAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empinsurance/SetInsuranceAccept`,  queryParams, this.options);
  }

  setInsuranceExportDraft(queryParams): Observable<any> {
    return this.http.post(`${apiHrmServer}/api/v2/empinsurance/SetInsuranceExportDraft`, queryParams, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setPositionAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/position/SetPositionAccept`,  queryParams, this.options);
  }

  setEmployeeExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/employee/SetEmployeeExportDraft`, data, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setInsuranceImport(params): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/empinsurance/SetInsuranceImport`, params, customOptions);
  }

  // SchemeInfo

  getSchemeInfoPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/schemeInfo/GetSchemeInfoPage?` + queryParams, this.options);
  }

  getSchemeOpenPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/schemeInfo/GetSchemeOpenPage?` + queryParams, this.options);
  }

  getSchemeEmpPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/schemeInfo/GetSchemeEmpPage?` + queryParams, this.options);
  }

  getSchemeEmp(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/schemeInfo/GetSchemeEmp?` + queryParams, this.options);
  }

  getSchemeOpen(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/schemeInfo/GetSchemeOpen?` + queryParams, this.options);
  }

  getSchemeInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/schemeInfo/GetSchemeInfo?` + queryParams, this.options);
  }

  delSchemeInfo(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/schemeInfo/DelSchemeInfo?` + queryParams, this.options);
  }

  delSchemeOpen(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v1/schemeInfo/DelSchemeOpen?` + queryParams, this.options);
  }

  setSchemeInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/schemeInfo/SetSchemeInfo` ,  queryParams, this.options);
  }

  setSchemeEmp(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/schemeInfo/SetSchemeEmp` ,  queryParams, this.options);
  }

  setSchemeStatus(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/schemeInfo/SetSchemeStatus` ,  queryParams, this.options);
  }

  setSchemeOpen(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v1/schemeInfo/SetSchemeOpen` ,  queryParams, this.options);
  }
  // SalaryTrans
  getSalaryTransPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryevaluate/GetSalaryTransPage?` + queryParams, this.options);
  }

  getSalaryTrans(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/salaryevaluate/GetSalaryTrans?` + queryParams, this.options);
  }

  // Người phụ thuộc

  getEmpDependentFilter(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empdependent/GetEmpDependentFilter`, this.options);
  }

  getEmpDependentPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empdependent/GetEmpDependentPage?` + queryParams, this.options);
  }

  getEmpDependentPageById(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empdependent/GetEmpDependentPageById?` + queryParams, this.options);
  }

  getEmpDependent(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/empdependent/GetEmpDependent?` + queryParams, this.options);
  }
  
  setEmpDependent(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empdependent/SetEmpDependent` , queryParams, this.options);
  }

  setEmpDependentImport(data): Observable<any> {
    const customOptions = {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue()
      })
    };
    return this.http.post<any>(`${apiHrmServer}/api/v2/empdependent/SetEmpDependentImport`, data, customOptions);
  }

  setEmpDependentAccept(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/empdependent/SetEmpDependentAccept` , queryParams, this.options);
  }

  setEmpDependentExportDraft(data): Observable<Blob> {
    return this.http.post(`${apiHrmServer}/api/v2/empdependent/SetEmpDependentExportDraft`, data,  {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  setEmpDependentExport(queryParams): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/empdependent/SetEmpDependentExport/?${queryParams}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  delEmpDependent(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/empdependent/DelEmpDependent?` +  queryParams, this.options);
  }

  getEmpDependentImportTemp(): Observable<any> {
    return this.http.get(`${apiHrmServer}/api/v2/empdependent/GetEmpDependentImportTemp`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }
  
  // userrole
  getUserroleOrganizations(): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/userrole/GetOrganizations`, this.options);
  }
  
  getEmpSearch(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/userrole/GetEmpSearch?` + queryParams, this.options);
  }

  getUserHiringPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/userrole/GetUserHiringPage?` + queryParams, this.options);
  }
  
  getUserHiringInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/userrole/GetUserHiringInfo?` + queryParams, this.options);
  }

  delUserHiring(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/userrole/DelUserHiring?` + queryParams, this.options);
  }

  setUserHiringInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/userrole/SetUserHiringInfo`, queryParams , this.options);
  }
  
  setUserHiringSubmit(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/userrole/SetUserHiringSubmit`, queryParams , this.options);
  }

  setUserHiringDraft(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/userrole/SetUserHiringDraft`, queryParams , this.options);
  }

  setUserSalaryDraft(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/userrole/SetUserSalaryDraft`, queryParams , this.options);
  }

  setUserHiringClose(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/userrole/SetUserHiringClose`, queryParams , this.options);
  }

  setUserSalarySubmit(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/userrole/SetUserSalarySubmit`, queryParams , this.options);
  }

  setUserSalaryClose(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/userrole/SetUserSalaryClose`, queryParams , this.options);
  }

  setUserSalaryActivate(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/userrole/SetUserSalaryActivate`, queryParams , this.options);
  }

  setUserSalaryVerify(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v2/userrole/SetUserSalaryVerify`, queryParams , this.options);
  }
 
  setUserSalaryInfo(queryParams): Observable<any> {
    return this.http.post<any>(`${apiHrmServer}/api/v2/userrole/SetUserSalaryInfo`, queryParams , this.options);
  }
  
  getUserSalaryPage(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/userrole/GetUserSalaryPage?` + queryParams, this.options);
  }

  getUserSalary(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/userrole/GetUserSalary?` + queryParams, this.options);
  }

  getUserSalaryInfo(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v2/userrole/GetUserSalaryInfo?` + queryParams, this.options);
  }

  delUserSalary(queryParams): Observable<any> {
    return this.http.delete<any>(`${apiHrmServer}/api/v2/userrole/DelUserSalary?` + queryParams, this.options);
  }
  //Customer
  getCustFields(queryParams): Observable<any> {
    return this.http.get<any>(`${apiHrmServer}/api/v1/customer/GetCustFields?` + queryParams, this.options);
  }

  setCustFromCanId(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/customer/SetCustFromCanId` , queryParams, this.options);
  }

  setCustFields(queryParams): Observable<any> {
    return this.http.put<any>(`${apiHrmServer}/api/v1/customer/SetCustFields` , queryParams, this.options);
  }


}
