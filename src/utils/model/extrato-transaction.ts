export interface Transaction {
  userId: string;
  id: unknown;
  description: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  month: string;
  status: string;
}