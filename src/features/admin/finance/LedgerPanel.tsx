import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  MoreVertical,
  Pencil,
  ReceiptText,
  Search,
  Trash2,
  TrendingDown,
} from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, normalizeText, pluralize } from "@/lib/format";
import { formatDateKey } from "@/lib/month";
import { cn } from "@/lib/utils";
import type { LedgerEntry, TransactionType } from "@/types/finance";
import { SegmentedControl } from "./SegmentedControl";

type Filter = "ALL" | TransactionType;

const TYPE_STYLE: Record<
  TransactionType,
  { icon: typeof ArrowDownLeft; className: string; sign: string }
> = {
  INCOME: {
    icon: ArrowDownLeft,
    className: "bg-blue-50 text-blue-700",
    sign: "+",
  },
  EXPENSE: {
    icon: ArrowUpRight,
    className: "bg-orange-50 text-orange-700",
    sign: "−",
  },
  LOSS: {
    icon: TrendingDown,
    className: "bg-teal-50 text-teal-700",
    sign: "−",
  },
};

interface LedgerPanelProps {
  entries: LedgerEntry[] | undefined;
  onEdit: (entry: LedgerEntry) => void;
  onDelete: (entry: LedgerEntry) => void;
}

export function LedgerPanel({ entries, onEdit, onDelete }: LedgerPanelProps) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = normalizeText(query);
    return (entries ?? []).filter(
      (entry) =>
        (filter === "ALL" || entry.type === filter) &&
        (!term ||
          normalizeText(`${entry.description} ${entry.category}`).includes(
            term,
          )),
    );
  }, [entries, filter, query]);

  const groups = useMemo(() => {
    const byDate = new Map<string, LedgerEntry[]>();
    filtered.forEach((entry) =>
      byDate.set(entry.date, [...(byDate.get(entry.date) ?? []), entry]),
    );
    return [...byDate.entries()];
  }, [filtered]);

  const balance = filtered.reduce(
    (sum, entry) =>
      sum + (entry.type === "INCOME" ? entry.amount : -entry.amount),
    0,
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          label="Filtrar movimentações"
          value={filter}
          onChange={setFilter}
          className="w-full overflow-x-auto scrollbar-none sm:w-fit"
          options={[
            { value: "ALL", label: "Todas" },
            { value: "INCOME", label: "Entradas" },
            { value: "EXPENSE", label: "Saídas" },
            { value: "LOSS", label: "Perdas" },
          ]}
        />
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar movimentação"
            className="h-10 pl-10"
            aria-label="Buscar movimentação"
          />
        </div>
      </div>

      {!entries ? (
        <Skeleton className="h-80" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="Nenhuma movimentação"
          description="Não há lançamentos para este filtro no mês selecionado."
          className="rounded-2xl border bg-card"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3 text-sm">
            <span className="text-muted-foreground">
              {pluralize(filtered.length, "lançamento")}
            </span>
            <span className="font-bold tabular-nums">
              Saldo {balance < 0 ? "−" : ""}
              {formatCurrency(Math.abs(balance))}
            </span>
          </div>
          {groups.map(([date, items]) => (
            <div key={date}>
              <h3 className="bg-muted/30 px-4 py-1.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                {formatDateKey(date)}
              </h3>
              <ul className="divide-y">
                {items.map((entry) => {
                  const style = TYPE_STYLE[entry.type];
                  const Icon = style.icon;
                  return (
                    <li
                      key={entry.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-xl",
                          style.className,
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {entry.description}
                        </p>
                        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                          {entry.category}
                          {entry.source === "ORDERS" && entry.orders && (
                            <span>· {pluralize(entry.orders, "pedido")}</span>
                          )}
                        </p>
                      </div>
                      <span className="text-sm font-bold whitespace-nowrap tabular-nums">
                        {style.sign} {formatCurrency(entry.amount)}
                      </span>
                      <div className="flex w-8 justify-end sm:w-24">
                        {entry.source === "MANUAL" ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Ações de ${entry.description}`}
                              >
                                <MoreVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => onEdit(entry)}>
                                <Pencil /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => onDelete(entry)}
                              >
                                <Trash2 /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="hidden sm:inline-flex"
                          >
                            Automático
                          </Badge>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
