import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

import { env } from "@/config/env";
import { readStorage, writeStorage } from "@/lib/storage";

const DISMISSED_KEY = "demo-banner-dismissed";
const isTrue = (value: unknown): value is true => value === true;

export function DemoBanner({ slug }: { slug: string }) {
  const [visible, setVisible] = useState(() => !readStorage(DISMISSED_KEY, isTrue));
  if (!visible || !env.demoSlug || slug !== env.demoSlug) return null;

  function dismiss() {
    writeStorage(DISMISSED_KEY, true);
    setVisible(false);
  }

  return (
    <div className="flex items-center gap-3 border-b bg-foreground py-2 pr-2 pl-4 text-xs text-background/75 dark:bg-card dark:text-muted-foreground">
      <p className="mx-auto">
        Loja de demonstração. Faça um pedido e veja ele chegar no{" "}
        <a
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-semibold text-background underline-offset-4 dark:text-foreground hover:underline"
        >
          painel do restaurante
          <ArrowUpRight className="size-3.5" />
        </a>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar aviso"
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-background/60 transition-colors hover:bg-background/10 hover:text-background dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
