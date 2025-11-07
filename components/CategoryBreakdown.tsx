import type { Transaction } from '@/types';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export default function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  
  if (expenseTransactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl text-black font-bold mb-4">Category Breakdown</h2>
        <p className="text-center text-gray-500 py-8">Add expenses to see breakdown</p>
      </div>
    );
  }

  const categoryTotals: Record<string, number> = {};
  expenseTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl text-black font-bold mb-4">Category Breakdown</h2>
      <div className="space-y-4">
        {sortedCategories.map(([category, amount]) => {
          const percentage = (amount / totalExpenses) * 100;
          return (
            <div key={category}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="font-semibold text-gray-900">₹{amount.toFixed(2)}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {percentage.toFixed(1)}% of total expenses
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
