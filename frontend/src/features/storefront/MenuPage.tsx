import { useMemo, useState } from "react";
import { Moon, SearchX } from "lucide-react";
import { motion } from "motion/react";

import { DishCard } from "@/components/shared/DishCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { normalizeText } from "@/lib/format";
import type { Dish } from "@/types/menu";
import { CartBar } from "./cart/CartBar";
import { CartSheet } from "./cart/CartSheet";
import { CategoryNav } from "./CategoryNav";
import { sectionDomId } from "./section-id";
import { DishDialog } from "./DishDialog";
import { RestaurantHero } from "./RestaurantHero";
import { useStorefront } from "./storefront-context";

export function MenuPage() {
  const { acceptingOrders, menu } = useStorefront();
  const [query, setQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const sections = useMemo(() => {
    const term = normalizeText(query);
    if (!term) return menu;
    return menu
      .map((section) => ({
        ...section,
        dishes: section.dishes.filter((dish) => normalizeText(`${dish.name} ${dish.description}`).includes(term)),
      }))
      .filter((section) => section.dishes.length > 0);
  }, [menu, query]);

  return (
    <div className="min-h-dvh pb-32">
      <RestaurantHero />

      {!acceptingOrders && (
        <div className="mx-auto mt-4 max-w-5xl px-4">
          <div className="flex items-center gap-3 rounded-2xl bg-warning p-4 text-sm text-warning-foreground">
            <Moon className="size-5 shrink-0" />
            <p>
              <strong>Estamos fechados agora.</strong> Você pode ver o cardápio, mas os pedidos estão pausados.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <CategoryNav sections={sections} query={query} onQueryChange={setQuery} />
      </div>

      <main className="mx-auto max-w-5xl space-y-10 px-4 pt-6">
        {sections.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nada encontrado"
            description={query ? `Não encontramos itens para "${query}".` : "Este restaurante ainda não publicou o cardápio."}
          />
        ) : (
          sections.map((section) => (
            <section key={section.id} id={sectionDomId(section.id)} className="scroll-mt-40 md:scroll-mt-24">
              <h2 className="mb-4 text-xl font-bold tracking-tight">{section.name}</h2>
              <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                {section.dishes.map((dish, index) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.3, delay: Math.min(index, 4) * 0.04 }}
                  >
                    <DishCard dish={dish} onSelect={() => setSelectedDish(dish)} />
                  </motion.div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <footer className="mx-auto mt-16 max-w-5xl px-4 text-center text-xs text-muted-foreground">
        Cardápio digital por <span className="font-bold text-primary">Your Menu</span>
      </footer>

      <DishDialog dish={selectedDish} canOrder={acceptingOrders} onClose={() => setSelectedDish(null)} />
      <CartBar onOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
