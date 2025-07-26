import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { TransactionService } from 'src/services/transactionService.service';
import { Categoria, Transaction } from 'src/utils/model/extrato-transaction';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


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
    TitleCasePipe,
    InfiniteScrollModule
  ]
})
export class ExtratoComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  filteredTransactions: any[] = [];
  allItems: any[] = [];
  pagedItems: any[] = [];
  items: string[] = [];
  showModal = false;
  showEditModal = false;
  disabled = true;
  mensagemErro = '';
  editForm!: FormGroup;
  editingTransaction: { transactionId: number, categoriaId: number } | null = null;

  private transactionsSubscription!: Subscription;
  private searchSubject = new Subject<string>();

  filters = {
    date: '',
    type: '',
    minAmount: null,
    maxAmount: null,
    description: ''
  };




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
    this.items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
    this.filteredTransactions = [...this.transactions];

    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm) => {
      this.filters.description = searchTerm;
      this.applyFilters();
    });
    this.editForm = this.fb.group({
      description: [''],
      type: [''],
      amount: [''],
      date: [''],
      month: ['']
    });
  }

  ngOnDestroy(): void {
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  trackByCategoriaId(index: number, item: Categoria) {
    return item.id;
  }

  applyFilters() {
    const { date, type, minAmount, maxAmount, description } = this.filters;

    this.filteredTransactions = this.transactions
      .map(t => {
        const filteredCategoria = t.categoria.filter((item: any) => {
          const matchesDate = date ? item.date === date : true;
          const matchesType = type ? item.type === type : true;
          const matchesMin = minAmount != null ? item.amount >= minAmount : true;
          const matchesMax = maxAmount != null ? item.amount <= maxAmount : true;
          const matchesDesc = description
            ? item.description.toLowerCase().includes(description.toLowerCase())
            : true;
          return matchesDate && matchesType && matchesMin && matchesMax && matchesDesc;
        });

        return { ...t, categoria: filteredCategoria };
      })
      .filter(t => t.categoria.length > 0);
  }


  clearFilters() {
    this.filters = {
      date: '',
      type: '',
      minAmount: null,
      maxAmount: null,
      description: ''
    };
    this.filteredTransactions = [...this.transactions];
  }


  loadTransactions(): void {
    this.transactionsSubscription = this.transactionService.transactions$.subscribe({
      next: (data) => {
        this.transactions = data;
        this.mensagemErro = '';
        console.log('ExtratoComponent initialized', this.transactions);
      },
      error: (error) => {
        console.error('Erro ao carregar transações:', error);
        this.mensagemErro = 'Erro ao carregar as transações. Tente novamente mais tarde.';
      },
      complete: () => {
        console.log('Requisição de transações finalizada.');
      }
    });
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
    this.editForm.reset();
    this.editForm.get('description')?.enable();
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
      error: (err) => {
        this.mensagemErro = 'Erro ao salvar alterações.';
        console.error('Erro ao atualizar:', err)
      }

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
