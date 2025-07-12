import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService extends CrudService {
  url = environment.apiUrl;

  getUserAccountInfo(accountId: number): Observable<any> {
    return this.get(`${this.url}/accountInfo/${accountId}`);
  }
}
