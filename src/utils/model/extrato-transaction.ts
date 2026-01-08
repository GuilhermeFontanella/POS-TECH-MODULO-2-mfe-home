export interface Transaction {
  id: number;
  description: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  month: string;
}