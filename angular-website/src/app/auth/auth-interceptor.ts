import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/*create our interceptor that will catch all outgoing HTTP request
  then modify and attach headers (authentication) if available and such
  This functionality is provided by Angulars Http classes*/
@Injectable() //still need empty injectable to use this service in this new manner
export class AuthInterceptor implements HttpInterceptor {

  //constructor - inject auth service for token
  constructor(private authService: AuthService) {}

  //HttpInterceptor forces this function (contract by implementing) because angular will call this leaving the app
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //get token, then add to req to hold the token
    const authToken = this.authService.getToken();

    //clone req because directetly modifying would cause side effects persay
    const authReqest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });

    //contiue request
    return next.handle(authReqest);
  }
}
