import {
  HttpInterceptor,
  HttpRequest,
   HttpHandler,
   HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/*create our interceptor that will catch all outgoing HTTP request
  then modify and attach headers (authentication) if available and such
  This functionality is provided by Angulars Http classes*/
export class ErrorInterceptor implements HttpInterceptor {

  //HttpInterceptor forces this function (contract by implementing) because angular will call this leaving the app
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        alert(error.error.message);
        return throwError(error);
      })
    );
  }
}
