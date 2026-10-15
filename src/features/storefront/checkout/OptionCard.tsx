import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  value: string;
  selected: boolean;
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
}

export function OptionCard({ value, selected, icon: Icon, title, description, aside }: OptionCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition-colors",
        selected ? "border-foreground ring-1 ring-foreground" : "hover:border-foreground/30",
      )}
    >
      <Icon className={cn("size-5 shrink-0", selected ? "text-foreground" : "text-muted-foreground")} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
      {aside}
      <span
        aria-hidden
        className={cn(
          "flex size-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-primary" : "border-input",
        )}
      >
        {selected && <span className="size-2 rounded-full bg-primary" />}
      </span>
      <RadioGroupItem value={value} className="sr-only" />
    </label>
  );
}
