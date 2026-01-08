import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap, tap } from "rxjs";
import { TransactionPort } from "src/app/home/port/transaction.port";
import { environment } from "src/environments/environment";
import { formatToFirestore } from "src/utils/functions/format-to-firebase-store";
import { Transaction } from "src/utils/model/extrato-transaction";

@Injectable({providedIn: 'root'})
export class TransactionsFirebaseService implements TransactionPort {
    public transactions$ = new BehaviorSubject<Transaction[]>([]);

    constructor(private http: HttpClient) {}

    getTransactions(): Observable<Transaction[]> {
        return this.http.get<any>(environment.transactions).pipe(
            map(res => res.documents ?? []),
            map(docs => docs.map(this.mapDocumentToTransaction)),
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