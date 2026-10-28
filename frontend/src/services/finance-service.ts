import type { FinanceReport, LedgerEntry, Transaction, TransactionInput } from "@/types/finance";
import { http } from "./http-client";

export function getFinanceReport(month: string) {
  return http.get<FinanceReport>("/finance/report", { month });
}

export function getLedger(month: string) {
  return http.get<LedgerEntry[]>("/finance/ledger", { month });
}

export function saveTransaction({ id, ...input }: TransactionInput & { id?: string }) {
  return id
    ? http.put<Transaction>(`/finance/transactions/${id}`, input)
    : http.post<Transaction>("/finance/transactions", input);
}

export function deleteTransaction(id: string) {
  return http.delete(`/finance/transactions/${id}`);
}
