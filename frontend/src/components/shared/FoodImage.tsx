import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";

import { cn } from "@/lib/utils";

interface FoodImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  iconClassName?: string;
}

export function FoodImage({ src, alt, className, iconClassName }: FoodImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div className={cn("flex items-center justify-center bg-accent", className)}>
        <UtensilsCrossed className={cn("size-1/3 max-h-10 max-w-10 text-primary/40", iconClassName)} aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={cn("bg-muted object-cover", className)}
    />
  );
}
