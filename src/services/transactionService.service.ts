import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, reduce, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'https://68787cb963f24f1fdc9e28af.mockapi.io/transactions'
  // 'http://localhost:3000/transactions';
  
  private transactionsSubject = new BehaviorSubject<any[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();
  public totalAmmount = new Subject<number>();

  constructor(private http: HttpClient) {
    this.loadInitialTransactions();
  }

  private loadInitialTransactions(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      data => {
        this.transactionsSubject.next(data);
      },
      error => {
        console.error('Erro ao carregar transações iniciais:', error);
      }
    );
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, transaction).pipe(
      tap((response) => {
        this.loadInitialTransactions();
        console.log('Transaction added successfully:', response);
      })
    );
  }

 updateTransaction(id: number, transaction: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, transaction).pipe(
      tap((response) => {
        this.loadInitialTransactions();
        console.log('Transaction updated successfully:', response);
      })
    );
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap((response) => {
        this.loadInitialTransactions();
        console.log('Transaction deleted successfully:', response);
      })
    );
  }

  getAccountFunds(): void {
    this.getTransactions().pipe(
      map(transactions => {
        return transactions.reduce((sum, transaction) => {
          const categoryTotal = transaction?.categoria.reduce(
            (catSum: any, item: any) => catSum + item?.amount, 0);
          return sum + categoryTotal;
        }, 0);
      })
    ).subscribe({
      next: (total: number) => {
        this.totalAmmount.next(total)
      }
    });
  }
}
