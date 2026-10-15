import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return <img src="/logo.svg" alt="Your Menu" width={308} height={76} className={cn("h-8 w-auto", className)} />;
}
