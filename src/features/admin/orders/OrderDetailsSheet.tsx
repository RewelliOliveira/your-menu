import { useState } from "react";
import {
  Bike,
  CreditCard,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  StickyNote,
} from "lucide-react";

import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  formatCurrency,
  formatDateTime,
  maskCep,
  maskPhone,
} from "@/lib/format";
import { notifyError } from "@/lib/notify";
import {
  FULFILLMENT_LABEL,
  PAYMENT_LABEL,
  canTransition,
  getNextStep,
} from "@/lib/order-status";
import type { Order, OrderStatus } from "@/types/order";

interface OrderDetailsSheetProps {
  order: Order | null;
  onClose: () => void;
  onAdvance: (order: Order, status: OrderStatus) => Promise<unknown>;
  onCancel: (order: Order) => void;
}

export function OrderDetailsSheet({
  order,
  onClose,
  onAdvance,
  onCancel,
}: OrderDetailsSheetProps) {
  return (
    <Sheet open={!!order} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        {order && (
          <OrderDetails
            order={order}
            onAdvance={onAdvance}
            onCancel={onCancel}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="flex items-center gap-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        <Icon className="size-4" /> {title}
      </h3>
      <div className="text-sm">{children}</div>
    </section>
  );
}

function OrderDetails({
  order,
  onAdvance,
  onCancel,
}: Omit<OrderDetailsSheetProps, "onClose"> & { order: Order }) {
  const [advancing, setAdvancing] = useState(false);
  const nextStep = getNextStep(order.status, order.fulfillment);
  const whatsappUrl = `https://wa.me/55${order.customer.phone}`;

  async function advance() {
    if (!nextStep) return;
    setAdvancing(true);
    try {
      await onAdvance(order, nextStep.status);
    } catch (error) {
      notifyError(error);
    } finally {
      setAdvancing(false);
    }
  }

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <SheetTitle className="text-2xl font-bold">
            Pedido #{order.id}
          </SheetTitle>
          <OrderStatusBadge status={order.status} />
        </div>
        <SheetDescription>
          {formatDateTime(order.createdAt)} ·{" "}
          {FULFILLMENT_LABEL[order.fulfillment]}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <Section icon={Phone} title="Cliente">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold wrap-break-word">
                {order.customer.name}
              </p>
              <p className="text-muted-foreground">
                {maskPhone(order.customer.phone)}
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
          </div>
        </Section>

        <Section
          icon={order.fulfillment === "DELIVERY" ? Bike : ShoppingBag}
          title={FULFILLMENT_LABEL[order.fulfillment]}
        >
          {order.address ? (
            <div className="space-y-0.5">
              <p className="font-semibold">
                {order.address.street}, {order.address.number}
                {order.address.complement && ` · ${order.address.complement}`}
              </p>
              <p className="text-muted-foreground">
                {order.address.zoneName} · CEP {maskCep(order.address.cep)}
              </p>
              {order.address.reference && (
                <p className="text-muted-foreground">
                  Ref.: {order.address.reference}
                </p>
              )}
            </div>
          ) : (
            <p className="font-semibold">Cliente vai retirar no balcão</p>
          )}
        </Section>

        <Section icon={ShoppingBag} title="Itens">
          <ul className="divide-y rounded-xl border">
            {order.items.map((item) => (
              <li
                key={`${item.dishId}-${item.variantId}`}
                className="flex justify-between gap-3 p-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold">
                    <span className="text-primary">{item.quantity}x</span>{" "}
                    {item.dishName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.variantLabel}
                  </p>
                  {item.note && (
                    <p className="mt-1 text-xs text-amber-700">
                      Obs.: {item.note}
                    </p>
                  )}
                </div>
                <span className="font-semibold tabular-nums">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {order.note && (
          <Section icon={StickyNote} title="Observação">
            <p className="rounded-xl bg-amber-50 p-3 text-amber-900">
              {order.note}
            </p>
          </Section>
        )}

        <Section icon={CreditCard} title="Pagamento">
          <div className="space-y-2 rounded-xl bg-muted/60 p-3">
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
            <Row
              label="Taxa de entrega"
              value={
                order.deliveryFee ? formatCurrency(order.deliveryFee) : "Grátis"
              }
            />
            <Separator />
            <Row label="Total" value={formatCurrency(order.total)} strong />
            <Row
              label="Forma de pagamento"
              value={
                order.paymentMethod === "CASH" && order.changeFor
                  ? `Dinheiro · troco p/ ${formatCurrency(order.changeFor)}`
                  : PAYMENT_LABEL[order.paymentMethod]
              }
            />
          </div>
        </Section>
      </div>

      {(nextStep || canTransition(order.status, "CANCELLED")) && (
        <SheetFooter className="sm:flex-row">
          {canTransition(order.status, "CANCELLED") && (
            <Button
              variant="outline"
              className="text-destructive sm:flex-1"
              onClick={() => onCancel(order)}
            >
              Cancelar pedido
            </Button>
          )}
          {nextStep && (
            <Button className="sm:flex-2" onClick={advance} loading={advancing}>
              {nextStep.label}
            </Button>
          )}
        </SheetFooter>
      )}
    </>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={
        strong
          ? "flex justify-between text-base font-bold"
          : "flex justify-between text-muted-foreground"
      }
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
