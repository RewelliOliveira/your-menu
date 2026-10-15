import { QRCodeSVG } from "qrcode.react";
import { Copy, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { copyToClipboard } from "@/lib/notify";
import { buildPixPayload } from "@/lib/pix";
import type { Order } from "@/types/order";
import type { Restaurant } from "@/types/restaurant";

export function PixPaymentCard({ order, restaurant, city }: { order: Order; restaurant: Restaurant; city: string }) {
  const payload = buildPixPayload({
    key: restaurant.pixKey,
    merchantName: restaurant.name,
    merchantCity: city,
    amount: order.total,
    txid: `YM${order.id}`,
  });

  return (
    <section className="space-y-4 rounded-3xl border bg-card p-5 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <QrCode className="size-5" />
        </span>
        <div>
          <h2 className="font-extrabold">Pague com Pix</h2>
          <p className="text-sm text-muted-foreground">
            Valor: <strong className="text-foreground">{formatCurrency(order.total)}</strong>
          </p>
        </div>
      </div>

      <div className="mx-auto w-fit rounded-2xl border bg-white p-4">
        <QRCodeSVG value={payload} size={184} level="M" aria-label="QR Code Pix" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Pix Copia e Cola</p>
        <p className="rounded-xl bg-muted p-3 font-mono text-[11px] break-all text-muted-foreground">{payload}</p>
        <Button className="w-full" onClick={() => copyToClipboard(payload, "Código Pix copiado!")}>
          <Copy /> Copiar código
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Após o pagamento, o restaurante confirma seu pedido por aqui.
      </p>
    </section>
  );
}
