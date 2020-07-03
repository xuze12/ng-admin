import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { catchError, retry } from 'rxjs/operators';


/**
 * 基础接口url
 */
const baseurl = 'http://119.23.227.173:9090';


@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // let authReq = req.clone({
      // url: `${baseurl}${req.url}`,
    // })
    console.log(req.url,'----req.url')
    let authReq = req.clone({
      url: req.url.replace('/api',baseurl),
    })
    console.log('authReq',authReq)
    const token = window.localStorage.getItem('auth_token')
    if (token) {
      authReq = req.clone({ 
        url: req.url.replace('/api',baseurl),
        headers: req.headers.set('Authorization', `Bearer ${token}`).set('Authorization-Type', 'ID_TOKEN') });
      // authReq.headers.set('Authorization', `Bearer ${token}`).set('Authorization-Type', 'ID_TOKEN')
      // return next.handle(authReq);
    }

    return next.handle(authReq)
    .pipe(
      /*失败时重试2次，可自由设置*/
      // retry(2),
      /*捕获响应错误，可根据需要自行改写，我偷懒了，直接用的官方的*/
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    console.log(error, '----error')
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if(error.status ==403) {
        window.location.href="/login";
        window.localStorage.clear();
      }
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
