import { Observable } from "rxjs";
import { Transaction } from "src/utils/model/extrato-transaction";

export interface TransactionPort {
    getTransactions(): Observable<Transaction[]>;
    updateTransaction(transactionId: number, data: any): Observable<any>;
    registerNewTransaction(data: any): Observable<any>;
}