import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { maskCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<ComponentProps<"input">, "value" | "onChange"> {
  value: string;
  onValueChange: (masked: string) => void;
}

export function CurrencyInput({ value, onValueChange, className, ...props }: CurrencyInputProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-muted-foreground">
        R$
      </span>
      <Input
        inputMode="numeric"
        placeholder="0,00"
        value={value}
        onChange={(event) => onValueChange(maskCurrency(event.target.value))}
        className={cn("pl-10 tabular-nums", className)}
        {...props}
      />
    </div>
  );
}
