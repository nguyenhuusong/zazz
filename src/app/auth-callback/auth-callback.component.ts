import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private firebaseAuthService: FirebaseAuthService,
    private router: Router,
    private http: HttpClient) { }

  async ngOnInit() {
    await this.authService.completeAuthentication();
    const token = this.authService.getAccessTokenValue();
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    }
    // if (!this.firebaseAuthService.authenticated) {
    //   const customToken = await this.getCustomToken(token);
    //   if (customToken) {
    //     this.firebaseAuthService.customLogin(customToken);
    //   }
    // }

  }
  getCustomToken(token: string): Promise<string> {
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
