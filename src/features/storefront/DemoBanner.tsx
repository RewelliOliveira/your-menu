import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

import { readStorage, writeStorage } from "@/lib/storage";

const DISMISSED_KEY = "demo-banner-dismissed";
const isTrue = (value: unknown): value is true => value === true;

export function DemoBanner() {
  const [visible, setVisible] = useState(() => !readStorage(DISMISSED_KEY, isTrue));
  if (!visible) return null;

  function dismiss() {
    writeStorage(DISMISSED_KEY, true);
    setVisible(false);
  }

  return (
    <div className="flex items-center gap-3 bg-zinc-900 py-2 pr-2 pl-4 text-xs text-zinc-300">
      <p className="mx-auto">
        Loja de demonstração. Faça um pedido e veja ele chegar no{" "}
        <a
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-semibold text-white underline-offset-4 hover:underline"
        >
          painel do restaurante
          <ArrowUpRight className="size-3.5" />
        </a>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar aviso"
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
