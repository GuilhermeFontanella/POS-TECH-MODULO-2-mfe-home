// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { map, Observable } from "rxjs";
// import { TransactionPort } from "src/app/home/port/transaction.port";
// import { environment } from "src/environments/environment";
// import { Transaction } from "src/utils/model/extrato-transaction";

// @Injectable({providedIn: 'root'})
// export class TransactionsFirebaseService implements TransactionPort {
//     private apiUrl = environment.transactions;

//     constructor(private http: HttpClient) {}

//     getTransactions(): Observable<Transaction[]> {
//         return this.http.get<any>(this.apiUrl).pipe(
//             map(res => res.documents ?? []),
//             map(docs => docs.map(this.mapDocumentToTransaction))
//         );
//     }

//     private mapDocumentToTransaction(doc: any) {
//         return {
//             month: doc.fields.month.stringValue,
//             categoria: (doc.fields.category?.arrayValue?.values ?? []).map((cat: any) => ({
//             description: cat.mapValue.fields.description.stringValue,
//             ammount: Number(cat.mapValue.fields.ammount.integerValue)
//             }))
//         };
//     }
// }