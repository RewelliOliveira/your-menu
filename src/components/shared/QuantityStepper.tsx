import { Minus, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  removable?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  removable = false,
  size = "md",
  className,
}: QuantityStepperProps) {
  const atMin = value <= min;
  const buttonClass = cn(
    "flex cursor-pointer items-center justify-center rounded-full text-primary transition hover:bg-accent disabled:cursor-not-allowed disabled:text-muted-foreground/50 disabled:hover:bg-transparent",
    size === "sm" ? "size-7 [&_svg]:size-3.5" : "size-9 [&_svg]:size-4",
  );

  return (
    <div className={cn("inline-flex items-center rounded-full border bg-card p-0.5", className)}>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={atMin && !removable}
        aria-label={atMin && removable ? "Remover item" : "Diminuir quantidade"}
      >
        {atMin && removable ? <Trash2 /> : <Minus />}
      </button>
      <span className={cn("min-w-7 text-center font-bold tabular-nums", size === "sm" ? "text-sm" : "text-base")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
      >
        <Plus />
      </button>
    </div>
  );
}
