import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TransactionService } from 'src/services/transactionService.service';
import { Categoria, Transaction } from 'src/utils/model/extrato-transaction';


@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe
  ]
})
export class ExtratoComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  showModal = false;
  showEditModal = false;
  disabled = true;
  editForm: FormGroup;
  private transactionsSubscription!: Subscription;
  editingTransaction: { transactionId: number, categoriaId: number } | null = null;

  constructor(
    private transactionService: TransactionService,
    private fb: FormBuilder) {

    this.editForm = this.fb.group({
      description: ['', Validators.required],
      type: ['', Validators.required],
      amount: [null, Validators.required],
      date: ['', Validators.required],
      month: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
    this.editDescription();
  }

  ngOnDestroy(): void {
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
  }

  loadTransactions(): void {
    this.transactionsSubscription = this.transactionService.transactions$.subscribe(
      data => {
        this.transactions = data;
        console.log('ExtratoComponent initialized', this.transactions);
      },
      error => {
        console.error('Erro ao carregar transações:', error);
      }
    );
  }
  openEditModal(transactionId: number, categoria: Categoria, month: string): void {
    this.editForm.get('description')?.disable();
    this.editingTransaction = { transactionId, categoriaId: categoria.id };
    const testes = this.editForm.patchValue({
      description: categoria.description,
      type: categoria.type,
      amount: categoria.amount,
      date: categoria.date,
      month: month
    });
    this.showEditModal = true;
  }

  editDescription(): void {
    this.editForm.get('type')?.valueChanges.subscribe(value => {
      const descriptionsMap: { [key: string]: string } = {
        income: 'Depósito',
        expense: 'Despesa',
        transfer: 'Transferência'
      };
      this.editForm.patchValue({
        description: descriptionsMap[value] || ''
      });
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingTransaction = null;
  }

  saveEdit(): void {
    this.editForm.get('description')?.enable();
    if (this.editForm.valid && this.editingTransaction) {
      const { transactionId, categoriaId } = this.editingTransaction;
      const transaction = this.getTransactionById(transactionId);
      if (transaction) {
        const categoria = this.getCategoriaById(transaction, categoriaId);
        if (categoria) {
          this.updateCategoriaFromForm(categoria);
          this.updateTransactionMonthFromForm(transaction);
          this.persistTransaction(transactionId, transaction);
        }
      }
      this.closeEditModal();
    }
  }

  public formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  public formatDateBR(dateInput: string | number): string {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR');
  }

  private getTransactionById(transactionId: number): Transaction | undefined {
    return this.transactions.find(t => t.id === transactionId);
  }

  private getCategoriaById(transaction: Transaction, categoriaId: number): Categoria | undefined {
    return transaction.categoria.find(c => c.id === categoriaId);
  }

  private updateCategoriaFromForm(categoria: Categoria): void {
    categoria.description = this.editForm.value.description;
    categoria.type = this.editForm.value.type;
    categoria.amount = this.editForm.value.type === 'income'
      ? Math.abs(this.editForm.value.amount)
      : -Math.abs(this.editForm.value.amount);
    categoria.date = this.editForm.value.date;
  }

  private updateTransactionMonthFromForm(transaction: Transaction): void {
    transaction.month = this.editForm.value.month;
  }

  private persistTransaction(transactionId: number, transaction: Transaction): void {
    this.transactionService.updateTransaction(transactionId, transaction).subscribe({
      next: () => {
        this.loadTransactions();
        this.transactionService.getAccountFunds();
      },
      error: (err) => console.error('Erro ao atualizar:', err)
    });
  }
  deleteCategoria(transactionId: number, categoriaId: number): void {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (transaction) {
      transaction.categoria = transaction.categoria.filter(c => c.id !== categoriaId);
      this.transactionService.updateTransaction(transactionId, transaction).subscribe(() => {
        this.transactionService.getAccountFunds();
        this.loadTransactions();
        this.transactionService.getAccountFunds();
      });
    }
  }
}
