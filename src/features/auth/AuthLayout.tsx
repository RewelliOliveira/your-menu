import type { ReactNode } from "react";
import { motion } from "motion/react";

import { Logo } from "@/components/shared/Logo";

const COVER_URL =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop&q=80";

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
    <div className="grid min-h-dvh bg-card lg:grid-cols-[1fr_1.1fr]">
      <main className="flex flex-col px-5 py-8 sm:px-10">
        <Logo className="h-6 self-start" />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="m-auto w-full max-w-sm space-y-7 py-10"
        >
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </motion.div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Your Menu
        </p>
      </main>

      <aside className="relative hidden overflow-hidden bg-zinc-900 lg:block">
        <img
          src={COVER_URL}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
        <p className="absolute right-12 bottom-12 left-12 max-w-md text-lg leading-snug font-medium text-white">
          Cardápio digital, pedidos e financeiro do seu restaurante no mesmo
          lugar.
        </p>
      </aside>
    </div>
  );
}
