export interface Categoria {
  id: number;
  description: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
}

export interface Transaction {
  id: number;
  month: string;
  categoria: Categoria[];
}