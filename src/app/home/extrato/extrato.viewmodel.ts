import { Inject, Injectable } from "@angular/core";
import { TRANSACTION } from "../port/transaction.token";
import { TransactionPort } from "../port/transaction.port";
import { BehaviorSubject } from "rxjs";
import { Transaction } from "src/utils/model/extrato-transaction";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class ExtratoViewModel {
    transactions$ = new BehaviorSubject<Transaction[]>([]);
    filteredTransactions$ = new BehaviorSubject<Transaction[]>([]);
    editForm!: FormGroup;
    filters = {
        date: '',
        type: '',
        amount: '',
        month: '',
        description: ''
    }

    private editingTransaction: {
        transactionId: number,
        categoriaId: number
    } | null = null;

    constructor(
        @Inject(TRANSACTION) private transactionService: TransactionPort,
        private fb: FormBuilder
    ) {
        this.editForm = this.fb.group({
            description: ['', Validators.required],
            type: ['', Validators.required],
            amount: [null, Validators.required],
            date: ['', Validators.required],
            month: ['', Validators.required]
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
                this.transactions$.next(data);
                this.filteredTransactions$.next([...data]);
            },
            error: (err) => console.error('Erro ao buscar as transações do usuário', err)
        });
    }

    applyFilters(date?: string, type?: string) {
        const all = this.transactions$.getValue();
        const filterDate = date ? new Date(date).toISOString().slice(0,10) : null;

        const filtered = all.map(t => {
            const categorias = t.categoria.filter(c => {
                const itemDateStr = c.date ? new Date(c.date).toISOString().slice(0,10) : '';
                return (!filterDate || itemDateStr === filterDate) && (!type || c.type === type); 
            });
            return { ...t, categoria: categorias }
        }).filter(t => t.categoria.length > 0);

        this.filteredTransactions$.next(filtered);
    }

    clearFilters() {
        this.filteredTransactions$.next([...this.transactions$.getValue()]);
    }

    openEditModal(transactionId: number, categoriaId: number) {
        const transaction = this.transactions$.getValue().find(t => t.id === transactionId);
        if (!transaction) return;

        const categoria = transaction.categoria.find(c => c.id === categoriaId);
        if (!categoria) return;

        this.editingTransaction = { transactionId, categoriaId };
        this.editForm.patchValue({
            descriptions: categoria.description,
            type: categoria.type,
            ammount: categoria.amount,
            date: categoria.date,
            month: categoria.month
        });
    }

    closeEditModal() {
        this.editForm.reset();
        this.editingTransaction = null;
    }

    saveEdit() {
    if (!this.editForm.valid || !this.editingTransaction) return;

    const { transactionId, categoriaId } = this.editingTransaction;
    const transaction = this.transactions$.getValue().find(t => t.id === transactionId);
    if (!transaction) return;

    const categoria = transaction.categoria.find(c => c.id === categoriaId);
    if (!categoria) return;

    categoria.description = this.editForm.value.description;
    categoria.type = this.editForm.value.type;
    categoria.amount = categoria.type === 'income' 
      ? Math.abs(this.editForm.value.amount)
      : -Math.abs(this.editForm.value.amount);
    categoria.date = this.editForm.value.date;
    transaction.month = this.editForm.value.month;

    this.transactionService.updateTransaction(transactionId, transaction).subscribe(() => {
      this.loadTransactions();
    });

    this.closeEditModal();
  }

  deleteCategoria(transactionId: number, categoriaId: number) {
    const transaction = this.transactions$.getValue().find(t => t.id === transactionId);
    if (!transaction) return;

    transaction.categoria = transaction.categoria.filter(c => c.id !== categoriaId);
    this.transactionService.updateTransaction(transactionId, transaction).subscribe(() => {
      this.loadTransactions();
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