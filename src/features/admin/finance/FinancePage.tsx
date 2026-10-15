import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAsync } from "@/hooks/use-async";
import { currentMonth, isValidMonth, toDateKey } from "@/lib/month";
import { cn } from "@/lib/utils";
import {
  deleteTransaction,
  getFinanceReport,
  getLedger,
} from "@/services/finance-service";
import type { LedgerEntry, Transaction } from "@/types/finance";
import { PageHeader } from "../PageHeader";
import { CategoryBreakdownChart } from "./charts/CategoryBreakdownChart";
import { MonthlyComparisonChart } from "./charts/MonthlyComparisonChart";
import { ProfitTrendChart } from "./charts/ProfitTrendChart";
import { RevenueTrendChart } from "./charts/RevenueTrendChart";
import {
  PaymentMethodsChart,
  PeakHoursChart,
  TopDishesChart,
} from "./charts/SalesInsightsCharts";
import { exportLedger } from "./export-ledger";
import { FinanceStats } from "./FinanceStats";
import { LedgerPanel } from "./LedgerPanel";
import { MonthPicker } from "./MonthPicker";
import { TransactionDialog } from "./TransactionDialog";

export function FinancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const thisMonth = currentMonth();
  const requested = searchParams.get("mes");
  const month =
    isValidMonth(requested) && requested <= thisMonth ? requested : thisMonth;

  const reportFetcher = useCallback(() => getFinanceReport(month), [month]);
  const ledgerFetcher = useCallback(() => getLedger(month), [month]);
  const report = useAsync(reportFetcher);
  const ledger = useAsync(ledgerFetcher);

  const [dialog, setDialog] = useState<{
    open: boolean;
    transaction: Transaction | null;
  }>({ open: false, transaction: null });
  const [toDelete, setToDelete] = useState<LedgerEntry | null>(null);

  const defaultDate =
    month === thisMonth ? toDateKey(new Date()) : `${month}-01`;

  function changeMonth(next: string) {
    setSearchParams(next === thisMonth ? {} : { mes: next }, { replace: true });
  }

  function refresh() {
    report.reload(true);
    ledger.reload(true);
  }

  function handleSaved() {
    setDialog({ open: false, transaction: null });
    toast.success("Movimentação salva");
    refresh();
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await deleteTransaction(toDelete.id);
    toast.success("Movimentação excluída");
    refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => ledger.data && exportLedger(month, ledger.data)}
              disabled={!ledger.data?.length}
            >
              <Download /> Exportar CSV
            </Button>
            <Button
              onClick={() => setDialog({ open: true, transaction: null })}
            >
              <Plus /> Nova movimentação
            </Button>
          </>
        }
      />

      <Tabs defaultValue="overview" className="gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <MonthPicker value={month} onChange={changeMonth} />
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="overview">Visão geral</TabsTrigger>
            <TabsTrigger value="ledger">Movimentações</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          {report.error && !report.data ? (
            <ErrorState error={report.error} onRetry={() => report.reload()} />
          ) : !report.data ? (
            <OverviewSkeleton />
          ) : (
            <div
              className={cn(
                "space-y-4 transition-opacity lg:space-y-6",
                report.loading && "opacity-60",
              )}
            >
              <FinanceStats report={report.data} />
              <RevenueTrendChart report={report.data} />
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                <MonthlyComparisonChart report={report.data} />
                <ProfitTrendChart report={report.data} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                <CategoryBreakdownChart report={report.data} />
                <TopDishesChart report={report.data} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                <PeakHoursChart report={report.data} />
                <PaymentMethodsChart report={report.data} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ledger">
          {ledger.error && !ledger.data ? (
            <ErrorState error={ledger.error} onRetry={() => ledger.reload()} />
          ) : (
            <div
              className={cn(
                "transition-opacity",
                ledger.loading && ledger.data && "opacity-60",
              )}
            >
              <LedgerPanel
                entries={ledger.data}
                onEdit={(entry) =>
                  setDialog({ open: true, transaction: entry })
                }
                onDelete={setToDelete}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TransactionDialog
        open={dialog.open}
        transaction={dialog.transaction}
        defaultDate={defaultDate}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir movimentação?"
        description={`"${toDelete?.description}" será removida e os totais do mês serão recalculados.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="grid gap-3 lg:grid-cols-[1.15fr_2fr] lg:gap-4">
        <Skeleton className="h-48" />
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      </div>
      <Skeleton className="h-80" />
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}
