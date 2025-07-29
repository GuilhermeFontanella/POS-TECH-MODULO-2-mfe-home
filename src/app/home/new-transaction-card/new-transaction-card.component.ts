import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { TransactionService } from 'src/services/transactionService.service';

interface Transaction {
  id?: number;
  month: string;
  categoria: [
    {
      id: number;
      description: string;
      date: Date;
      type: 'income' | 'expense';
      amount: number;
    }
  ]
}

@Component({
  selector: 'app-new-transaction-card',
  templateUrl: './new-transaction-card.component.html',
  styleUrls: ['./new-transaction-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule
  ]
})
export class NewTransactionCardComponent {
  selectedType: string = '';
  selectedOption: string = '';
  isDropdownOpen: boolean = false;
  value: number = 0;
  formattedValue: string = '';
  isFocused: boolean = false;



  receiptFile: File | null = null;
  receiptPreviewUrl: string | null = null;
  receiptName: string = '';
  isImage: boolean = false;
  isPDF: boolean = false;
  receiptBlobUrl: string | null = null;

  constructor(private transactionService: TransactionService, private fb: FormBuilder) { }

  onValueChange(event: any) {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    const numericValue = parseInt(value) || 0;
    this.value = numericValue / 100;
    this.formattedValue = this.formatCurrency(numericValue);
  }

  onFocus() {
    this.isFocused = true;
    if (this.formattedValue === '' || this.formattedValue === '0,00') {
      this.formattedValue = '';
    }
  }

  onBlur() {
    this.isFocused = false;
    if (this.formattedValue === '') {
      this.formattedValue = '0,00';
    }
  }

  formatCurrency(value: number): string {
    const reais = value / 100;
    return reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  addTransaction(): void {
    if (!this.isTransactionValid()) return;

    const now = new Date();
    const month = this.getCurrentMonth(now);

    this.transactionService.getTransactions().subscribe(transactions => {
      const existingTransaction = transactions.find((t: any) => t.month === month);
      const newCategoria = this.createCategoria(now);

      if (existingTransaction) {
        this.addCategoriaToExistingTransaction(existingTransaction, newCategoria);
      } else {
        this.createNewTransaction(month, newCategoria);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.receiptFile = file;
      this.receiptName = file.name;
      const fileType = file.type;
      const blobUrl = URL.createObjectURL(file);
      this.receiptBlobUrl = blobUrl;
      this.isImage = fileType.startsWith('image/');
      this.isPDF = fileType === 'application/pdf';
      const reader = new FileReader();

      reader.onload = () => {
        this.receiptPreviewUrl = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  abrirRecibo(): void {
    if (this.receiptBlobUrl) {
      window.open(this.receiptBlobUrl, '_blank');
    }
  }

  private isTransactionValid(): boolean {
    return !!this.selectedType && !!this.selectedOption && this.value > 0;
  }

  private getCurrentMonth(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
  }


  private createCategoria(date: Date) {
    return {
      id: Date.now(),
      description: this.selectedOption,
      date: date,
      type: this.selectedType as 'income' | 'expense',
      amount: this.selectedType === 'emprestimo'
        ? Math.abs(this.value)
        : -Math.abs(this.value)
    };
  }

  private addCategoriaToExistingTransaction(transaction: any, categoria: any) {
    transaction.categoria.push(categoria);
    this.transactionService.updateTransaction(transaction.id, transaction).subscribe(() => {
      this.resetForm();
      this.transactionService.getAccountFunds();
    });
  }

  private createNewTransaction(month: string, categoria: any) {
    const transaction = {
      month: month,
      categoria: [categoria]
    };
    this.transactionService.addTransaction(transaction).subscribe(() => {
      this.resetForm();
      this.transactionService.getAccountFunds();
    });
  }

  private resetForm() {
    this.selectedType = "";
    this.selectedOption = "";
    this.value = 0;
    this.formattedValue = '';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(value: string, text: string, event: Event) {
    event.stopPropagation();
    this.selectedType = value;
    this.selectedOption = text;
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const selectWrapper = target.closest('.custom-select-wrapper');

    if (!selectWrapper && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
}
