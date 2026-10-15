import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from "@/lib/format";
import { formatMonth, formatMonthShort } from "@/lib/month";
import type { FinanceReport } from "@/types/finance";
import { ChartCard } from "../ChartCard";
import {
  AXIS_PROPS,
  COLUMN_RADIUS,
  FINANCE_CHART_CONFIG,
  GRID_PROPS,
  MAX_BAR_SIZE,
} from "../chart-config";

export function ProfitTrendChart({ report }: { report: FinanceReport }) {
  const data = report.monthly.map((m) => ({
    ...m,
    fill: m.profit >= 0 ? "var(--chart-income)" : "var(--chart-negative)",
  }));

  return (
    <ChartCard
      title="Lucro mensal"
      description="Azul para lucro, vermelho para prejuízo"
      table={{
        headers: ["Mês", "Lucro", "Margem"],
        rows: report.monthly.map((m) => [
          formatMonth(m.month),
          formatCurrency(m.profit),
          formatPercent(m.income ? m.profit / m.income : 0),
        ]),
      }}
    >
      <ChartContainer
        config={FINANCE_CHART_CONFIG}
        className="aspect-auto h-72 w-full"
      >
        <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            dataKey="month"
            {...AXIS_PROPS}
            tickFormatter={formatMonthShort}
          />
          <YAxis
            {...AXIS_PROPS}
            width={76}
            tickFormatter={(value: number) => formatCompactCurrency(value)}
          />
          <ReferenceLine
            y={0}
            stroke="var(--muted-foreground)"
            strokeOpacity={0.4}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) => formatMonth(String(label))}
                valueFormatter={(value) => formatCurrency(value)}
              />
            }
          />
          <Bar
            dataKey="profit"
            radius={COLUMN_RADIUS}
            maxBarSize={MAX_BAR_SIZE}
          >
            {data.map((entry) => (
              <Cell
                key={entry.month}
                fill={entry.fill}
                fillOpacity={entry.month === report.month ? 1 : 0.55}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
