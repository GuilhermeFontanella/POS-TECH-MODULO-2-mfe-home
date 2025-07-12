import { HttpClient, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private httpClient: HttpClient) { }

  get(url: string, params?: HttpParams): Observable<any> {
    return this.httpClient.get<Observable<any>>(url, {params});
  }

  put(url: string, params?: HttpParams): Observable<any> {
    return this.httpClient.put<Observable<any>>(url, {params});
  }

  post(url: string, params?: HttpParams): Observable<any> {
    return this.httpClient.post<Observable<any>>(url, {params});
  }

  delete(url: string): Observable<any> {
    return this.httpClient.delete<Observable<any>>(url);
  }
}
