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
        "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all",
        selected ? "border-primary bg-accent/50 ring-1 ring-primary" : "hover:bg-muted/60",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{title}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
      {aside}
      <RadioGroupItem value={value} className="sr-only" />
    </label>
  );
}
