//require CanActivate
import {
  CanActivate,
  UrlTree,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

//which will verify if user can proceed based on login status
//create our auth guard service that will allow angular to call some methods
@Injectable()
export class AuthGuard implements CanActivate {

  //inject the auth service into the guard
  constructor(private authService: AuthService, private router: Router) {}

  //forced method by CanActivate
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    //check if we are logged in or logged out
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      //ask user to login
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
