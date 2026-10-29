import type { ChartConfig } from "@/components/ui/chart";

export const FINANCE_CHART_CONFIG = {
  income: { label: "Entradas", color: "var(--chart-income)" },
  expenses: { label: "Saídas", color: "var(--chart-expense)" },
  losses: { label: "Perdas", color: "var(--chart-loss)" },
  profit: { label: "Lucro" },
} satisfies ChartConfig;

export const AXIS_PROPS = {
  axisLine: false,
  tickLine: false,
  tickMargin: 8,
} as const;
export const GRID_PROPS = { vertical: false, stroke: "var(--border)" } as const;
export const COLUMN_RADIUS: [number, number, number, number] = [4, 4, 0, 0];
export const BAR_RADIUS: [number, number, number, number] = [0, 4, 4, 0];
export const MAX_BAR_SIZE = 24;
export const ACTIVE_DOT = {
  r: 4,
  strokeWidth: 2,
  stroke: "var(--card)",
} as const;

export function truncateLabel(value: string, max = 16) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
