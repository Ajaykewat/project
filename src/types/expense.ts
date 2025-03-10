export type PaymentMode = 'online' | 'offline';
export type UPIProvider = 'gpay' | 'phonepe';
export type CardType = 'credit' | 'debit';
export type OnlinePaymentMethod = 'upi' | 'card';
export type TransactionType = 'send' | 'receive';

export interface Expense {
  id: string;
  amount: number;
  date: string;
  paymentMode: PaymentMode;
  onlinePaymentMethod?: OnlinePaymentMethod;
  upiProvider?: UPIProvider;
  cardType?: CardType;
  description: string;
  transactionType: TransactionType;
}

export interface MonthlyGoal {
  amount: number;
  month: string;
  year: number;
}