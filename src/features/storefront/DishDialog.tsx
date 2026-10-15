import { useState } from "react";
import { toast } from "sonner";

import { FoodImage } from "@/components/shared/FoodImage";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/menu";
import { useCart } from "./cart/cart-context";

const NOTE_LIMIT = 140;

interface DishDialogProps {
  dish: Dish | null;
  canOrder: boolean;
  onClose: () => void;
}

export function DishDialog({ dish, canOrder, onClose }: DishDialogProps) {
  return (
    <Dialog open={!!dish} onOpenChange={(open) => !open && onClose()}>
      <DialogContent mobileSheet className="flex flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        {dish && <DishDetails key={dish.id} dish={dish} canOrder={canOrder} onAdded={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function DishDetails({ dish, canOrder, onAdded }: { dish: Dish; canOrder: boolean; onAdded: () => void }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState(dish.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const variant = dish.variants.find((v) => v.id === variantId);
  const total = (variant?.price ?? 0) * quantity;

  function handleAdd() {
    if (!variant) return;
    add({ dishId: dish.id, variantId: variant.id, quantity, note });
    toast.success(`${quantity}x ${dish.name} na sacola`);
    onAdded();
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <FoodImage src={dish.imageUrl} alt={dish.name} className="aspect-16/10 w-full sm:aspect-16/9" />

        <div className="space-y-6 p-5 sm:p-6">
          <div className="space-y-2">
            <DialogTitle className="text-xl font-bold sm:text-2xl">{dish.name}</DialogTitle>
            {dish.description && (
              <DialogDescription className="leading-relaxed">{dish.description}</DialogDescription>
            )}
            {dish.variants.length === 1 && (
              <p className="text-lg font-semibold tabular-nums">{formatCurrency(dish.variants[0].price)}</p>
            )}
          </div>

          {dish.variants.length > 1 && (
            <fieldset className="space-y-3">
              <legend className="mb-3 flex w-full items-center justify-between">
                <span className="font-bold">Escolha uma opção</span>
                <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">Obrigatório</span>
              </legend>
              <RadioGroup value={variantId} onValueChange={setVariantId}>
                {dish.variants.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors",
                      option.id === variantId ? "border-foreground ring-1 ring-foreground" : "hover:border-foreground/30",
                    )}
                  >
                    <RadioGroupItem value={option.id} />
                    <span className="flex-1 text-sm font-semibold">{option.label}</span>
                    <span className="text-sm font-bold tabular-nums">{formatCurrency(option.price)}</span>
                  </label>
                ))}
              </RadioGroup>
            </fieldset>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="dish-note" className="font-bold">
                Alguma observação?
              </label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {note.length}/{NOTE_LIMIT}
              </span>
            </div>
            <Textarea
              id="dish-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex.: tirar a cebola, ponto da carne…"
              maxLength={NOTE_LIMIT}
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="pb-safe flex items-center gap-3 border-t bg-card px-5 pt-4 sm:px-6 sm:pb-4">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <Button size="lg" className="flex-1 justify-between" onClick={handleAdd} disabled={!canOrder || !variant}>
          {canOrder ? (
            <>
              <span>Adicionar</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </>
          ) : (
            <span className="w-full">Loja fechada no momento</span>
          )}
        </Button>
      </div>
    </>
  );
}
