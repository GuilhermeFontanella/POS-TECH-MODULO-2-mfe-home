import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService extends CrudService {
  url = 'https://687b3d79b4bc7cfbda85199e.mockapi.io/api/v1/accountInfo';

  getUserAccountInfo(accountId: number): Observable<any> {
    return this.get(`${this.url}/accountInfo/${accountId}`);
  }
}
