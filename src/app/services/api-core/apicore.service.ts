import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
const apiBaseUrl = environment.apiBase;
const apiCoreBaseUrl = environment.apiCoreBase;
@Injectable()
export class ApiCoreService {
  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  options = {
    headers: new HttpHeaders({
      Authorization: this.authService.getAuthorizationHeaderValue(),
      'Content-Type': 'application/json',
    })
  };

  // Start api Stores
  getManagerList(): Observable<any> {
    return this.http
      .get<any>(`${apiCoreBaseUrl}/api/v1/coresystem/GetManagerList?userRole=-1`, this.options);
  }

  getClientWebInfo(queryParams): Observable<any> {
    return this.http
      .get<any>(`${apiCoreBaseUrl}/api/v1/coresystem/GetClientWebInfo?` + queryParams , this.options);
  }

  deleteCustUser(params): Observable<any> {
    return this.http
      .delete<any>(`${apiCoreBaseUrl}/api/v1/individual/DeleteCustUser?` + params, this.options);
  }

  setCustUser(params): Observable<any> {
    return this.http
      .post<any>(`${apiCoreBaseUrl}/api/v1/individual/SetCustUser`, params, this.options);
  }

  getCustIndiIdentity(queryParams): Observable<any> {
    return this.http.get<any>(`${apiCoreBaseUrl}/api/v1/individual/GetCustIndiIdentity?` + queryParams, this.options)
  }

  setCustIndiIdentityCreate(params): Observable<any>{
    return this.http.post<any>(`${apiCoreBaseUrl}/api/v1/individual/SetCustIndiIdentityCreate`, params, this.options);
  }

}
