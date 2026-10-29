import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import { formatDateKey } from "@/lib/month";
import type { FinanceReport } from "@/types/finance";
import { ChartCard } from "../ChartCard";
import { ACTIVE_DOT, AXIS_PROPS, GRID_PROPS } from "../chart-config";
import { SegmentedControl } from "../SegmentedControl";

type Metric = "revenue" | "orders";

const config = {
  revenue: { label: "Faturamento", color: "var(--chart-income)" },
  orders: { label: "Pedidos", color: "var(--chart-income)" },
} satisfies ChartConfig;

export function RevenueTrendChart({ report }: { report: FinanceReport }) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const formatValue = (value: number) =>
    metric === "revenue"
      ? formatCurrency(value)
      : `${value.toLocaleString("pt-BR")} pedidos`;
  const pastDays = report.daily.filter((day) => day.revenue !== null);

  return (
    <ChartCard
      title="Vendas diárias"
      description="Pedidos online concluídos em cada dia do mês"
      isEmpty={pastDays.every((day) => !day.orders)}
      actions={
        <SegmentedControl
          label="Métrica"
          value={metric}
          onChange={setMetric}
          options={[
            { value: "revenue", label: "Faturamento" },
            { value: "orders", label: "Pedidos" },
          ]}
        />
      }
      table={{
        headers: ["Dia", "Faturamento", "Pedidos"],
        rows: pastDays.map((day) => [
          formatDateKey(day.date),
          formatCurrency(day.revenue ?? 0),
          day.orders ?? 0,
        ]),
      }}
    >
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <AreaChart data={report.daily} margin={{ left: 4, right: 8, top: 8 }}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="day" {...AXIS_PROPS} minTickGap={16} />
          <YAxis
            {...AXIS_PROPS}
            width={metric === "revenue" ? 76 : 32}
            allowDecimals={false}
            tickFormatter={(value: number) =>
              metric === "revenue"
                ? formatCompactCurrency(value)
                : String(value)
            }
          />
          <ChartTooltip
            cursor={{ strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) =>
                  formatDateKey(String(payload[0]?.payload?.date ?? ""))
                }
                valueFormatter={formatValue}
              />
            }
          />
          <Area
            key={metric}
            dataKey={metric}
            type="monotone"
            stroke={`var(--color-${metric})`}
            strokeWidth={2}
            fill={`var(--color-${metric})`}
            fillOpacity={0.1}
            activeDot={ACTIVE_DOT}
            connectNulls={false}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
