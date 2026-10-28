import { db, type DB } from "../database/connection";
import type { TransactionRow } from "../database/schema";
import type { TransactionType } from "../domain/finance";
import { fromCents, toCents } from "../domain/money";
import type { Transaction } from "../types/finance";

const BATCH_SIZE = 200;

const toTransaction = (row: TransactionRow): Transaction => ({
  id: row.id,
  type: row.type as TransactionType,
  category: row.category,
  description: row.description,
  amount: fromCents(row.amount_cents),
  date: row.date,
});

const toRow = (restaurantId: string, transaction: Transaction): TransactionRow => ({
  id: transaction.id,
  restaurant_id: restaurantId,
  type: transaction.type,
  category: transaction.category,
  description: transaction.description,
  amount_cents: toCents(transaction.amount),
  date: transaction.date,
});

export async function listTransactionsBetween(restaurantId: string, startDate: string, endDate: string, executor: DB = db) {
  const rows = await executor
    .selectFrom("transactions")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .where("date", ">=", startDate)
    .where("date", "<", endDate)
    .execute();
  return rows.map(toTransaction);
}

export async function findTransaction(restaurantId: string, id: string, executor: DB = db) {
  const row = await executor
    .selectFrom("transactions")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .where("id", "=", id)
    .executeTakeFirst();
  return row && toTransaction(row);
}

export async function insertTransactions(restaurantId: string, transactions: Transaction[], executor: DB = db) {
  for (let start = 0; start < transactions.length; start += BATCH_SIZE) {
    await executor
      .insertInto("transactions")
      .values(transactions.slice(start, start + BATCH_SIZE).map((transaction) => toRow(restaurantId, transaction)))
      .execute();
  }
}

export async function updateTransaction(restaurantId: string, transaction: Transaction, executor: DB = db) {
  const { id: _, restaurant_id: __, ...changes } = toRow(restaurantId, transaction);
  await executor
    .updateTable("transactions")
    .set(changes)
    .where("restaurant_id", "=", restaurantId)
    .where("id", "=", transaction.id)
    .execute();
}

export async function deleteTransaction(restaurantId: string, id: string, executor: DB = db) {
  await executor.deleteFrom("transactions").where("restaurant_id", "=", restaurantId).where("id", "=", id).execute();
}
