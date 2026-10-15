import { Link } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";

import { FoodImage } from "@/components/shared/FoodImage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/format";
import { getStartingPrice } from "@/lib/menu";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/menu";

interface DishRowProps {
  dish: Dish;
  onToggleAvailability: (dish: Dish, isAvailable: boolean) => void;
  onDelete: (dish: Dish) => void;
}

export function DishRow({ dish, onToggleAvailability, onDelete }: DishRowProps) {
  const editPath = `/admin/menu/${dish.id}`;

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-3 px-4 py-3 sm:gap-4"
    >
      <Link to={editPath} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <FoodImage
          src={dish.imageUrl}
          alt={dish.name}
          className={cn("size-14 shrink-0 rounded-xl sm:size-16", !dish.isAvailable && "opacity-50 grayscale")}
        />
        <div className="min-w-0">
          <p className={cn("truncate font-semibold", !dish.isAvailable && "text-muted-foreground")}>{dish.name}</p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">{dish.description}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums">
            {dish.variants.length > 1 && <span className="text-xs font-medium text-muted-foreground">a partir de </span>}
            {formatCurrency(getStartingPrice(dish))}
          </p>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="hidden md:inline">{dish.isAvailable ? "Disponível" : "Pausado"}</span>
          <Switch
            checked={dish.isAvailable}
            onCheckedChange={(checked) => onToggleAvailability(dish, checked)}
            aria-label={`${dish.isAvailable ? "Pausar" : "Ativar"} ${dish.name}`}
          />
        </label>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Ações de ${dish.name}`}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={editPath}>
                <Pencil /> Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(dish)}>
              <Trash2 /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.li>
  );
}
