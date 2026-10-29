import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
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
      <PageHeader title="Pedidos" description={formatToday(now)} />

      <Stats orders={orders} loading={loading} />

      <Tabs defaultValue="active">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="active">
            Em andamento
          </TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {loading ? (
            <BoardSkeleton />
          ) : (
            <LayoutGroup>
              <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
                {ACTIVE_STATUSES.map((status) => {
                  const columnOrders = activeOrders.filter((order) => order.status === status);
                  return (
                    <section
                      key={status}
                      className="flex w-[85%] shrink-0 snap-start flex-col gap-3 rounded-2xl bg-muted/70 p-3 sm:w-[48%] lg:w-auto"
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

function formatToday(now: number) {
  const label = new Date(now).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function Counter({ value }: { value: number }) {
  return (
    <span className="text-xs font-medium text-muted-foreground tabular-nums">
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
      { label: "Pedidos hoje", value: String(today.length) },
      { label: "Vendas hoje", value: formatCurrency(revenue) },
      { label: "Ticket médio", value: formatCurrency(completed.length ? revenue / completed.length : 0) },
    ];
  }, [orders]);

  return (
    <dl className="grid grid-cols-3 divide-x overflow-hidden rounded-2xl border bg-card">
      {stats.map(({ label, value }) => (
        <div key={label} className="min-w-0 px-3 py-3.5 sm:px-5">
          <dt className="truncate text-xs text-muted-foreground">{label}</dt>
          <dd className="mt-0.5">
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <span className="block truncate text-base font-bold tabular-nums sm:text-xl">{value}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
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
            <span className="w-14 shrink-0 font-bold">#{order.id}</span>
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
        <div key={status} className="space-y-3 rounded-2xl bg-muted/70 p-3">
          <Skeleton className="h-5 w-28 bg-card" />
          <Skeleton className="h-48 bg-card" />
          <Skeleton className="h-48 bg-card" />
        </div>
      ))}
    </div>
  );
}
