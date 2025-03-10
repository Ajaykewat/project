import { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import MonthlyGoalComponent from './components/MonthlyGoal';
import { Expense, MonthlyGoal } from './types/expense';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyGoal, setMonthlyGoal] = useState<MonthlyGoal>();

  const handleExpenseSubmit = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header className="mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Control Money</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  <Dashboard expenses={expenses} monthlyGoal={monthlyGoal?.amount} />
                  <ExpenseList expenses={expenses} />
                </div>
              </div>
              <div className="space-y-8">
                <ExpenseForm onSubmit={handleExpenseSubmit} />
                <MonthlyGoalComponent currentGoal={monthlyGoal} onSetGoal={setMonthlyGoal} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}