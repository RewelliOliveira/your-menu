import { useCallback, useMemo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ClipboardList,
  ExternalLink,
  LogOut,
  MoreVertical,
  Settings,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";

import { ErrorState } from "@/components/shared/ErrorState";
import { FoodImage } from "@/components/shared/FoodImage";
import { Logo } from "@/components/shared/Logo";
import { PageLoader } from "@/components/shared/PageLoader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/utils";
import { getMyRestaurant } from "@/services/restaurant-service";
import type { Restaurant } from "@/types/restaurant";
import { useAuth } from "../auth/auth-context";
import {
  AdminRestaurantContext,
  useAdminRestaurant,
} from "./admin-restaurant-context";
import { StoreStatusSwitch } from "./StoreStatusSwitch";

const NAV_ITEMS = [
  { to: "/admin/orders", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/menu", label: "Cardápio", icon: UtensilsCrossed },
  { to: "/admin/finance", label: "Financeiro", icon: Wallet },
  { to: "/admin/settings", label: "Ajustes", icon: Settings },
];

export function AdminLayout() {
  const {
    data: restaurant,
    error,
    reload,
    setData,
  } = useAsync(getMyRestaurant);
  const setRestaurant = useCallback(
    (value: Restaurant) => setData(() => value),
    [setData],
  );
  const contextValue = useMemo(
    () => (restaurant ? { restaurant, setRestaurant } : null),
    [restaurant, setRestaurant],
  );

  if (error) return <ErrorState error={error} onRetry={() => reload()} />;
  if (!contextValue) return <PageLoader className="min-h-dvh" />;

  return (
    <AdminRestaurantContext.Provider value={contextValue}>
      <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
        <Sidebar />
        <MobileHeader />
        <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-12">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </AdminRestaurantContext.Provider>
  );
}

function getStorefrontUrl(slug: string) {
  return `${window.location.origin}/${slug}`;
}

function RestaurantIdentity({
  restaurant,
  size = "md",
}: {
  restaurant: Restaurant;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <FoodImage
        src={restaurant.logoUrl}
        alt={restaurant.name}
        className={cn(
          "shrink-0 rounded-xl border",
          size === "sm" ? "size-9" : "size-11",
        )}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{restaurant.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          /{restaurant.slug}
        </p>
      </div>
    </div>
  );
}

function Sidebar() {
  const { logout } = useAuth();
  const { restaurant } = useAdminRestaurant();
  const storefrontUrl = getStorefrontUrl(restaurant.slug);

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r bg-card p-5 lg:flex">
      <Logo className="h-7 self-start" />

      <div className="space-y-3 rounded-2xl bg-muted/60 p-3">
        <RestaurantIdentity restaurant={restaurant} />
        <StoreStatusSwitch />
      </div>

      <nav className="flex flex-col gap-1" aria-label="Navegação do painel">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon className="relative size-5" />
                <span className="relative">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          asChild
        >
          <a href={storefrontUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-5" /> Ver cardápio online
          </a>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={logout}
        >
          <LogOut className="size-5" /> Sair
        </Button>
      </div>
    </aside>
  );
}

function MobileHeader() {
  const { logout } = useAuth();
  const { restaurant } = useAdminRestaurant();
  const storefrontUrl = getStorefrontUrl(restaurant.slug);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-card/90 px-4 py-3 backdrop-blur-lg lg:hidden">
      <RestaurantIdentity restaurant={restaurant} size="sm" />
      <div className="flex items-center gap-1">
        <StoreStatusSwitch compact />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Mais opções">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{restaurant.name}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <a href={storefrontUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink /> Ver cardápio online
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={logout}>
              <LogOut /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <nav
      className="pb-safe fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-card/95 px-2 pt-2 backdrop-blur-lg lg:hidden"
      aria-label="Navegação do painel"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "relative flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-active"
                  className="absolute -top-2 h-0.5 w-10 rounded-full bg-primary"
                />
              )}
              <Icon className="size-5" />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
