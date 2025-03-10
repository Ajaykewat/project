import { useState } from 'react';
import { PaymentMode, OnlinePaymentMethod, UPIProvider, CardType, TransactionType } from '../types/expense';

interface ExpenseFormProps {
  onSubmit: (expense: {
    amount: number;
    paymentMode: PaymentMode;
    onlinePaymentMethod?: OnlinePaymentMethod;
    upiProvider?: UPIProvider;
    cardType?: CardType;
    description: string;
    transactionType: TransactionType;
  }) => void;
}

export default function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('offline');
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState<OnlinePaymentMethod>('upi');
  const [upiProvider, setUpiProvider] = useState<UPIProvider>('gpay');
  const [cardType, setCardType] = useState<CardType>('debit');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>('send');


  

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const expenseData = {
    amount: parseFloat(amount),
    paymentMode,
    ...(paymentMode === "online" && {
      onlinePaymentMethod,
      ...(onlinePaymentMethod === "upi" ? { upiProvider } : { cardType }),
    }),
    description,
    transactionType,
  };
  console.log("expenseData",JSON.stringify(expenseData))
  if(!expenseData){
    return
  }

  try {
    const response = await fetch("http://localhost:5000/api/users/addexpencess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseData),
    });
console.log("response",JSON.stringify(response))
    if (response.ok) {
      alert("Transaction saved successfully!");
      setAmount("");
      setDescription("");
    } else {
      alert("Failed to save transaction");
    }
  } catch (error) {
    console.error("Error saving transaction:", error);
    alert("Something went wrong");
  }
};



  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value as TransactionType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="send">Send Money</option>
          <option value="receive">Receive Money</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="offline">Offline</option>
          <option value="online">Online</option>
        </select>
      </div>

      {paymentMode === 'online' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            value={onlinePaymentMethod}
            onChange={(e) => setOnlinePaymentMethod(e.target.value as OnlinePaymentMethod)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          {onlinePaymentMethod === 'upi' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">UPI Provider</label>
              <select
                value={upiProvider}
                onChange={(e) => setUpiProvider(e.target.value as UPIProvider)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="gpay">Google Pay</option>
                <option value="phonepe">PhonePe</option>
              </select>
            </div>
          )}

          {onlinePaymentMethod === 'card' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Card Type</label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value as CardType)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="debit">Debit Card</option>
                <option value="credit">Credit Card</option>
              </select>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add Transaction
      </button>
    </form>
  );
}