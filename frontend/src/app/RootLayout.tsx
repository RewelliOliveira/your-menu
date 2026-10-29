import { Outlet, ScrollRestoration, useRouteError } from "react-router-dom";

import { ErrorState } from "@/components/shared/ErrorState";

export function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export function RouteError() {
  const error = useRouteError();
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <ErrorState error={error} onRetry={() => window.location.reload()} />
    </div>
  );
}
