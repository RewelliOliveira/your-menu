import type { ReactNode } from "react";
import { BellRing, Smartphone, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";

import { Logo } from "@/components/shared/Logo";

const HIGHLIGHTS = [
  { icon: UtensilsCrossed, text: "Cardápio digital com a sua cara" },
  { icon: BellRing, text: "Pedidos chegando em tempo real" },
  { icon: Smartphone, text: "Funciona no celular, tablet e computador" },
];

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-40 -left-24 size-112 rounded-full bg-black/10" aria-hidden />

        <div className="relative flex w-fit items-center rounded-2xl bg-white px-4 py-2">
          <Logo className="h-7" />
        </div>

        <div className="relative max-w-md space-y-8">
          <h2 className="text-4xl leading-tight font-extrabold tracking-tight">
            Seu restaurante no digital, sem complicação.
          </h2>
          <ul className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }, index) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                className="flex items-center gap-3 font-medium"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="size-5" />
                </span>
                {text}
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/70">© {new Date().getFullYear()} Your Menu</p>
      </aside>

      <main className="relative flex items-center justify-center px-4 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="space-y-6">
            <div className="lg:hidden">
              <Logo className="h-8" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
