import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import { useAsync } from "@/hooks/use-async";
import { formatCurrency } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/lib/order-status";
import { getOrders, updateOrderStatus } from "@/services/order-service";
import type { Order, OrderStatus } from "@/types/order";

const POLL_INTERVAL = 8_000;

export function useOrders() {
  const { data: orders, loading, error, reload, setData } = useAsync(getOrders, { pollInterval: POLL_INTERVAL });
  const knownIds = useRef<Set<number> | null>(null);

  useEffect(() => {
    if (!orders) return;
    if (knownIds.current) {
      orders
        .filter((order) => order.status === "PENDING" && !knownIds.current!.has(order.id))
        .forEach((order) =>
          toast.info(`Novo pedido #${order.id}`, {
            description: `${order.customer.name} · ${formatCurrency(order.total)}`,
          }),
        );
    }
    knownIds.current = new Set(orders.map((order) => order.id));
  }, [orders]);

  useEffect(() => {
    const onStorage = () => reload(true);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reload]);

  const changeStatus = useCallback(
    async (order: Order, status: OrderStatus) => {
      const updated = await updateOrderStatus(order.id, status);
      setData((list) => list?.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(`Pedido #${order.id}: ${ORDER_STATUS_LABEL[status].toLowerCase()}`);
      return updated;
    },
    [setData],
  );

  return { orders: orders ?? [], loading: loading && !orders, error, reload, changeStatus };
}
