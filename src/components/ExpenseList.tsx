import { format } from 'date-fns';
import { Expense } from '../types/expense';

interface ExpenseListProps {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(expense.date), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  expense.transactionType === 'receive' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {expense.transactionType === 'receive' ? 'Received' : 'Sent'}
                </span>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                expense.transactionType === 'receive' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                ₹{expense.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {expense.paymentMode}
                {expense.onlinePaymentMethod && ` - ${expense.onlinePaymentMethod}`}
                {expense.upiProvider && ` (${expense.upiProvider})`}
                {expense.cardType && ` (${expense.cardType})`}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{expense.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}