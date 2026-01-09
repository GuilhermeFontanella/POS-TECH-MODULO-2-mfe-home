import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, Observable, switchMap, take, tap } from "rxjs";
import { TransactionPort } from "src/app/home/port/transaction.port";
import { environment } from "src/environments/environment";
import { formatToFirestore } from "src/utils/functions/format-to-firebase-store";
import { Transaction } from "src/utils/model/extrato-transaction";
import { UserFirebaseService } from "./user-firebase.service";
import { BalanceFirebaseService } from "./balance-firebase.service";

@Injectable({providedIn: 'root'})
export class TransactionsFirebaseService implements TransactionPort {
    public transactions$ = new BehaviorSubject<Transaction[]>([]);
    private userService = inject(UserFirebaseService);
    private balanceService = inject(BalanceFirebaseService);

    constructor(private http: HttpClient) {}

    getTransactions(): Observable<Transaction[]> {
        return this.userService.user$.pipe(
            filter(user => !!user?.id),
            take(1),
            switchMap(user => {
                const url = `${environment.baseUrl}:runQuery`;
                const body = {
                    structuredQuery: {
                        from: [{collectionId: 'transactions'}],
                        where: {
                            compositeFilter: {
                                op: 'AND',
                                filters: [
                                    {
                                        fieldFilter: {
                                            field: { fieldPath: 'userId' },
                                            op: 'EQUAL',
                                            value: { stringValue: user!.id }
                                        }
                                    },
                                    {
                                        fieldFilter: {
                                            field: { fieldPath: 'status' },
                                            op: 'EQUAL',
                                            value: { stringValue: 'ativo' }
                                        }
                                    },
                                ]
                            }
                            
                        }
                    }
                };
                return this.http.post<any>(url, body).pipe(
                    map(res => res.filter((item: any) => item.document).map((item: any) => item.document)),
                    map(docs => docs.map((doc: any) => this.mapDocumentToTransaction(doc))),
                    tap(transactions => {
                        const rawBalance = transactions.reduce((acc: number, t: any) => {
                            const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
                            return acc + (amount || 0);
                        }, 0);
                        const totalBalance = Number(rawBalance.toFixed(2));
                        this.balanceService.updateBalance(user!.id, totalBalance).subscribe();
                    })
                );
            }),
            tap(data => this.transactions$.next(data))
        );
    }

    updateTransaction(data: any): Observable<any> {
        const firebaseBody = formatToFirestore(data);
        return this.http.patch<any>(`${environment.transactions}/${data.id}`, firebaseBody).pipe(
            switchMap(() => this.getTransactions())
        );
    }

    registerNewTransaction(data: any): Observable<any> {
        const firebaseBody = formatToFirestore(data);
        return this.http.post<any>(environment.transactions, firebaseBody).pipe(
            switchMap(() => this.getTransactions())
        );
    }

    private mapDocumentToTransaction(doc: any) {
        const docName: string = doc.name;
        if (!docName) return;

        const docId = docName.split('/').pop();
        return {
            id: docId,
            description: doc.fields?.description.stringValue,
            amount: doc.fields?.amount.integerValue || doc.fields?.amount.doubleValue,
            month: doc.fields?.month.stringValue,
            date: doc.fields?.date.stringValue,
            type: doc.fields?.type.stringValue,
            status: doc.fields?.status.stringValue
        };
    }
}