import { motion } from "motion/react";

import { FoodImage } from "@/components/shared/FoodImage";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WEEKDAYS } from "@/types/restaurant";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useStorefront } from "./storefront-context";

function useTodayHours() {
  const { hours } = useStorefront();
  const today = hours.find((day) => day.weekday === WEEKDAYS[new Date().getDay()]);
  return today?.isOpen ? `Hoje das ${today.openingTime} às ${today.closingTime}` : "Não abre hoje";
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
        <ThemeToggle className="absolute top-3 right-3 rounded-full bg-card/80 text-foreground backdrop-blur hover:bg-card" />
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative -mt-12 flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:-mt-16 sm:flex-row sm:items-center sm:p-6"
        >
          <FoodImage
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className="-mt-12 size-18 shrink-0 rounded-xl border-4 border-card sm:mt-0 sm:size-22"
          />

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{restaurant.name}</h1>
              {restaurant.description && <p className="mt-1 text-sm text-muted-foreground">{restaurant.description}</p>}
            </div>

            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-2 [&_li]:whitespace-nowrap [&_li+li]:before:mr-2 [&_li+li]:before:content-['·'] [&_ul]:flex [&_ul]:gap-x-2 sm:[&>ul+ul]:before:content-['·']">
              <ul>
                <li className={cn("font-semibold", restaurant.isOpen ? "text-success" : "text-destructive")}>
                  {restaurant.isOpen ? "Aberto" : "Fechado"}
                </li>
                <li>{todayHours}</li>
              </ul>
              <ul>
                <li>
                  {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min
                </li>
                {minFee !== null && (
                  <li>{minFee === 0 ? "Entrega grátis" : `Entrega a partir de ${formatCurrency(minFee)}`}</li>
                )}
              </ul>
              {restaurant.pickupEnabled && (
                <ul>
                  <li>Retirada no local</li>
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
