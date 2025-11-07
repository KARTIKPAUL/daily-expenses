'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import AddTransactionForm from '@/components/AddTransactionForm';
import TransactionsList from '@/components/TransactionsList';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import type { Transaction, Summary } from '@/types';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const calculateSummary = (): Summary => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <SummaryCards summary={calculateSummary()} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AddTransactionForm onTransactionAdded={fetchTransactions} />
          <CategoryBreakdown transactions={transactions} />
        </div>
        
        <TransactionsList
          transactions={transactions}
          onTransactionDeleted={fetchTransactions}
        />
      </main>
    </div>
  );
}
