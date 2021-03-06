import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

// 请求类型
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // 基础接口url
  baseUrl: string = 'http://119.23.227.173:9090';

  constructor(private http: HttpClient) { }

  /**
  * GET请求处理（一般用于获取数据）
  * @param url 后台接口api
  */
  public get(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${url}`, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  /**
   * POST请求处理（一般用于保存数据）
   * @param url 后台接口api
   * @param data 参数
   */
  public post(url: string, data = {}): Observable<any> {
    return this.http.post(`${this.baseUrl}${url}`, data, httpOptions)
    // .pipe(
      // map(this.extractData),
      // catchError(this.handleError)
    // );
  }

  /**
   * PUT请求处理（一般用于更新数据）
   * @param url 后台接口api 例如：/api/test/6
   * @param data 参数
   */
  public put(url: string, data = {}): Observable<any> {
    return this.http.put(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  /**
   * DELETE请求处理（一般用于删除数据）
   * @param url 后台接口api 例如：/api/test/6
   */
  public delete(url: string): Observable<{}> {
    return this.http.delete(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  /**
   *  提取数据
   * @param res 返回结果
   */
  private extractData(res: Response) {
    let body = res;
    console.error(res,'---extractData')
    return body || {};
  }

  /**
   * 错误消息类
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    console.log(JSON.stringify(error),'---error')
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

}
