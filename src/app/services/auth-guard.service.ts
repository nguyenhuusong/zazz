import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService {

  constructor(private authService: AuthService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | Observable<boolean> | Promise<boolean>> {
    const isLoginSunshine = await this.authService.isLoggedIn();
    const token = await this.authService.getAuthorizationHeaderValue();
    console.log("ddddddddddd", token)
    console.log(isLoginSunshine)
    if (!isLoginSunshine) {
      localStorage.setItem('returnUrl', state.url);
      this.authService.startAuthentication();
    }
    return isLoginSunshine;

  }

}
