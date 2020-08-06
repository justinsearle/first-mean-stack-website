import {
  HttpInterceptor,
  HttpRequest,
   HttpHandler,
   HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

/*create our interceptor that will catch all outgoing HTTP request
  then modify and attach headers (authentication) if available and such
  This functionality is provided by Angulars Http classes*/
  @Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  //HttpInterceptor forces this function (contract by implementing) because angular will call this leaving the app
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        //get our error
        let errorMessage = "An unknown error occured!"
        if (error.error.message) {
          errorMessage = error.error.message
        }

        //console.log("ERROR:");
        //alert(error.error.message);

        //use our dialog service
        this.dialog.open(ErrorComponent, {
          data: {message: errorMessage}
        });
        return throwError(error);
      })
    );
  }
}
