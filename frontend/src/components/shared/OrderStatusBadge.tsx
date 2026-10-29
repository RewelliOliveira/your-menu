import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_DOT, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

const STATUS_VARIANT = {
  PENDING: "warning",
  CONFIRMED: "info",
  IN_DELIVERY: "violet",
  DELIVERED: "success",
  CANCELLED: "destructive",
} as const satisfies Record<OrderStatus, string>;

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={className}>
      <span className={cn("size-1.5 rounded-full", ORDER_STATUS_DOT[status])} />
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}
