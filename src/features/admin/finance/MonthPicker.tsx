import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { currentMonth, formatMonth, shiftMonth } from "@/lib/month";

export function MonthPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (month: string) => void;
}) {
  const isCurrent = value >= currentMonth();

  return (
    <div className="flex items-center gap-1 rounded-xl border bg-card p-1 shadow-xs">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(shiftMonth(value, -1))}
        aria-label="Mês anterior"
      >
        <ChevronLeft />
      </Button>
      <span
        className="min-w-36 text-center text-sm font-bold"
        aria-live="polite"
      >
        {formatMonth(value)}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(shiftMonth(value, 1))}
        disabled={isCurrent}
        aria-label="Próximo mês"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
