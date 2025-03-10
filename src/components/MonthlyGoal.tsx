import { useState } from 'react';
import { MonthlyGoal as MonthlyGoalType } from '../types/expense';

interface MonthlyGoalProps {
  currentGoal?: MonthlyGoalType;
  onSetGoal: (goal: MonthlyGoalType) => void;
}

export default function MonthlyGoalComponent({ currentGoal, onSetGoal }: MonthlyGoalProps) {
  const [amount, setAmount] = useState(currentGoal?.amount.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    onSetGoal({
      amount: parseFloat(amount),
      month: now.toLocaleString('default', { month: 'long' }),
      year: now.getFullYear(),
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Savings Goal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Target Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Set Monthly Goal
        </button>
      </form>
      {currentGoal && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <p className="text-green-700">
            Current Goal: ₹{currentGoal.amount.toFixed(2)} for {currentGoal.month} {currentGoal.year}
          </p>
        </div>
      )}
    </div>
  );
}