import * as React from "react";
import * as RechartsPrimitive from "recharts";
import type { LegendPayload, TooltipPayloadEntry } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  { label: React.ReactNode; color?: string }
>;

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context)
    throw new Error("useChart deve ser usado dentro de <ChartContainer>.");
  return context;
}

interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}

function ChartContainer({
  config,
  className,
  children,
  style,
  ...props
}: ChartContainerProps) {
  const colorVars = Object.fromEntries(
    Object.entries(config)
      .filter(([, item]) => item.color)
      .map(([key, item]) => [`--color-${key}`, item.color]),
  );

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        style={{ ...colorVars, ...style }}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/70",
          "[&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: readonly TooltipPayloadEntry[];
  label?: React.ReactNode;
  hideLabel?: boolean;
  labelFormatter?: (
    label: React.ReactNode,
    payload: readonly TooltipPayloadEntry[],
  ) => React.ReactNode;
  valueFormatter?: (value: number, key: string) => React.ReactNode;
  className?: string;
}

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  labelFormatter,
  valueFormatter = (value) => value.toLocaleString("pt-BR"),
  className,
}: ChartTooltipContentProps) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "grid min-w-40 gap-1.5 rounded-xl border bg-popover px-3 py-2.5 text-xs shadow-lg",
        className,
      )}
    >
      {!hideLabel && (
        <p className="font-semibold">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </p>
      )}
      <div className="grid gap-1">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name);
          const color =
            (item.payload as { fill?: string } | undefined)?.fill ?? item.color;
          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: color }}
              />
              <span className="flex-1 text-muted-foreground">
                {config[key]?.label ?? item.name}
              </span>
              <span className="font-semibold text-foreground tabular-nums">
                {typeof item.value === "number"
                  ? valueFormatter(item.value, key)
                  : item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  payload,
  className,
}: {
  payload?: readonly LegendPayload[];
  className?: string;
}) {
  const { config } = useChart();
  if (!payload?.length) return null;

  const order = Object.keys(config);
  const items = [...payload].sort(
    (a, b) =>
      order.indexOf(String(a.dataKey ?? a.value)) -
      order.indexOf(String(b.dataKey ?? b.value)),
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 pt-3",
        className,
      )}
    >
      {items.map((item) => {
        const key = String(item.dataKey ?? item.value);
        return (
          <div
            key={key}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: item.color }}
            />
            {config[key]?.label ?? item.value}
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
};
