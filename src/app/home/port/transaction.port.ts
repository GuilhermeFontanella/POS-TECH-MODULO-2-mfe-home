import { BehaviorSubject, Observable } from "rxjs";
import { Transaction } from "src/utils/model/extrato-transaction";

export abstract class TransactionPort {
    abstract transactions$: BehaviorSubject<Transaction[]>;
    abstract getTransactions(): Observable<Transaction[]>;
    abstract updateTransaction(transactionId: number, data: any): Observable<any>;
    abstract registerNewTransaction(data: any): Observable<any>;
}