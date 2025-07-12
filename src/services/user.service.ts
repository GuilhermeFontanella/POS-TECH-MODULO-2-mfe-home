import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService {
  url = environment.apiUrl
  
  getUser(): Observable<any> {
    return this.get(`${this.url}/users/1`);
  }
}
