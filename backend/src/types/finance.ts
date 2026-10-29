import type { TransactionType } from "../domain/finance";
import type { PaymentMethod } from "./order";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export type TransactionInput = Omit<Transaction, "id">;

export interface LedgerEntry extends Transaction {
  source: "ORDERS" | "MANUAL";
  orders?: number;
}

export interface FinanceSummary {
  revenue: number;
  onlineSales: number;
  otherIncome: number;
  expenses: number;
  losses: number;
  profit: number;
  margin: number;
  orders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageTicket: number;
}

export interface FinanceReport {
  month: string;
  isPartial: boolean;
  summary: FinanceSummary;
  previous: FinanceSummary;
  daily: Array<{ date: string; day: number; revenue: number | null; orders: number | null }>;
  monthly: Array<{ month: string; income: number; expenses: number; losses: number; profit: number }>;
  expensesByCategory: Array<{ category: string; amount: number }>;
  lossesByCategory: Array<{ category: string; amount: number }>;
  paymentMethods: Array<{ method: PaymentMethod; amount: number; orders: number }>;
  topDishes: Array<{ name: string; quantity: number; revenue: number }>;
  hours: Array<{ hour: string; orders: number }>;
}
