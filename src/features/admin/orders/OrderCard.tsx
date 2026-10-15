import { useState } from "react";
import { Bike, Clock, MoreHorizontal, ShoppingBag, StickyNote, XCircle, Eye } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatRelative } from "@/lib/format";
import { notifyError } from "@/lib/notify";
import { PAYMENT_LABEL, getNextStep } from "@/lib/order-status";
import type { Order, OrderStatus } from "@/types/order";

interface OrderCardProps {
  order: Order;
  now: number;
  onOpen: (order: Order) => void;
  onAdvance: (order: Order, status: OrderStatus) => Promise<unknown>;
  onCancel: (order: Order) => void;
}

const MAX_VISIBLE_ITEMS = 3;

export function OrderCard({ order, now, onOpen, onAdvance, onCancel }: OrderCardProps) {
  const [advancing, setAdvancing] = useState(false);
  const nextStep = getNextStep(order.status, order.fulfillment);
  const hiddenItems = order.items.length - MAX_VISIBLE_ITEMS;
  const isLate = order.status === "PENDING" && now - new Date(order.createdAt).getTime() > 5 * 60_000;

  async function advance() {
    if (!nextStep) return;
    setAdvancing(true);
    try {
      await onAdvance(order, nextStep.status);
    } catch (error) {
      notifyError(error);
      setAdvancing(false);
    }
  }

  return (
    <motion.article
      layout
      layoutId={`order-${order.id}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
      className="group flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md"
    >
      <button type="button" onClick={() => onOpen(order)} className="flex cursor-pointer flex-col gap-3 text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold tracking-tight">#{order.id}</p>
            <p className="truncate text-sm font-medium text-muted-foreground" title={order.customer.name}>
              {order.customer.name}
            </p>
          </div>
          <div className="flex max-w-[55%] shrink-0 flex-col items-end gap-1.5 text-xs font-semibold">
            <span
              className={
                isLate
                  ? "flex items-center gap-1 whitespace-nowrap text-red-600"
                  : "flex items-center gap-1 whitespace-nowrap text-muted-foreground"
              }
            >
              <Clock className="size-3.5 shrink-0" />
              {formatRelative(order.createdAt, now)}
            </span>
            <span className="flex max-w-full items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
              {order.fulfillment === "DELIVERY" ? (
                <Bike className="size-3.5 shrink-0" />
              ) : (
                <ShoppingBag className="size-3.5 shrink-0" />
              )}
              <span className="truncate">{order.fulfillment === "DELIVERY" ? order.address?.zoneName : "Retirada"}</span>
            </span>
          </div>
        </div>

        <ul className="space-y-1 text-sm">
          {order.items.slice(0, MAX_VISIBLE_ITEMS).map((item) => (
            <li key={`${item.dishId}-${item.variantId}`} className="flex gap-2">
              <span className="font-bold text-primary tabular-nums">{item.quantity}x</span>
              <span className="truncate">
                {item.dishName} <span className="text-muted-foreground">· {item.variantLabel}</span>
              </span>
            </li>
          ))}
          {hiddenItems > 0 && <li className="text-xs font-medium text-muted-foreground">+ {hiddenItems} item(ns)</li>}
        </ul>

        {order.note && (
          <p className="flex gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <StickyNote className="mt-0.5 size-3.5 shrink-0" />
            <span className="line-clamp-2">{order.note}</span>
          </p>
        )}

        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-xs font-medium text-muted-foreground">{PAYMENT_LABEL[order.paymentMethod]}</span>
          <span className="text-base font-extrabold tabular-nums">{formatCurrency(order.total)}</span>
        </div>
      </button>

      <div className="flex gap-2">
        {nextStep && (
          <Button className="flex-1" onClick={advance} loading={advancing}>
            {nextStep.label}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label={`Mais ações do pedido ${order.id}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onOpen(order)}>
              <Eye /> Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onCancel(order)}>
              <XCircle /> Cancelar pedido
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.article>
  );
}
