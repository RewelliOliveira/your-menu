import { useNavigate, useParams } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { EmptyState } from "@/components/shared/EmptyState";
import { FoodImage } from "@/components/shared/FoodImage";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/format";
import { useStorefront } from "../storefront-context";
import { useCart } from "./cart-context";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { lines, subtotal, setQuantity, clear } = useCart();
  const { restaurant } = useStorefront();
  const { slug } = useParams();
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sua sacola</SheetTitle>
          <SheetDescription>{restaurant.name}</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Sua sacola está vazia"
            description="Adicione itens do cardápio para fazer seu pedido."
            className="flex-1"
          />
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-5">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <motion.li
                    key={line.key}
                    layout
                    exit={{ opacity: 0, x: 40 }}
                    className="flex gap-3 py-4"
                  >
                    <FoodImage src={line.dish.imageUrl} alt={line.dish.name} className="size-16 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-sm font-bold">{line.dish.name}</p>
                      <p className="text-xs text-muted-foreground">{line.variant.label}</p>
                      {line.note && <p className="line-clamp-2 text-xs text-muted-foreground italic">"{line.note}"</p>}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-bold tabular-nums">{formatCurrency(line.total)}</span>
                        <QuantityStepper
                          size="sm"
                          value={line.quantity}
                          onChange={(quantity) => setQuantity(line.key, quantity)}
                          min={1}
                          removable
                        />
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <SheetFooter>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">A taxa de entrega é calculada na próxima etapa.</p>
              <Button
                size="lg"
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/${slug}/checkout`);
                }}
                disabled={!restaurant.isOpen}
              >
                {restaurant.isOpen ? "Continuar" : "Loja fechada no momento"}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clear}>
                Esvaziar sacola
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
