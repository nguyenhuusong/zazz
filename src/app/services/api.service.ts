import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const apiBaseUrl = environment.apiBase;
const apiHrmBase = environment.apiHrmBase;
const apiCoreBaseUrl = 'https://apicore.sunshinegroup.vn';
@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  options = {
    headers: new HttpHeaders({
      Authorization: this.authService.getAuthorizationHeaderValue(),
      'Content-Type': 'application/json',
    })
  };

  getListMenuByUserId(userId, webId): Observable<any> {
    return this.http
      .get<any>(`${apiBaseUrl}/api/v1/user/ClientMenuGetListByUserId?` +
        `userId=${userId}&webId=${webId}`, this.options);
  }

  getCustomerInfoByID(custId): Observable<any> {
    return this.http
      .get<any>(`${apiBaseUrl}/api/v2/customer/GetCustomerInfoByID?` +
        `custId=${custId}`, this.options);
  }

  getUsersByCust(paramsQuery): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiBaseUrl}/api/v1/user/GetUsersByCust?` + paramsQuery, this.options)
  }

  getEmployeeList(paramsQuery): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiBaseUrl}/api/v2/employee/GetEmployeeList?` + paramsQuery, this.options);
        
  }

  getManagerPage(): Observable<any> {
    return this.http
      .get<any>(`${apiCoreBaseUrl}/api/v1/coreuser/GetManagerPage?filter=&offSet=null&pageSize=null`, this.options);
  }

  setCustProfileToSubmit(params): Observable<any> {
    return this.http
      .put<any>(`${apiCoreBaseUrl}/api/v1/customer/SetCustProfileToSubmit`, params, this.options);
  }

  getCustProfileFields(params): Observable<any> {
    return this.http.post<any>(`${apiCoreBaseUrl}/api/v1/customer/GetCustProfileFields`, params, this.options);
  }

  getProfileById(loginName): Observable<any> {
    return this.http.get<any>(`${apiCoreBaseUrl}/api/v1/coreuser/GetProfileById?loginName=${loginName}`, this.options);
  }

  getCustObjectList(fieldObject): Observable<any> {
    return this.http.get<any>(`${apiCoreBaseUrl}/api/v1/customer/GetCustObjectList?fieldObject=${fieldObject}`, this.options);
  }

  setCustProfileFields(params): Observable<any> {
    return this.http.put<any>(`${apiCoreBaseUrl}/api/v1/customer/SetCustProfileFields`, params, this.options);
  }

  setProfileFields(params): Observable<any> {
    return this.http.put<any>(`${apiCoreBaseUrl}/api/v1/coreuser/setProfileFields`, params, this.options);
  }

  setProfileIdcardVerify(params): Observable<any> {
    return this.http.put<any>(`${apiCoreBaseUrl}/api/v1/coreuser/SetProfileIdcardVerify`, params, this.options);
  }

  setMyCustProfile(params): Observable<any> {
    return this.http.put<any>(`${apiCoreBaseUrl}/api/v1/customer/SetMyCustProfile`, params, this.options);
  }

  setCustProfileMeta(params): Observable<any> {
    return this.http.post<any>(`${apiCoreBaseUrl}/api/v1/customer/SetCustProfileMeta`, params, this.options);
  }

  setProfileMeta(params): Observable<any> {
    return this.http.post<any>(`${apiCoreBaseUrl}/api/v1/coreuser/SetProfileMeta`, params, this.options);
  }

  getCustIndividualPage(type, filter, keyType, keyName, custPrivate, offSet, pageSize): Observable<any> {
    console.log('type', keyType);
    console.log('keyName', keyName);
    if (type === 0) {
      const url = 'GetCustIndividualPage'; return this.http
        .get<any>(`${apiCoreBaseUrl}/api/v1/customer/${url}?` +
          `offSet=${offSet}&` +
          `pageSize=${pageSize}&` +
          `filter=${filter}&` +
          `keyType=${keyType}&` +
          `custPrivate=${custPrivate}&` +
          `keyName=${keyName}`, this.options);
    } else {
      const url = 'GetCustCoporatePage'; return this.http
        .get<any>(`${apiCoreBaseUrl}/api/v1/customer/${url}?` +
          `offSet=${offSet}&` +
          `pageSize=${pageSize}&` +
          `filter=${filter}&` +
          `custPrivate=${custPrivate}&` +
          `keyType=${keyType}&` +
          `keyName=${keyName}`, this.options);
    }
  }

  removeCustProfile(custId): Observable<any> {
    return this.http
      .delete<any>(`${apiCoreBaseUrl}/api/v1/customer/RemoveCustProfile?custId=${custId}`, this.options);
  }

  delProfileMeta(metaId): Observable<any> {
    return this.http
      .delete<any>(`${apiCoreBaseUrl}/api/v1/coreuser/DelProfileMeta?metaId=${metaId}`, this.options);
  }

  getCustomerSearch(custPhone, custPassNo): Observable<any> {
    return this.http
      .get<any>(`${apiBaseUrl}/api/v1/shousing/GetCustomerSearch?` +
        `custPhone=${custPhone}&` +
        `custPassNo=${custPassNo}` , this.options);
  }

  setResetPassword(password): Observable<any> {
    return this.http
    .put<any>(`${apiCoreBaseUrl}/api/v1/coresystem/SetResetPassword`, password , this.options);
  }

  getCTThueThuNhapCN(id: string, typeBM: number): Observable<Blob> {
    return this.http.get(`${apiHrmBase}/api/v1/report/GetCTThueThuNhapCN?type=xlsx&id=${id}&typeBM=${typeBM}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  getThuXacNhanThuNhaptype(id: string): Observable<Blob> {
    return this.http.get(`${apiHrmBase}/api/v1/report/GetThuXacNhanThuNhap?type=xlsx&id=${id}`, {
      headers: new HttpHeaders({
        Authorization: this.authService.getAuthorizationHeaderValue(),
      }),
      responseType: "blob"
    });
  }

  getLeaveReasons(): Observable<any> {
    return this.http.get<any>(`${apiHrmBase}/api/v2/leave/GetLeaveReasons` , this.options);
  }
  
}
