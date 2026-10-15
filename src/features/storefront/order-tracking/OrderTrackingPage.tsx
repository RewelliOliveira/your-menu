import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, CircleX } from "lucide-react";
import { motion } from "motion/react";

import { ErrorState } from "@/components/shared/ErrorState";
import { FoodImage } from "@/components/shared/FoodImage";
import { PageLoader } from "@/components/shared/PageLoader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAsync } from "@/hooks/use-async";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { PAYMENT_LABEL } from "@/lib/order-status";
import { getOrderByTrackingCode } from "@/services/order-service";
import { NotFoundPage } from "@/app/NotFoundPage";
import { isNotFound } from "@/services/api-error";
import { useStorefront } from "../storefront-context";
import { OrderProgress } from "./OrderProgress";
import { PixPaymentCard } from "./PixPaymentCard";

const POLL_INTERVAL = 10_000;

export function OrderTrackingPage() {
  const { slug = "", trackingCode = "" } = useParams();
  const { restaurant, city } = useStorefront();
  const fetcher = useCallback(() => getOrderByTrackingCode(slug, trackingCode), [slug, trackingCode]);
  const { data: order, error, reload } = useAsync(fetcher, { pollInterval: POLL_INTERVAL });

  if (isNotFound(error)) return <NotFoundPage message="Não encontramos esse pedido." />;
  if (error && !order) return <ErrorState error={error} onRetry={() => reload()} />;
  if (!order) return <PageLoader className="min-h-dvh" />;

  const cancelled = order.status === "CANCELLED";
  const showPix = order.paymentMethod === "PIX" && order.status === "PENDING" && !!restaurant.pixKey;

  return (
    <div className="min-h-dvh bg-linear-to-b from-accent/70 to-background to-40% pb-12">
      <div className="mx-auto max-w-xl space-y-5 px-4 pt-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center">
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            className={`mx-auto flex size-16 items-center justify-center rounded-full text-white shadow-lg ${
              cancelled ? "bg-destructive shadow-red-500/30" : "bg-success shadow-emerald-500/30"
            }`}
          >
            {cancelled ? <CircleX className="size-8" /> : <Check className="size-8" strokeWidth={3} />}
          </motion.span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {cancelled ? `Pedido #${order.id} cancelado` : `Pedido #${order.id} enviado!`}
          </h1>
          <p className="text-sm text-muted-foreground">
            {cancelled
              ? "Entre em contato com o restaurante se tiver dúvidas."
              : `${restaurant.name} · feito em ${formatDateTime(order.createdAt)}`}
          </p>
        </motion.div>

        {showPix && <PixPaymentCard order={order} restaurant={restaurant} city={city} />}

        {!cancelled && (
          <section className="rounded-3xl border bg-card p-5 shadow-xs">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-extrabold">Acompanhe seu pedido</h2>
              <span className="text-xs text-muted-foreground">Atualiza automaticamente</span>
            </div>
            <OrderProgress status={order.status} fulfillment={order.fulfillment} />
          </section>
        )}

        <section className="space-y-4 rounded-3xl border bg-card p-5 shadow-xs">
          <h2 className="font-extrabold">Resumo</h2>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={`${item.dishId}-${item.variantId}-${item.note}`} className="flex items-center gap-3">
                <FoodImage src={item.imageUrl} alt={item.dishName} className="size-12 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-semibold">
                    <span className="text-primary">{item.quantity}x</span> {item.dishName}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatCurrency(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <dl className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
            <Row label="Taxa de entrega" value={order.deliveryFee ? formatCurrency(order.deliveryFee) : "Grátis"} />
            <div className="flex justify-between text-base font-extrabold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatCurrency(order.total)}</dd>
            </div>
          </dl>
          <Separator />
          <dl className="space-y-2 text-sm">
            <Row label="Pagamento" value={PAYMENT_LABEL[order.paymentMethod]} />
            <Row
              label={order.address ? "Entregar em" : "Retirada"}
              value={order.address ? `${order.address.street}, ${order.address.number}` : "No balcão da loja"}
            />
          </dl>
        </section>

        <Button asChild variant="outline" size="lg" className="w-full">
          <Link to={`/${slug}`}>Voltar ao cardápio</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-muted-foreground">
      <dt>{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
