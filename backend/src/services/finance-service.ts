import { ONLINE_SALES_CATEGORY, TRANSACTION_CATEGORIES } from "../domain/finance";
import { roundMoney as round } from "../domain/money";
import { daysInMonth, isValidDateKey, isValidMonth, shiftMonth, toDateKey } from "../domain/month";
import { AppError, NotFoundError } from "../errors/app-error";
import { listOrdersBetween } from "../repositories/order-repository";
import * as transactions from "../repositories/transaction-repository";
import type { FinanceReport, FinanceSummary, LedgerEntry, Transaction, TransactionInput } from "../types/finance";
import type { Order, PaymentMethod } from "../types/order";
import { createId } from "../utils/id";

const MONTHS_IN_TREND = 6;
const TOP_DISHES = 6;
const MAX_AMOUNT = 1_000_000;

const orderDateKey = (order: Order) => toDateKey(new Date(order.createdAt));

function assertMonth(month: string) {
  if (!isValidMonth(month)) throw new AppError("Mês inválido.");
}

function monthStartIso(month: string) {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Date(year, monthIndex - 1, 1).toISOString();
}

async function loadPeriod(restaurantId: string, firstMonth: string, lastMonth: string) {
  const endMonth = shiftMonth(lastMonth, 1);
  const [orders, entries] = await Promise.all([
    listOrdersBetween(restaurantId, monthStartIso(firstMonth), monthStartIso(endMonth)),
    transactions.listTransactionsBetween(restaurantId, `${firstMonth}-01`, `${endMonth}-01`),
  ]);
  return { orders, entries };
}

function summarize(orders: Order[], entries: Transaction[]): FinanceSummary {
  const completed = orders.filter((order) => order.status === "DELIVERED");
  const cancelledOrders = orders.filter((order) => order.status === "CANCELLED").length;
  const sumOf = (type: Transaction["type"]) =>
    entries.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);

  const onlineSales = completed.reduce((sum, order) => sum + order.total, 0);
  const otherIncome = sumOf("INCOME");
  const expenses = sumOf("EXPENSE");
  const losses = sumOf("LOSS");
  const revenue = onlineSales + otherIncome;
  const profit = revenue - expenses - losses;

  return {
    revenue: round(revenue),
    onlineSales: round(onlineSales),
    otherIncome: round(otherIncome),
    expenses: round(expenses),
    losses: round(losses),
    profit: round(profit),
    margin: revenue ? profit / revenue : 0,
    orders: orders.length,
    completedOrders: completed.length,
    cancelledOrders,
    averageTicket: completed.length ? round(onlineSales / completed.length) : 0,
  };
}

function groupByCategory(entries: Transaction[], type: Transaction["type"]) {
  const totals = new Map<string, number>();
  entries
    .filter((t) => t.type === type)
    .forEach((t) => totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount));
  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount: round(amount) }))
    .sort((a, b) => b.amount - a.amount);
}

export async function getFinanceReport(restaurantId: string, month: string): Promise<FinanceReport> {
  assertMonth(month);

  const firstMonth = shiftMonth(month, -MONTHS_IN_TREND + 1);
  const { orders: allOrders, entries: allEntries } = await loadPeriod(restaurantId, firstMonth, month);
  const ordersIn = (key: string) => allOrders.filter((order) => orderDateKey(order).startsWith(key));
  const entriesIn = (key: string) => allEntries.filter((t) => t.date.startsWith(key));

  const orders = ordersIn(month);
  const entries = entriesIn(month);
  const completed = orders.filter((order) => order.status === "DELIVERED");
  const todayKey = toDateKey(new Date());
  const isPartial = todayKey.startsWith(month);
  const previousMonth = shiftMonth(month, -1);
  const cutoffDay = todayKey.slice(8);
  const withinCutoff = (dateKey: string) => !isPartial || dateKey.slice(8) <= cutoffDay;

  const daily = Array.from({ length: daysInMonth(month) }, (_, index) => {
    const date = `${month}-${String(index + 1).padStart(2, "0")}`;
    if (date > todayKey) return { date, day: index + 1, revenue: null, orders: null };
    const dayOrders = completed.filter((order) => orderDateKey(order) === date);
    return {
      date,
      day: index + 1,
      revenue: round(dayOrders.reduce((sum, order) => sum + order.total, 0)),
      orders: dayOrders.length,
    };
  });

  const monthly = Array.from({ length: MONTHS_IN_TREND }, (_, index) => {
    const key = shiftMonth(month, index - MONTHS_IN_TREND + 1);
    const summary = summarize(ordersIn(key), entriesIn(key));
    return { month: key, income: summary.revenue, expenses: summary.expenses, losses: summary.losses, profit: summary.profit };
  });

  const payments = new Map<PaymentMethod, { amount: number; orders: number }>();
  const dishes = new Map<string, { name: string; quantity: number; revenue: number }>();
  const hours = new Map<number, number>();

  for (const order of completed) {
    const payment = payments.get(order.paymentMethod) ?? { amount: 0, orders: 0 };
    payments.set(order.paymentMethod, { amount: payment.amount + order.total, orders: payment.orders + 1 });

    const hour = new Date(order.createdAt).getHours();
    hours.set(hour, (hours.get(hour) ?? 0) + 1);

    for (const item of order.items) {
      const dish = dishes.get(item.dishId) ?? { name: item.dishName, quantity: 0, revenue: 0 };
      dishes.set(item.dishId, {
        name: dish.name,
        quantity: dish.quantity + item.quantity,
        revenue: dish.revenue + item.unitPrice * item.quantity,
      });
    }
  }

  return {
    month,
    isPartial,
    summary: summarize(orders, entries),
    previous: summarize(
      ordersIn(previousMonth).filter((order) => withinCutoff(orderDateKey(order))),
      entriesIn(previousMonth).filter((t) => withinCutoff(t.date)),
    ),
    daily,
    monthly,
    expensesByCategory: groupByCategory(entries, "EXPENSE"),
    lossesByCategory: groupByCategory(entries, "LOSS"),
    paymentMethods: [...payments.entries()]
      .map(([method, value]) => ({ method, amount: round(value.amount), orders: value.orders }))
      .sort((a, b) => b.amount - a.amount),
    topDishes: [...dishes.values()]
      .map((dish) => ({ ...dish, revenue: round(dish.revenue) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, TOP_DISHES),
    hours: [...hours.entries()]
      .sort(([a], [b]) => ((a + 18) % 24) - ((b + 18) % 24))
      .map(([hour, count]) => ({ hour: `${String(hour).padStart(2, "0")}h`, orders: count })),
  };
}

export async function getLedger(restaurantId: string, month: string): Promise<LedgerEntry[]> {
  assertMonth(month);
  const { orders, entries } = await loadPeriod(restaurantId, month, month);

  const salesByDay = new Map<string, { amount: number; orders: number }>();
  orders
    .filter((order) => order.status === "DELIVERED" && orderDateKey(order).startsWith(month))
    .forEach((order) => {
      const key = orderDateKey(order);
      const day = salesByDay.get(key) ?? { amount: 0, orders: 0 };
      salesByDay.set(key, { amount: day.amount + order.total, orders: day.orders + 1 });
    });

  const sales: LedgerEntry[] = [...salesByDay.entries()].map(([date, day]) => ({
    id: `orders-${date}`,
    type: "INCOME",
    category: ONLINE_SALES_CATEGORY,
    description: "Vendas pelo cardápio digital",
    amount: round(day.amount),
    date,
    source: "ORDERS",
    orders: day.orders,
  }));

  const manual: LedgerEntry[] = entries.map((t) => ({ ...t, source: "MANUAL" }));

  return [...sales, ...manual].sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount);
}

function validateTransaction(input: TransactionInput): TransactionInput {
  if (!TRANSACTION_CATEGORIES[input.type]?.includes(input.category)) throw new AppError("Categoria inválida.");
  const description = input.description.trim();
  if (description.length < 2 || description.length > 80) {
    throw new AppError("A descrição deve ter entre 2 e 80 caracteres.");
  }
  if (input.amount <= 0 || input.amount > MAX_AMOUNT) throw new AppError("Informe um valor válido.");
  if (!isValidDateKey(input.date)) throw new AppError("Data inválida.");
  if (input.date > toDateKey(new Date())) throw new AppError("A data não pode estar no futuro.");
  return { ...input, description, amount: round(input.amount) };
}

export async function createTransaction(restaurantId: string, input: TransactionInput) {
  const saved: Transaction = { ...validateTransaction(input), id: createId() };
  await transactions.insertTransactions(restaurantId, [saved]);
  return saved;
}

export async function updateTransaction(restaurantId: string, id: string, input: TransactionInput) {
  const data = validateTransaction(input);
  if (!(await transactions.findTransaction(restaurantId, id))) throw new NotFoundError("Movimentação não encontrada.");
  const saved: Transaction = { ...data, id };
  await transactions.updateTransaction(restaurantId, saved);
  return saved;
}

export function deleteTransaction(restaurantId: string, id: string) {
  return transactions.deleteTransaction(restaurantId, id);
}
