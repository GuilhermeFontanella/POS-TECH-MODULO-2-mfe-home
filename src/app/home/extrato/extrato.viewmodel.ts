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
    filters = {
        date: '',
        type: null,
        amount: '',
        month: '',
        description: ''
    }

    private editingTransactionId: number | null = null;

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

        this.editForm.get('type')?.valueChanges.subscribe(value => {
            const descriptionsMap: Record<string, string> = {
                income: 'Depósito',
                expense: 'Despesas',
                transfer: 'Transferência'
            };
            this.editForm.patchValue({
                description: descriptionsMap[value] || '',
                type: this.filters.type,
                ammount: this.filters.amount,
                date: this.filters.date,
                month: this.filters.month
            }, { emitEvent: false });
        })
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

        this.transactionService.getTransactions().subscribe();
    }

    applyFilters(date?: string, type?: string) {
        const all = this.transactionService.transactions$.getValue();
        const filtered = all.filter(t => {
            const matchType = !this.filters.type || t.type === this.filters.type
            return matchType;
        });
        this.filteredTransactions$.next(filtered);
    }

    clearFilters() {
        this.filters.type = null;
        this.filteredTransactions$.next(this.transactionService.transactions$.getValue());
    }

    openEditModal(transactionId: number) {
        const transaction = this.transactionService.transactions$.getValue().find(t => t.id === transactionId);
        if (!transaction) return;

        this.editingTransactionId = transactionId;
        this.editForm.patchValue({
            description: transaction.description,
            type: transaction.type,
            amount: transaction.type === 'income'
                ? transaction.amount
                : -transaction.amount,
            date: transaction.date,
            month: transaction.month
        });
    }

    closeEditModal() {
        this.editForm.reset();
        this.editingTransactionId = null;
    }

    saveEdit() {
        if (this.editForm.invalid || !this.editingTransactionId) return;

        const updateData = {
            ...this.editForm.value,
            amount: this.editForm.value.type === 'income'
                ? Math.abs(this.editForm.value.amount)
                : -Math.abs(this.editForm.value.amount)
        }

        this.transactionService.updateTransaction(this.editingTransactionId, updateData).subscribe();
        this.closeEditModal();
    }

  deleteCategoria(transactionId: number) {
    const transaction = this.transactionService.transactions$.getValue().find(t => t.id === transactionId);
    if (!transaction) return;

    this.transactionService.updateTransaction(transactionId, transaction);
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