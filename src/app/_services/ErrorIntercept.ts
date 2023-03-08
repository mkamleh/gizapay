import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { ErrorHandling } from './ErrorHandling';
export class ErrorIntercept implements HttpInterceptor {
    constructor(private errorHandling:ErrorHandling){}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (request.headers.get("x-auth-token") === "null"){
            request = request.clone({ headers: request.headers.delete('x-auth-token','null') })
        }
        if (request.headers.get("Authorization") === "null"){
            request = request.clone({ headers: request.headers.delete('Authorization','null') })
        }
        return next.handle(request).pipe( 
            retry(1),
            catchError((error: HttpErrorResponse) => {
              console.log(error)
              this.errorHandling.handleErrorMsg(error)
              return throwError(error)
            })
          );    
    }
}