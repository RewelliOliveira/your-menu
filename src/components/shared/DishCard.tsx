import { Plus } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { getStartingPrice } from "@/lib/menu";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/menu";
import { FoodImage } from "./FoodImage";

interface DishCardProps {
  dish: Pick<Dish, "name" | "description" | "imageUrl" | "isAvailable" | "variants">;
  onSelect?: () => void;
  disabled?: boolean;
}

export function DishCard({ dish, onSelect, disabled = false }: DishCardProps) {
  const unavailable = !dish.isAvailable;
  const price = getStartingPrice(dish);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled || unavailable || !onSelect}
      className={cn(
        "group flex w-full gap-4 rounded-2xl border bg-card p-4 text-left shadow-xs transition-all",
        "enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:hover:border-primary/30 enabled:hover:shadow-md",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        unavailable && "opacity-60",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="line-clamp-2 font-bold">{dish.name || "Nome do prato"}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{dish.description}</p>
        <div className="mt-auto flex items-baseline gap-1.5 pt-3">
          {unavailable ? (
            <span className="text-sm font-semibold text-muted-foreground">Indisponível no momento</span>
          ) : (
            <>
              {dish.variants.length > 1 && <span className="text-xs text-muted-foreground">a partir de</span>}
              <span className="font-bold text-success tabular-nums">{formatCurrency(price)}</span>
            </>
          )}
        </div>
      </div>

      <div className="relative shrink-0">
        <FoodImage src={dish.imageUrl} alt={dish.name} className="size-24 rounded-xl sm:size-28" />
        {!unavailable && !disabled && onSelect && (
          <span className="absolute -right-1.5 -bottom-1.5 flex size-8 items-center justify-center rounded-full bg-card text-primary shadow-md ring-1 ring-border transition-transform group-hover:scale-110">
            <Plus className="size-4" />
          </span>
        )}
      </div>
    </button>
  );
}
