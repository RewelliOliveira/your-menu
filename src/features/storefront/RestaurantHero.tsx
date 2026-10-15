import { Bike, Clock, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

import { FoodImage } from "@/components/shared/FoodImage";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WEEKDAYS } from "@/types/restaurant";
import { useStorefront } from "./storefront-context";

function useTodayHours() {
  const { hours } = useStorefront();
  const today = hours.find((day) => day.weekday === WEEKDAYS[new Date().getDay()]);
  return today?.isOpen ? `Hoje, ${today.openingTime} às ${today.closingTime}` : "Não abre hoje";
}

export function RestaurantHero() {
  const { restaurant, zones } = useStorefront();
  const todayHours = useTodayHours();
  const minFee = zones.length ? Math.min(...zones.map((zone) => zone.fee)) : null;

  return (
    <header>
      <div className="relative h-40 overflow-hidden bg-muted sm:h-56 lg:h-72">
        {restaurant.bannerUrl && (
          <motion.img
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={restaurant.bannerUrl}
            alt=""
            className="size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative -mt-14 flex flex-col gap-4 rounded-3xl border bg-card p-5 shadow-lg sm:-mt-16 sm:flex-row sm:items-center sm:p-6"
        >
          <FoodImage
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className="-mt-14 size-20 shrink-0 rounded-2xl border-4 border-card shadow-md sm:mt-0 sm:size-24"
          />

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{restaurant.name}</h1>
              {restaurant.description && <p className="mt-1 text-sm text-muted-foreground">{restaurant.description}</p>}
            </div>

            <ul className="flex flex-wrap gap-2 text-xs font-semibold">
              <li
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1",
                  restaurant.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
                )}
              >
                <span className={cn("size-1.5 rounded-full", restaurant.isOpen ? "bg-emerald-500" : "bg-red-500")} />
                {restaurant.isOpen ? "Aberto agora" : "Fechado"}
              </li>
              <li className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                <Clock className="size-3.5" />
                {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min
              </li>
              {minFee !== null && (
                <li className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                  <Bike className="size-3.5" />
                  {minFee === 0 ? "Entrega grátis" : `Entrega a partir de ${formatCurrency(minFee)}`}
                </li>
              )}
              {restaurant.pickupEnabled && (
                <li className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                  <ShoppingBag className="size-3.5" /> Retirada
                </li>
              )}
            </ul>
            <p className="text-xs text-muted-foreground">{todayHours}</p>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
