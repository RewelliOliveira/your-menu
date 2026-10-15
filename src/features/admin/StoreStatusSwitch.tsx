import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { updateRestaurantFlags } from "@/services/restaurant-service";
import { useAdminRestaurant } from "./admin-restaurant-context";

export function StoreStatusSwitch({ compact = false }: { compact?: boolean }) {
  const { restaurant, setRestaurant } = useAdminRestaurant();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const nextIsOpen = !restaurant.isOpen;

  async function confirm() {
    setRestaurant(await updateRestaurantFlags({ isOpen: nextIsOpen }));
    toast.success(nextIsOpen ? "Loja aberta para pedidos!" : "Loja fechada. Novos pedidos estão pausados.");
  }

  return (
    <>
      <label
        className={cn(
          "flex cursor-pointer items-center justify-between gap-3 rounded-lg transition-colors",
          compact ? "px-1" : "border px-3 py-2.5 hover:bg-muted/60",
        )}
      >
        {compact ? (
          <span className="text-xs font-semibold whitespace-nowrap">
            {restaurant.isOpen ? "Aberta" : "Fechada"}
          </span>
        ) : (
          <span className="min-w-0">
            <span className="block text-sm font-semibold">
              {restaurant.isOpen ? "Loja aberta" : "Loja fechada"}
            </span>
            <span className="block text-xs text-muted-foreground">
              {restaurant.isOpen ? "Recebendo pedidos" : "Pedidos pausados"}
            </span>
          </span>
        )}
        <Switch
          checked={restaurant.isOpen}
          onCheckedChange={() => setConfirmOpen(true)}
          aria-label={restaurant.isOpen ? "Fechar loja" : "Abrir loja"}
        />
      </label>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={nextIsOpen ? "Abrir a loja?" : "Fechar a loja?"}
        description={
          nextIsOpen
            ? "Seu cardápio voltará a aceitar pedidos imediatamente."
            : "Clientes ainda verão o cardápio, mas não conseguirão fazer novos pedidos."
        }
        confirmLabel={nextIsOpen ? "Abrir loja" : "Fechar loja"}
        destructive={!nextIsOpen}
        onConfirm={confirm}
      />
    </>
  );
}
