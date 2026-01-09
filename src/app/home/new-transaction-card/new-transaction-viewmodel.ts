import { inject, Injectable, signal } from "@angular/core";
import { Transaction } from 'src/utils/model/extrato-transaction';
import { TRANSACTION } from '../port/transaction.token';

@Injectable()
export class NewTransactionViewModel {
    public formattedValue = signal<string>('');
    public numericValue = signal<number>(0);
    public selectedOption = signal<any>(null);
    private transactionService = inject(TRANSACTION);

    onValueChange(inputValue: string) {
        const value = inputValue.replace(/\D/g, '');
        const numeric = parseInt(value) || 0;
        this.numericValue.set(numeric / 100);
        this.formattedValue.set(this.formatCurrency(numeric));
    }

    private getUserId(): string | null {
        const user = sessionStorage.getItem('user');
        if (!user) return null;

        const parsedUser = JSON.parse(user);
        return parsedUser.id;
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

        if (
            !this.getUserId() ||
            !this.selectedOption() ||
            !this.numericValue()
        ) return;

        const newCategory: Transaction = {
            userId: this.getUserId()!,
            id: now.getMilliseconds().toString(),
            description: this.selectedOption()?.label,
            date: now.toString(),
            type: this.selectedOption()?.value,
            amount: this.selectedOption()?.value === 'income'
                ? Math.abs(this.numericValue())
                : -Math.abs(this.numericValue()),
            month: month,
            status: 'ativo'
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