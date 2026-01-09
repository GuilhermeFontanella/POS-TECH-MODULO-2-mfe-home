import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { UserPort } from "src/app/home/port/user.port";
import { environment } from "src/environments/environment";
import { User } from "src/utils/model/user-interface";

@Injectable({providedIn: 'root'})
export class UserFirebaseService implements UserPort {
    private userSubject = new BehaviorSubject<User | null>(null);
    public user$ = this.userSubject.asObservable();

    private apiUrl = environment.users;

    constructor(private http: HttpClient) {}

    public get currentValue(): User | null {
        return this.userSubject.value;
    }

    getUserInfo(uid: string): Observable<User> {
        return this.http.get<any>(`${this.apiUrl}/${uid}`).pipe(
            map(doc => this.mapDocumentToUser(doc)),
            tap(user => {
                this.userSubject.next(user);
            })
        );
    }

    private mapDocumentToUser(doc: any): User {
        return {
            id: doc.name.split('/').pop(),
            name: doc.fields.name?.stringValue ?? '',
            email: doc.fields.email?.stringValue
        }
    };

    setUser(user: User) {
        this.userSubject.next(user);
    }
}