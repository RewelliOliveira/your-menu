import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-h-[60dvh] items-center justify-center", className)} role="status">
      <Loader2 className="size-8 animate-spin text-primary" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
