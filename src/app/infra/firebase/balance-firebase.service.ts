import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class BalanceFirebaseService {
    private http = inject(HttpClient);
    public balance$ = new BehaviorSubject<number>(0);
    
    getBalance(userId: string): Observable<number> {
        return this.http.get<any>(`${environment.baseUrl}/balances/${userId}`).pipe(
            map(doc => doc.fields?.balance?.doubleValue || doc.fields?.balance?.integerValue || 0),
            tap(value => this.balance$.next(value)),
            catchError(() => of(0))
        );
    }

    updateBalance(userId: string, newBalance: number): Observable<any> {
        const body = {
            fields: {
                userId: { stringValue: userId },
                balance: { doubleValue: newBalance }
            }
        };
        return this.http.patch(`${environment.baseUrl}/balances/${userId}`, body)
            .pipe(
                switchMap(() => this.getBalance(userId))
            );
    }
}