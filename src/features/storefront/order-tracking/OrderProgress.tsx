import { Check, ChefHat, Bike, PackageCheck, Receipt, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import type { FulfillmentType, OrderStatus } from "@/types/order";

const FLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "IN_DELIVERY", "DELIVERED"];

function getSteps(fulfillment: FulfillmentType) {
  const steps = [
    { status: "PENDING" as const, label: "Pedido recebido", icon: Receipt },
    { status: "CONFIRMED" as const, label: "Em preparo", icon: ChefHat },
    { status: "IN_DELIVERY" as const, label: "Saiu para entrega", icon: Bike },
    {
      status: "DELIVERED" as const,
      label: fulfillment === "DELIVERY" ? "Entregue" : "Retirado",
      icon: fulfillment === "DELIVERY" ? PackageCheck : ShoppingBag,
    },
  ];
  return fulfillment === "PICKUP" ? steps.filter((step) => step.status !== "IN_DELIVERY") : steps;
}

export function OrderProgress({ status, fulfillment }: { status: OrderStatus; fulfillment: FulfillmentType }) {
  const currentIndex = FLOW.indexOf(status);

  return (
    <ol className="space-y-0">
      {getSteps(fulfillment).map((step, index, steps) => {
        const stepIndex = FLOW.indexOf(step.status);
        const done = stepIndex < currentIndex;
        const current = stepIndex === currentIndex;
        const Icon = done ? Check : step.icon;

        return (
          <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
            {index < steps.length - 1 && (
              <span className="absolute top-10 left-5 h-[calc(100%-2.5rem)] w-0.5 -translate-x-1/2 bg-border">
                <motion.span
                  className="block w-full bg-success"
                  initial={{ height: 0 }}
                  animate={{ height: done ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </span>
            )}
            <span
              className={cn(
                "relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                done && "border-success bg-success text-white",
                current && "border-primary bg-accent text-primary",
                !done && !current && "bg-card text-muted-foreground",
              )}
            >
              {current && <span className="absolute inset-0 animate-ping rounded-full border-2 border-primary/40" />}
              <Icon className="size-5" />
            </span>
            <span className="pt-2.5">
              <span className={cn("block text-sm font-bold", !done && !current && "text-muted-foreground")}>
                {step.label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
