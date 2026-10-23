import { ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { formatCurrency } from "@/lib/format";
import { useCart } from "./cart-context";

export function CartBar({ onOpen }: { onOpen: () => void }) {
  const { count, subtotal } = useCart();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="pb-safe fixed inset-x-0 bottom-0 z-30 px-4 pt-4 sm:pb-6"
        >
          <button
            type="button"
            onClick={onOpen}
            className="mx-auto flex w-full max-w-lg cursor-pointer items-center gap-3 rounded-2xl bg-primary px-4 py-3.5 text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <span className="relative">
              <ShoppingBag className="size-6" />
              <motion.span
                key={count}
                initial={{ scale: 1.6 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-primary"
              >
                {count}
              </motion.span>
            </span>
            <span className="flex-1 text-left text-sm font-bold">Ver sacola</span>
            <span className="text-base font-bold tabular-nums">{formatCurrency(subtotal)}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
