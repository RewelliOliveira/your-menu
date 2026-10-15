import { useState, type ReactNode } from "react";
import { ChartColumn, ChartNoAxesColumn, Table2 } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChartTable {
  headers: string[];
  rows: Array<Array<string | number>>;
}

interface ChartCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  table: ChartTable;
  isEmpty?: boolean;
  className?: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  description,
  actions,
  table,
  isEmpty,
  className,
  children,
}: ChartCardProps) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-xs",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-bold">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <div
            className="flex rounded-lg bg-muted p-0.5"
            role="group"
            aria-label={`Visualização de ${title}`}
          >
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn("size-7", view === "chart" && "bg-card shadow-xs")}
              onClick={() => setView("chart")}
              aria-pressed={view === "chart"}
              aria-label="Ver gráfico"
            >
              <ChartColumn />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn("size-7", view === "table" && "bg-card shadow-xs")}
              onClick={() => setView("table")}
              aria-pressed={view === "table"}
              aria-label="Ver tabela"
            >
              <Table2 />
            </Button>
          </div>
        </div>
      </header>

      {isEmpty ? (
        <EmptyState
          icon={ChartNoAxesColumn}
          title="Sem dados neste período"
          className="py-10"
        />
      ) : view === "chart" ? (
        children
      ) : (
        <div className="max-h-72 overflow-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
              <tr>
                {table.headers.map((header, index) => (
                  <th
                    key={header}
                    className={cn(
                      "px-3 py-2 font-semibold",
                      index === 0 ? "text-left" : "text-right",
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, index) => (
                    <td
                      key={index}
                      className={cn(
                        "px-3 py-2",
                        index === 0 ? "text-left" : "text-right tabular-nums",
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
