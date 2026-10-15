import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AXIS_PROPS, BAR_RADIUS, truncateLabel } from "../chart-config";

const ROW_HEIGHT = 36;

interface HorizontalBarChartProps {
  data: Array<Record<string, string | number>>;
  categoryKey: string;
  valueKey: string;
  config: ChartConfig;
  color: string;
  labelWidth?: number;
  formatValue: (value: number) => string;
  formatLabel?: (value: number) => string;
}

export function HorizontalBarChart({
  data,
  categoryKey,
  valueKey,
  config,
  color,
  labelWidth = 120,
  formatValue,
  formatLabel = formatValue,
}: HorizontalBarChartProps) {
  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: data.length * ROW_HEIGHT + 8 }}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 64, top: 0, bottom: 0 }}
        barCategoryGap={8}
      >
        <XAxis type="number" dataKey={valueKey} hide />
        <YAxis
          type="category"
          dataKey={categoryKey}
          {...AXIS_PROPS}
          width={labelWidth}
          tickFormatter={(value: string) =>
            truncateLabel(value, Math.floor((labelWidth - 12) / 7))
          }
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              valueFormatter={(value) => formatValue(value)}
            />
          }
        />
        <Bar
          dataKey={valueKey}
          fill={color}
          radius={BAR_RADIUS}
          maxBarSize={20}
        >
          <LabelList
            dataKey={valueKey}
            position="right"
            offset={8}
            className="fill-foreground text-xs font-semibold"
            formatter={(value) => formatLabel(Number(value))}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
