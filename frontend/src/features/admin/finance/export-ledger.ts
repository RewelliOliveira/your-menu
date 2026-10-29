import { downloadCsv } from "@/lib/csv";
import { TRANSACTION_TYPE_LABEL, type LedgerEntry } from "@/types/finance";

export function exportLedger(month: string, entries: LedgerEntry[]) {
  const rows = [
    ["Data", "Tipo", "Categoria", "Descrição", "Valor (R$)"],
    ...[...entries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((entry) => [
        entry.date.split("-").reverse().join("/"),
        TRANSACTION_TYPE_LABEL[entry.type],
        entry.category,
        entry.description,
        (entry.type === "INCOME" ? entry.amount : -entry.amount)
          .toFixed(2)
          .replace(".", ","),
      ]),
  ];
  downloadCsv(`financeiro-${month}.csv`, rows);
}
