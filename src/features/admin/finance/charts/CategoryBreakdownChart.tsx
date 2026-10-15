import { useState } from "react";

import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from "@/lib/format";
import type { FinanceReport } from "@/types/finance";
import { ChartCard } from "../ChartCard";
import { SegmentedControl } from "../SegmentedControl";
import { HorizontalBarChart } from "./HorizontalBarChart";

type Kind = "expenses" | "losses";

const KIND = {
  expenses: { label: "Saídas", color: "var(--chart-expense)" },
  losses: { label: "Perdas", color: "var(--chart-loss)" },
};

export function CategoryBreakdownChart({ report }: { report: FinanceReport }) {
  const [kind, setKind] = useState<Kind>("expenses");
  const data =
    kind === "expenses" ? report.expensesByCategory : report.lossesByCategory;
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ChartCard
      title="Para onde foi o dinheiro"
      description="Total por categoria no mês"
      isEmpty={data.length === 0}
      actions={
        <SegmentedControl
          label="Tipo"
          value={kind}
          onChange={setKind}
          options={[
            { value: "expenses", label: "Saídas" },
            { value: "losses", label: "Perdas" },
          ]}
        />
      }
      table={{
        headers: ["Categoria", "Valor", "Participação"],
        rows: data.map((item) => [
          item.category,
          formatCurrency(item.amount),
          formatPercent(total ? item.amount / total : 0),
        ]),
      }}
    >
      <HorizontalBarChart
        key={kind}
        data={data}
        categoryKey="category"
        valueKey="amount"
        config={{ amount: KIND[kind] }}
        color={KIND[kind].color}
        formatValue={formatCurrency}
        formatLabel={formatCompactCurrency}
      />
    </ChartCard>
  );
}
