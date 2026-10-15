import { useState } from "react";
import { MapPinned, Pencil, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAsync } from "@/hooks/use-async";
import { formatCurrency } from "@/lib/format";
import { notifyError } from "@/lib/notify";
import { deleteDeliveryZone, getDeliveryZones, updateRestaurantFlags } from "@/services/restaurant-service";
import type { DeliveryZone } from "@/types/restaurant";
import { useAdminRestaurant } from "../admin-restaurant-context";
import { ZoneDialog } from "./ZoneDialog";

export function DeliverySettingsPage() {
  const { restaurant, setRestaurant } = useAdminRestaurant();
  const { data: zones, error, reload, setData } = useAsync(getDeliveryZones);
  const [dialog, setDialog] = useState<{ open: boolean; zone: DeliveryZone | null }>({ open: false, zone: null });
  const [zoneToDelete, setZoneToDelete] = useState<DeliveryZone | null>(null);

  async function togglePickup(pickupEnabled: boolean) {
    try {
      setRestaurant(await updateRestaurantFlags({ pickupEnabled }));
      toast.success(pickupEnabled ? "Retirada no balcão ativada" : "Retirada no balcão desativada");
    } catch (err) {
      notifyError(err);
    }
  }

  function handleSaved(zone: DeliveryZone) {
    setData((list) => {
      if (!list) return [zone];
      return list.some((z) => z.id === zone.id) ? list.map((z) => (z.id === zone.id ? zone : z)) : [...list, zone];
    });
    setDialog({ open: false, zone: null });
    toast.success("Bairro salvo");
  }

  async function confirmDelete() {
    if (!zoneToDelete) return;
    await deleteDeliveryZone(zoneToDelete.id);
    setData((list) => list?.filter((z) => z.id !== zoneToDelete.id));
    toast.success("Bairro removido");
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <Card className="py-4">
        <CardContent>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block font-bold">Retirada no balcão</span>
              <span className="block text-sm text-muted-foreground">Permite que o cliente busque o pedido na loja.</span>
            </span>
            <Switch checked={restaurant.pickupEnabled} onCheckedChange={togglePickup} />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bairros atendidos</CardTitle>
          <CardDescription>Clientes só conseguem pedir entrega para os bairros desta lista.</CardDescription>
          <CardAction>
            <Button size="sm" onClick={() => setDialog({ open: true, zone: null })}>
              <Plus /> Adicionar
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {error ? (
            <ErrorState error={error} onRetry={() => reload()} />
          ) : !zones ? (
            <Skeleton className="h-40" />
          ) : zones.length === 0 ? (
            <EmptyState
              icon={MapPinned}
              title="Nenhum bairro cadastrado"
              description="Adicione os bairros que você atende e a taxa de cada um."
            />
          ) : (
            <ul className="divide-y rounded-xl border">
              <AnimatePresence initial={false}>
                {zones.map((zone) => (
                  <motion.li
                    key={zone.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="flex-1 font-semibold">{zone.name}</span>
                    <span className="text-sm font-bold tabular-nums">
                      {zone.fee ? formatCurrency(zone.fee) : <span className="text-success">Grátis</span>}
                    </span>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDialog({ open: true, zone })}
                        aria-label={`Editar ${zone.name}`}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:text-destructive"
                        onClick={() => setZoneToDelete(zone)}
                        aria-label={`Remover ${zone.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </CardContent>
      </Card>

      <ZoneDialog
        open={dialog.open}
        zone={dialog.zone}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={!!zoneToDelete}
        onOpenChange={(open) => !open && setZoneToDelete(null)}
        title="Remover bairro?"
        description={`Clientes de "${zoneToDelete?.name}" não poderão mais pedir entrega.`}
        confirmLabel="Remover"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
