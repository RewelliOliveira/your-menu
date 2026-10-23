import { useCallback, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ChevronsUpDown,
  ClipboardList,
  ExternalLink,
  LogOut,
  MoreVertical,
  RotateCcw,
  Settings,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { FoodImage } from "@/components/shared/FoodImage";
import { Logo } from "@/components/shared/Logo";
import { PageLoader } from "@/components/shared/PageLoader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/utils";
import { resetDemoData } from "@/services/demo-service";
import { getMyRestaurant } from "@/services/restaurant-service";
import type { Restaurant } from "@/types/restaurant";
import { useAuth } from "../auth/auth-context";
import { ThemeToggle } from "../theme/ThemeToggle";
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
      <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
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

function AccountMenuItems({
  restaurant,
  onReset,
}: {
  restaurant: Restaurant;
  onReset: () => void;
}) {
  const { logout } = useAuth();

  return (
    <>
      <DropdownMenuItem asChild>
        <a
          href={getStorefrontUrl(restaurant.slug)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink /> Ver cardápio online
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onReset}>
        <RotateCcw /> Restaurar dados de demonstração
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onSelect={logout}>
        <LogOut /> Sair
      </DropdownMenuItem>
    </>
  );
}

function ResetDemoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Restaurar dados de demonstração?"
      description="Pedidos, cardápio, ajustes e movimentações voltam ao estado inicial. Você continua conectado."
      confirmLabel="Restaurar"
      destructive
      onConfirm={resetDemoData}
    />
  );
}

function Sidebar() {
  const { restaurant } = useAdminRestaurant();
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r bg-card px-4 py-5 lg:flex">
      <div className="flex items-center justify-between pl-2">
        <Logo className="h-6" />
        <ThemeToggle className="size-8" />
      </div>

      <StoreStatusSwitch />

      <nav className="flex flex-col gap-0.5" aria-label="Navegação do painel">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-muted"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon
                  className={cn("relative size-4.5", isActive && "text-primary")}
                />
                <span className="relative">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger className="mt-auto flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-muted">
          <FoodImage
            src={restaurant.logoUrl}
            alt=""
            className="size-8 shrink-0 rounded-md"
          />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {restaurant.name}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-72">
          <AccountMenuItems
            restaurant={restaurant}
            onReset={() => setResetOpen(true)}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <ResetDemoDialog open={resetOpen} onOpenChange={setResetOpen} />
    </aside>
  );
}

function MobileHeader() {
  const { restaurant } = useAdminRestaurant();
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-card/90 px-4 py-2.5 backdrop-blur-lg lg:hidden">
      <div className="flex min-w-0 items-center gap-2.5">
        <FoodImage
          src={restaurant.logoUrl}
          alt=""
          className="size-8 shrink-0 rounded-md"
        />
        <p className="truncate text-sm font-semibold">{restaurant.name}</p>
      </div>
      <div className="flex items-center gap-1">
        <StoreStatusSwitch compact />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Mais opções">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <AccountMenuItems
              restaurant={restaurant}
              onReset={() => setResetOpen(true)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ResetDemoDialog open={resetOpen} onOpenChange={setResetOpen} />
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
              "relative flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition-colors",
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
