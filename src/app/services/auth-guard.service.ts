import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable()
export class AuthGuardService {

  constructor(private authService: AuthService, private firebaseAuthService: FirebaseAuthService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | Observable<boolean> | Promise<boolean>> {
    const isLoginFirebase = this.firebaseAuthService.authenticated;
    const isLoginSunshine = await this.authService.isLoggedIn();
    if (!isLoginSunshine) {
      localStorage.setItem('returnUrl', state.url);
      this.authService.startAuthentication();
    }
    return isLoginSunshine;

  }

}
