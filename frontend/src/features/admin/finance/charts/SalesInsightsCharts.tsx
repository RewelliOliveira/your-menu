import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import type { FinanceReport } from "@/types/finance";
import type { PaymentMethod } from "@/types/order";
import { ChartCard } from "../ChartCard";
import {
  AXIS_PROPS,
  COLUMN_RADIUS,
  GRID_PROPS,
  MAX_BAR_SIZE,
} from "../chart-config";
import { HorizontalBarChart } from "./HorizontalBarChart";

const PAYMENT_SHORT_LABEL: Record<PaymentMethod, string> = {
  PIX: "Pix",
  CARD: "Cartão",
  CASH: "Dinheiro",
};

export function TopDishesChart({ report }: { report: FinanceReport }) {
  return (
    <ChartCard
      title="Pratos mais vendidos"
      description="Por faturamento no mês"
      isEmpty={report.topDishes.length === 0}
      table={{
        headers: ["Prato", "Quantidade", "Faturamento"],
        rows: report.topDishes.map((dish) => [
          dish.name,
          dish.quantity,
          formatCurrency(dish.revenue),
        ]),
      }}
    >
      <HorizontalBarChart
        data={report.topDishes}
        categoryKey="name"
        valueKey="revenue"
        config={{
          revenue: { label: "Faturamento", color: "var(--chart-income)" },
        }}
        color="var(--chart-income)"
        labelWidth={160}
        formatValue={formatCurrency}
        formatLabel={formatCompactCurrency}
      />
    </ChartCard>
  );
}

export function PaymentMethodsChart({ report }: { report: FinanceReport }) {
  const total = report.paymentMethods.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const data = report.paymentMethods.map((item) => ({
    method: PAYMENT_SHORT_LABEL[item.method],
    amount: item.amount,
  }));

  return (
    <ChartCard
      title="Formas de pagamento"
      description="Participação no faturamento online"
      isEmpty={data.length === 0}
      table={{
        headers: ["Forma", "Pedidos", "Valor", "Participação"],
        rows: report.paymentMethods.map((item) => [
          PAYMENT_SHORT_LABEL[item.method],
          item.orders,
          formatCurrency(item.amount),
          formatPercent(total ? item.amount / total : 0),
        ]),
      }}
    >
      <HorizontalBarChart
        data={data}
        categoryKey="method"
        valueKey="amount"
        config={{
          amount: { label: "Faturamento", color: "var(--chart-income)" },
        }}
        color="var(--chart-income)"
        labelWidth={72}
        formatValue={formatCurrency}
        formatLabel={(value) => formatPercent(total ? value / total : 0, 0)}
      />
    </ChartCard>
  );
}

export function PeakHoursChart({ report }: { report: FinanceReport }) {
  return (
    <ChartCard
      title="Horários de pico"
      description="Pedidos concluídos por horário"
      isEmpty={report.hours.length === 0}
      table={{
        headers: ["Horário", "Pedidos"],
        rows: report.hours.map((item) => [item.hour, item.orders]),
      }}
    >
      <ChartContainer
        config={{ orders: { label: "Pedidos", color: "var(--chart-income)" } }}
        className="aspect-auto h-56 w-full"
      >
        <BarChart data={report.hours} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="hour" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} width={32} allowDecimals={false} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                valueFormatter={(value) => `${value} pedidos`}
              />
            }
          />
          <Bar
            dataKey="orders"
            fill="var(--color-orders)"
            radius={COLUMN_RADIUS}
            maxBarSize={MAX_BAR_SIZE}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
