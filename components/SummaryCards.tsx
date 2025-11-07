import type { Summary } from '@/types';

interface SummaryCardsProps {
  summary: Summary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-600 uppercase mb-2">Total Income</h3>
        <p className="text-3xl font-bold text-green-600">
          ₹{summary.totalIncome.toFixed(2)}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h3 className="text-sm font-medium text-gray-600 uppercase mb-2">Total Expenses</h3>
        <p className="text-3xl font-bold text-red-600">
          ₹{summary.totalExpenses.toFixed(2)}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-600 uppercase mb-2">Balance</h3>
        <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          ₹{summary.balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}