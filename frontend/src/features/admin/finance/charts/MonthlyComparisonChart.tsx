import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
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

const SERIES = ["income", "expenses", "losses"] as const;

export function MonthlyComparisonChart({ report }: { report: FinanceReport }) {
  return (
    <ChartCard
      title="Entradas, saídas e perdas"
      description="Últimos 6 meses"
      table={{
        headers: ["Mês", "Entradas", "Saídas", "Perdas"],
        rows: report.monthly.map((m) => [
          formatMonth(m.month),
          formatCurrency(m.income),
          formatCurrency(m.expenses),
          formatCurrency(m.losses),
        ]),
      }}
    >
      <ChartContainer
        config={FINANCE_CHART_CONFIG}
        className="aspect-auto h-72 w-full"
      >
        <BarChart
          data={report.monthly}
          margin={{ left: 4, right: 8, top: 8 }}
          barGap={2}
          barCategoryGap="22%"
        >
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
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) => formatMonth(String(label))}
                valueFormatter={(value) => formatCurrency(value)}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {SERIES.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={COLUMN_RADIUS}
              maxBarSize={MAX_BAR_SIZE}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
