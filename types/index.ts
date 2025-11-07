export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: Date;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}