import { TransactionPort } from 'src/app/home/port/transaction.port';
import { inject, Injectable, signal } from "@angular/core";
import { Transaction } from 'src/utils/model/extrato-transaction';

@Injectable()
export class NewTransactionViewModel {
    public formattedValue = signal<string>('');
    public numericValue = signal<number>(0);
    public selectedOption = signal<any>(null);
    private transactionService = inject(TransactionPort);

    onValueChange(inputValue: string) {
        const value = inputValue.replace(/\D/g, '');
        const numeric = parseInt(value) || 0;
        this.numericValue.set(numeric / 100);
        this.formattedValue.set(this.formatCurrency(numeric));
    }

    private formatCurrency(value: number): string {
        if (!value) return '';

        return (value / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    saveTransaction() {
        const now = new Date();
        const month = new Intl.DateTimeFormat('pt-BR', {
            month: 'long'
        }).format(now);

        const newCategory: Transaction = {
            id: now.getMilliseconds().toString(),
            description: this.selectedOption()?.label,
            date: now.toString(),
            type: this.selectedOption()?.value,
            amount: this.selectedOption()?.value === 'income'
                ? Math.abs(this.numericValue())
                : -Math.abs(this.numericValue()),
            month: month
        };

        this.transactionService.registerNewTransaction(newCategory).subscribe({
            next: () => this.reset()
        });
    }

    private reset() {
        this.formattedValue.set('');
        this.numericValue.set(0);
        this.selectedOption.set(null);
    }


}