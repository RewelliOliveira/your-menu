import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { formatCurrency, formatPercent } from "@/lib/format";
import { formatMonthShort, shiftMonth } from "@/lib/month";
import { cn } from "@/lib/utils";
import type { FinanceReport } from "@/types/finance";

function Delta({
  current,
  previous,
  goodWhenUp,
  label,
  compact = false,
}: {
  current: number;
  previous: number;
  goodWhenUp: boolean;
  label: string;
  compact?: boolean;
}) {
  if (!previous)
    return (
      <span className="text-xs text-muted-foreground">Sem base em {label}</span>
    );

  const change = (current - previous) / Math.abs(previous);
  const flat = Math.abs(change) < 0.005;
  const good = change > 0 === goodWhenUp;
  const Icon = flat ? Minus : change > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        flat
          ? "text-muted-foreground"
          : good
            ? "text-emerald-700"
            : "text-red-700",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {flat
        ? "Estável"
        : `${change > 0 ? "+" : "−"}${formatPercent(Math.abs(change))}`}
      <span
        className={cn(
          "font-medium text-muted-foreground",
          compact && "hidden sm:inline",
        )}
      >
        vs {label}
      </span>
    </span>
  );
}

interface TileProps {
  label: string;
  value: string;
  color?: string;
  detail: string;
  delta: React.ReactNode;
}

function Tile({ label, value, color, detail, delta }: TileProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border bg-card p-4 shadow-xs">
      <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        {color && (
          <span
            className="size-2.5 rounded-[3px]"
            style={{ backgroundColor: color }}
          />
        )}
        {label}
      </p>
      <p className="text-xl font-bold tracking-tight sm:text-2xl">
        {value}
      </p>
      <p className="truncate text-xs text-muted-foreground">{detail}</p>
      {delta}
    </div>
  );
}

export function FinanceStats({ report }: { report: FinanceReport }) {
  const { summary, previous } = report;
  const previousMonth = formatMonthShort(shiftMonth(report.month, -1));
  const previousLabel = report.isPartial
    ? `mesmo período de ${previousMonth}`
    : previousMonth;
  const topExpense = report.expensesByCategory[0];
  const cancelRate = summary.orders
    ? summary.cancelledOrders / summary.orders
    : 0;
  const profitable = summary.profit >= 0;

  return (
    <div className="grid gap-3 lg:grid-cols-[1.15fr_2fr] lg:gap-4">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5 shadow-xs">
        <div className="space-y-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
            Lucro líquido
            {report.isPartial && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold">
                Mês em andamento
              </span>
            )}
          </p>
          <p
            className={cn(
              "text-4xl font-bold tracking-tight sm:text-5xl",
              !profitable && "text-red-700",
            )}
          >
            {formatCurrency(summary.profit)}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-semibold">
              Margem de {formatPercent(summary.margin)}
            </span>
            <Delta
              current={summary.profit}
              previous={previous.profit}
              goodWhenUp
              label={previousLabel}
            />
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-2 rounded-xl bg-muted/60 p-3 text-xs">
          {[
            {
              label: "Entradas",
              value: summary.revenue,
              color: "var(--chart-income)",
            },
            {
              label: "Saídas",
              value: summary.expenses,
              color: "var(--chart-expense)",
            },
            {
              label: "Perdas",
              value: summary.losses,
              color: "var(--chart-loss)",
            },
          ].map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="size-2 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </dt>
              <dd className="truncate font-bold">
                {formatCurrency(item.value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        <Tile
          label="Entradas"
          color="var(--chart-income)"
          value={formatCurrency(summary.revenue)}
          detail={`Online ${formatCurrency(summary.onlineSales)} · Outras ${formatCurrency(summary.otherIncome)}`}
          delta={
            <Delta
              current={summary.revenue}
              previous={previous.revenue}
              goodWhenUp
              label={previousLabel}
              compact
            />
          }
        />
        <Tile
          label="Saídas"
          color="var(--chart-expense)"
          value={formatCurrency(summary.expenses)}
          detail={
            topExpense
              ? `Maior gasto: ${topExpense.category}`
              : "Nenhuma saída registrada"
          }
          delta={
            <Delta
              current={summary.expenses}
              previous={previous.expenses}
              goodWhenUp={false}
              label={previousLabel}
              compact
            />
          }
        />
        <Tile
          label="Perdas"
          color="var(--chart-loss)"
          value={formatCurrency(summary.losses)}
          detail={`${formatPercent(summary.revenue ? summary.losses / summary.revenue : 0)} das entradas`}
          delta={
            <Delta
              current={summary.losses}
              previous={previous.losses}
              goodWhenUp={false}
              label={previousLabel}
              compact
            />
          }
        />
        <Tile
          label="Pedidos concluídos"
          value={summary.completedOrders.toLocaleString("pt-BR")}
          detail={`Ticket médio ${formatCurrency(summary.averageTicket)} · ${formatPercent(cancelRate)} cancelados`}
          delta={
            <Delta
              current={summary.completedOrders}
              previous={previous.completedOrders}
              goodWhenUp
              label={previousLabel}
              compact
            />
          }
        />
      </div>
    </div>
  );
}
