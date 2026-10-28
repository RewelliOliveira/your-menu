import { NavLink, Outlet } from "react-router-dom";
import { Bike, MapPin, Store } from "lucide-react";

import { cn } from "@/lib/utils";
import { PageHeader } from "../PageHeader";

const TABS = [
  { to: "profile", label: "Perfil e horários", icon: Store },
  { to: "address", label: "Endereço", icon: MapPin },
  { to: "delivery", label: "Entrega", icon: Bike },
];

export function SettingsLayout() {
  return (
    <div className="space-y-6">
      <PageHeader title="Ajustes" />

      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0" aria-label="Seções de ajustes">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
