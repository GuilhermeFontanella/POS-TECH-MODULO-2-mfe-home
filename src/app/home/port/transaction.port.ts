import { Observable } from "rxjs";
import { Transaction } from "src/utils/model/extrato-transaction";

export interface TransactionPort {
    getTransactions(): Observable<Transaction[]>;
}