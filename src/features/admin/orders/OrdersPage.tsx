import { useMemo, useState } from "react";
import { BadgeDollarSign, ClipboardList, Flame, Inbox, Receipt, type LucideIcon } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNow } from "@/hooks/use-now";
import { formatCurrency, formatTime, isSameDay } from "@/lib/format";
import { ACTIVE_STATUSES, ORDER_STATUS_DOT, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";
import { PageHeader } from "../PageHeader";
import { OrderCard } from "./OrderCard";
import { OrderDetailsSheet } from "./OrderDetailsSheet";
import { useOrders } from "./use-orders";

export function OrdersPage() {
  const { orders, loading, error, reload, changeStatus } = useOrders();
  const now = useNow();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const selectedOrder = orders.find((order) => order.id === selectedId) ?? null;
  const activeOrders = orders.filter((order) => ACTIVE_STATUSES.includes(order.status));
  const finishedOrders = orders.filter((order) => !ACTIVE_STATUSES.includes(order.status));

  if (error && !orders.length) return <ErrorState error={error} onRetry={() => reload()} />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pedidos"
        description="Acompanhe e atualize os pedidos do dia."
        actions={
          <span className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Atualizando ao vivo
          </span>
        }
      />

      <Stats orders={orders} loading={loading} />

      <Tabs defaultValue="active">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="active">
            Em andamento <Counter value={activeOrders.length} />
          </TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {loading ? (
            <BoardSkeleton />
          ) : (
            <LayoutGroup>
              <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
                {ACTIVE_STATUSES.map((status) => {
                  const columnOrders = activeOrders.filter((order) => order.status === status);
                  return (
                    <section
                      key={status}
                      className="flex w-[85%] shrink-0 snap-start flex-col gap-3 rounded-3xl bg-muted/70 p-3 sm:w-[48%] lg:w-auto"
                    >
                      <header className="flex items-center justify-between px-1 pt-1">
                        <h2 className="flex items-center gap-2 text-sm font-bold">
                          <span className={cn("size-2 rounded-full", ORDER_STATUS_DOT[status])} />
                          {ORDER_STATUS_LABEL[status]}
                        </h2>
                        <Counter value={columnOrders.length} />
                      </header>

                      <AnimatePresence mode="popLayout">
                        {columnOrders.map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            now={now}
                            onOpen={(o) => setSelectedId(o.id)}
                            onAdvance={changeStatus}
                            onCancel={setCancelTarget}
                          />
                        ))}
                      </AnimatePresence>

                      {columnOrders.length === 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="rounded-2xl border border-dashed px-4 py-10 text-center text-xs font-medium text-muted-foreground"
                        >
                          Nenhum pedido aqui
                        </motion.p>
                      )}
                    </section>
                  );
                })}
              </div>
            </LayoutGroup>
          )}
        </TabsContent>

        <TabsContent value="history">
          <HistoryList orders={finishedOrders} onOpen={(o) => setSelectedId(o.id)} />
        </TabsContent>
      </Tabs>

      <OrderDetailsSheet
        order={selectedOrder}
        onClose={() => setSelectedId(null)}
        onAdvance={changeStatus}
        onCancel={setCancelTarget}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title={`Cancelar pedido #${cancelTarget?.id}?`}
        description="O cliente verá o pedido como cancelado. Essa ação não pode ser desfeita."
        confirmLabel="Cancelar pedido"
        destructive
        onConfirm={() => cancelTarget && changeStatus(cancelTarget, "CANCELLED")}
      />
    </div>
  );
}

function Counter({ value }: { value: number }) {
  return (
    <span className="min-w-5 rounded-full bg-card px-1.5 py-0.5 text-center text-[11px] font-bold text-foreground tabular-nums shadow-xs">
      {value}
    </span>
  );
}

function Stats({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const stats = useMemo(() => {
    const today = orders.filter((order) => isSameDay(order.createdAt) && order.status !== "CANCELLED");
    const completed = today.filter((order) => order.status === "DELIVERED");
    const revenue = completed.reduce((sum, order) => sum + order.total, 0);
    return [
      { label: "Pedidos hoje", value: String(today.length), icon: Receipt },
      { label: "Em andamento", value: String(today.filter((o) => ACTIVE_STATUSES.includes(o.status)).length), icon: Flame },
      { label: "Faturamento hoje", value: formatCurrency(revenue), icon: BadgeDollarSign },
      { label: "Ticket médio", value: formatCurrency(completed.length ? revenue / completed.length : 0), icon: ClipboardList },
    ] satisfies Array<{ label: string; value: string; icon: LucideIcon }>;
  }, [orders]);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-xs">
          <span className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary sm:flex">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="mt-1 h-6 w-16" />
            ) : (
              <p className="truncate text-lg font-extrabold tracking-tight tabular-nums sm:text-xl">{value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryList({ orders, onOpen }: { orders: Order[]; onOpen: (order: Order) => void }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Nenhum pedido finalizado"
        description="Pedidos concluídos e cancelados aparecem aqui."
        className="rounded-2xl border bg-card"
      />
    );
  }

  return (
    <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
      {orders.map((order) => (
        <li key={order.id}>
          <button
            type="button"
            onClick={() => onOpen(order)}
            className="flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/60"
          >
            <span className="w-14 shrink-0 font-extrabold">#{order.id}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{order.customer.name}</span>
              <span className="block text-xs text-muted-foreground">
                {formatTime(order.createdAt)} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} itens
              </span>
            </span>
            <OrderStatusBadge status={order.status} className="hidden sm:inline-flex" />
            <span className="w-24 shrink-0 text-right text-sm font-bold tabular-nums">{formatCurrency(order.total)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function BoardSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {ACTIVE_STATUSES.map((status) => (
        <div key={status} className="space-y-3 rounded-3xl bg-muted/70 p-3">
          <Skeleton className="h-5 w-28 bg-card" />
          <Skeleton className="h-48 bg-card" />
          <Skeleton className="h-48 bg-card" />
        </div>
      ))}
    </div>
  );
}
