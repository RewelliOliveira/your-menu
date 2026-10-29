import { cn } from "@/lib/utils";

export function Logo({ className, forceLight = false }: { className?: string; forceLight?: boolean }) {
  const classes = cn("h-8 w-auto", className);

  if (forceLight) return <img src="/logo.svg" alt="Your Menu" width={308} height={76} className={classes} />;

  return (
    <>
      <img src="/logo.svg" alt="Your Menu" width={308} height={76} className={cn(classes, "dark:hidden")} />
      <img src="/logo-dark.svg" alt="Your Menu" width={308} height={76} className={cn(classes, "hidden dark:block")} />
    </>
  );
}
