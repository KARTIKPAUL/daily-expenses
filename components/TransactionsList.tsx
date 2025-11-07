'use client';

import { useState } from 'react';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

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
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-6">
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

      {/* Mobile Header */}
      <div className="md:hidden mb-4">
        <h2 className="text-lg text-black font-bold mb-3">Recent Transactions</h2>
        <div className="flex gap-2 w-full">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'income'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'expense'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block space-y-3 max-h-[500px] overflow-y-auto">
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

      {/* Mobile View - Card Style */}
      <div className="md:hidden space-y-3 max-h-[500px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No transactions found.</p>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className={`relative p-4 rounded-xl shadow-sm border-l-4 ${
                transaction.type === 'income'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              {/* Amount - Top Right */}
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-2xl font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    transaction.type === 'income'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {transaction.type}
                </span>
              </div>

              {/* Description */}
              <h3 className="font-semibold text-gray-900 mb-2 text-base">
                {transaction.description}
              </h3>

              {/* Category and Date */}
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
                  {transaction.category}
                </span>
                <span className="text-xs">
                  {new Date(transaction.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(transaction._id)}
                disabled={deleting === transaction._id}
                className="w-full py-2 text-sm font-medium bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting === transaction._id ? 'Deleting...' : 'Delete Transaction'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}