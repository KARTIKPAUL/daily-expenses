'use client';

import { useState } from 'react';
import type { Transaction } from '@/types';

interface TransactionsListProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
}

export default function TransactionsList({ transactions, onTransactionDeleted }: TransactionsListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      onTransactionDeleted();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete transaction');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-black font-bold">Recent Transactions</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'income'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'expense'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No transactions found.</p>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                <div className="flex gap-3 mt-1 text-sm text-gray-600">
                  <span className="bg-gray-200 px-2 py-0.5 rounded">{transaction.category}</span>
                  <span>{new Date(transaction.date).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(transaction._id)}
                  disabled={deleting === transaction._id}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  {deleting === transaction._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
