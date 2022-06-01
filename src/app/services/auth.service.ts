import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FirebaseAuthService } from './firebase-auth.service';
import { map } from 'rxjs';

@Injectable()
export class AuthService {
  private manager: UserManager = new UserManager(environment.authenSettings);
  private user: User = null;

  constructor(private http: HttpClient,
    private firebaseAuthService: FirebaseAuthService,
    ) {
      this.getEmpDetail()
      }

  isLoggedIn(): Promise<boolean> {
    localStorage.removeItem('menuItems');
    if (this.user != null) {
      return new Promise((resolve, reject) => resolve(!this.user.expired));
    }

    return this.manager.getUser().then(user => {
      this.user = user;
      return user != null && !user.expired;
    });
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  getAccessTokenValue(): string {
    return this.user.access_token;
  }

  getUserName(): string {
    return this.user.profile.name;
  }

  isExpired(): boolean {
    return this.user.expired
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  signout(): Promise<void> {
    localStorage.removeItem('menuItems');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('storeId');
    return this.manager.signoutRedirect();
  }

  completeAuthentication(): Promise<void> {
    localStorage.setItem('projectCd', '01');
    return this.manager.signinRedirectCallback()
      .then(user => { this.user = user; })
      .then(_ => this.getEmpDetail());
  }

  getUserImage(): string {
    return localStorage.getItem('avatarUrl');
  }

 async getEmpDetail() {
    if (localStorage.getItem("employeeId") === null) {
      const headers = new HttpHeaders({ Authorization: this.getAuthorizationHeaderValue() });
      return this.http.get(environment.apiBase + '/api/v2/employee/GetEmployee?employeeId=', { headers }).toPromise()
        .then((emp: any) => {
          if (emp && emp.data) {
            localStorage.setItem('avatarUrl', emp.data.avatarUrl);
            localStorage.setItem('employeeId', emp.data.employeeId);
          }
        });
    }
    const token = this.getAccessTokenValue();
    console.log(this.firebaseAuthService.authenticated)
    if (!this.firebaseAuthService.authenticated) {
      const customToken = await this.getCustomToken(token);
      if (customToken) {
        this.firebaseAuthService.customLogin(customToken);
      }
    }
  }

  getWorkingProject() {
    return localStorage.getItem('projectCd');
  }

  getCustomToken(token: string): Promise<any> {
    const url = `${environment.cloudFunctionServer}/getCustomToken`;
    return this.http.post(url, {
      data: {
        access_token: token
      }
    }).pipe(
      map((response: any) => response.result)
    ).toPromise();

  }
 
}


export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'https://api.sunshinegroup.vn:5000',
    client_id: 'web_s_service_dev',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200',
    response_type: 'id_token token',
    scope: 'openid profile api_sre',
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
  };
}
