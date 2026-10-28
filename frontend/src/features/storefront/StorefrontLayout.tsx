import { useCallback, useEffect, useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageLoader } from "@/components/shared/PageLoader";
import { useAsync } from "@/hooks/use-async";
import { useNow } from "@/hooks/use-now";
import { isAcceptingOrders } from "@/lib/business-hours";
import { isNotFound } from "@/services/api-error";
import { getPublicMenu } from "@/services/menu-service";
import { getStorefront } from "@/services/restaurant-service";
import { NotFoundPage } from "@/app/NotFoundPage";
import { CartProvider } from "./cart/CartProvider";
import { DemoBanner } from "./DemoBanner";
import { StorefrontContext } from "./storefront-context";

const REFRESH_INTERVAL = 60_000;

export function StorefrontLayout() {
  const { slug = "" } = useParams();
  const fetcher = useCallback(() => Promise.all([getStorefront(slug), getPublicMenu(slug)]), [slug]);
  const { data, error, reload } = useAsync(fetcher, { pollInterval: REFRESH_INTERVAL });

  const now = useNow();

  const value = useMemo(() => {
    if (!data) return null;
    const [storefront, menu] = data;
    const acceptingOrders = isAcceptingOrders(storefront.restaurant, storefront.hours, new Date(now));
    return { ...storefront, menu, acceptingOrders };
  }, [data, now]);

  useEffect(() => {
    if (value) document.title = `${value.restaurant.name} · Cardápio`;
    return () => {
      document.title = "Your Menu";
    };
  }, [value]);

  if (isNotFound(error)) return <NotFoundPage message="Não encontramos esse restaurante." />;
  if (error && !value) return <ErrorState error={error} onRetry={() => reload()} />;
  if (!value) return <PageLoader className="min-h-dvh" />;

  return (
    <StorefrontContext.Provider value={value}>
      <CartProvider key={slug} slug={slug} menu={value.menu}>
        <DemoBanner slug={slug} />
        <Outlet />
      </CartProvider>
    </StorefrontContext.Provider>
  );
}
