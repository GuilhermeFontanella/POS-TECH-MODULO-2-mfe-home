export interface Transaction {
  id: unknown;
  description: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  month: string;
}