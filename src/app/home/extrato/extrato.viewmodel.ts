import { Inject, Injectable } from "@angular/core";
import { TRANSACTION } from "../port/transaction.token";
import { TransactionPort } from "../port/transaction.port";
import { BehaviorSubject } from "rxjs";
import { Transaction } from "src/utils/model/extrato-transaction";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class ExtratoViewModel {
    filteredTransactions$ = new BehaviorSubject<Transaction[]>([]);
    editForm!: FormGroup;
    filters!: FormGroup;
    transactionId: string | null = '';
    editTransaction = {
        date: '',
        type: null,
        amount: '',
        month: '',
        description: ''
    }

    public editingTransactionId: number | null = null;

    constructor(
        @Inject(TRANSACTION) private transactionService: TransactionPort,
        private fb: FormBuilder
    ) {
        this.editForm = this.fb.group({
            description: [null, Validators.required],
            type: [null, Validators.required],
            amount: [null, Validators.required],
            date: [null, Validators.required],
            month: [null, Validators.required]
        });
        this.filters = this.fb.group({
            date: [null],
            type: [null]
        });
    }

    init() {
        this.loadTransactions();
    }

    private loadTransactions() {
        this.transactionService.getTransactions().subscribe({
            next: (data) => {
                this.filteredTransactions$.next(data);
            },
            error: (err) => console.error('Erro ao buscar as transações do usuário', err)
        });

        //this.transactionService.getTransactions().subscribe();
    }

    applyFilters(date?: string, type?: string) {
        const all = this.transactionService.transactions$.getValue();
        const filtered = all.filter(t => {
            const matchType = !this.filters.value.type || t.type === this.filters.value.type
            return matchType;
        });
        this.filteredTransactions$.next(filtered);
    }

    clearFilters() {
        this.filters.value.type = null;
        this.filteredTransactions$.next(this.transactionService.transactions$.getValue());
    }

    openEditModal(transactionId: any) {
        const transaction = this.transactionService.transactions$.getValue().find(t => t.id === transactionId);
        if (!transaction) return;
        
        this.transactionId = transaction?.id as string;
        this.editingTransactionId = transactionId;
        this.editForm.patchValue({
            description: transaction?.description,
            type: transaction?.type,
            amount: transaction?.type === 'income'
                ? transaction?.amount
                : -transaction?.amount,
            date: transaction?.date,
            month: transaction?.month
        }, { emitEvent: true });
    }

    closeEditModal() {
        this.editForm.reset();
        this.editingTransactionId = null;
    }

    saveEdit() {
        if (this.editForm.invalid || !this.editingTransactionId) return;
        const updateData = {
            ...this.editForm.value,
            id: this.transactionId,
            amount: this.editForm.value.type === 'income'
                ? Math.abs(this.editForm.value.amount)
                : -Math.abs(this.editForm.value.amount)
        }

        this.transactionService.updateTransaction(updateData).subscribe({
            next: () => {
                this.closeEditModal();
                this.loadTransactions();
            }
        });
    }

  deleteCategoria(transactionId: unknown) {
    const transaction = this.transactionService.transactions$.getValue().find(t => t.id === transactionId);
    if (!transaction) return;

    const updateData = {
        ...transaction,
        status: 'inativo'
    }

    this.transactionService.updateTransaction(updateData).subscribe({
        next: () => {
            this.loadTransactions();
        }
    });
  }

  formatCurrencyBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  formatDateBR(dateInput: string | number): string {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR');
  }
}