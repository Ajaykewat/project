import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Expense } from '../types/expense';

interface DashboardProps {
  monthlyGoal?: number;
}

export default function Dashboard({ monthlyGoal }: DashboardProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses from the backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/getexpencess", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const data = await response.json();
        console.log("data",JSON.stringify(data))
        setExpenses(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Process expense data
  const monthlyData = useMemo(() => {
    const data = expenses?.reduce((acc: Record<string, { total: number; received: number; sent: number }>, expense) => {
      const month = format(new Date(expense.createdAt), 'MMM yyyy');
      if (!acc[month]) {
        acc[month] = { total: 0, received: 0, sent: 0 };
      }

      const amount = expense.amount;
      if (expense.transactionType === 'receive') {
        acc[month].received += amount;
        acc[month].total += amount;
      } else {
        acc[month].sent += amount;
        acc[month].total -= amount;
      }

      return acc;
    }, {});

    return Object.entries(data).map(([month, values]) => ({
      month,
      ...values,
    }));
  }, [expenses]);

  const totalBalance = expenses.reduce((acc, expense) => {
    return expense.transactionType === 'receive'
      ? acc + expense.amount
      : acc - expense.amount;
  }, 0);

  const currentMonthTotal =expenses.length > 0 && monthlyData[monthlyData.length - 1]?.total || 0;
  const goalProgress = monthlyGoal ? (currentMonthTotal / monthlyGoal) * 100 : 0;

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Transactions Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="received" fill="#059669" name="Received" />
              <Bar dataKey="sent" fill="#DC2626" name="Sent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Balance</h3>
          <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{totalBalance.toFixed(2)}
          </p>
        </div>

        {monthlyGoal && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Monthly Goal Progress</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {goalProgress.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${Math.min(goalProgress, 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                Current: ₹{currentMonthTotal.toFixed(2)} / Goal: ₹{monthlyGoal.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
