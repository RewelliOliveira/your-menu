import { Navigate, createBrowserRouter } from "react-router-dom";

import { PageLoader } from "@/components/shared/PageLoader";
import {
  RedirectIfAuthenticated,
  RequireAuth,
} from "@/features/auth/RequireAuth";
import { NotFoundPage } from "./NotFoundPage";
import { RootLayout, RouteError } from "./RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    hydrateFallbackElement: <PageLoader className="min-h-dvh" />,
    children: [
      { path: "/", element: <Navigate to="/admin" replace /> },
      {
        path: "/admin",
        children: [
          {
            element: <RedirectIfAuthenticated />,
            children: [
              {
                path: "login",
                lazy: () =>
                  import("@/features/auth/LoginPage").then((m) => ({
                    Component: m.LoginPage,
                  })),
              },
              {
                path: "register",
                lazy: () =>
                  import("@/features/auth/RegisterPage").then((m) => ({
                    Component: m.RegisterPage,
                  })),
              },
            ],
          },
          {
            element: <RequireAuth />,
            children: [
              {
                lazy: () =>
                  import("@/features/admin/AdminLayout").then((m) => ({
                    Component: m.AdminLayout,
                  })),
                children: [
                  { index: true, element: <Navigate to="orders" replace /> },
                  {
                    path: "orders",
                    lazy: () =>
                      import("@/features/admin/orders/OrdersPage").then(
                        (m) => ({ Component: m.OrdersPage }),
                      ),
                  },
                  {
                    path: "menu",
                    lazy: () =>
                      import("@/features/admin/menu/MenuPage").then((m) => ({
                        Component: m.MenuPage,
                      })),
                  },
                  {
                    path: "menu/new",
                    lazy: () =>
                      import("@/features/admin/menu/DishFormPage").then(
                        (m) => ({ Component: m.DishFormPage }),
                      ),
                  },
                  {
                    path: "menu/:dishId",
                    lazy: () =>
                      import("@/features/admin/menu/DishFormPage").then(
                        (m) => ({ Component: m.DishFormPage }),
                      ),
                  },
                  {
                    path: "finance",
                    lazy: () =>
                      import("@/features/admin/finance/FinancePage").then(
                        (m) => ({ Component: m.FinancePage }),
                      ),
                  },
                  {
                    path: "settings",
                    lazy: () =>
                      import("@/features/admin/settings/SettingsLayout").then(
                        (m) => ({ Component: m.SettingsLayout }),
                      ),
                    children: [
                      {
                        index: true,
                        element: <Navigate to="profile" replace />,
                      },
                      {
                        path: "profile",
                        lazy: () =>
                          import("@/features/admin/settings/ProfileSettingsPage").then(
                            (m) => ({
                              Component: m.ProfileSettingsPage,
                            }),
                          ),
                      },
                      {
                        path: "address",
                        lazy: () =>
                          import("@/features/admin/settings/AddressSettingsPage").then(
                            (m) => ({
                              Component: m.AddressSettingsPage,
                            }),
                          ),
                      },
                      {
                        path: "delivery",
                        lazy: () =>
                          import("@/features/admin/settings/DeliverySettingsPage").then(
                            (m) => ({
                              Component: m.DeliverySettingsPage,
                            }),
                          ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/:slug",
        lazy: () =>
          import("@/features/storefront/StorefrontLayout").then((m) => ({
            Component: m.StorefrontLayout,
          })),
        children: [
          {
            index: true,
            lazy: () =>
              import("@/features/storefront/MenuPage").then((m) => ({
                Component: m.MenuPage,
              })),
          },
          {
            path: "checkout",
            lazy: () =>
              import("@/features/storefront/checkout/CheckoutPage").then(
                (m) => ({ Component: m.CheckoutPage }),
              ),
          },
          {
            path: "pedido/:trackingCode",
            lazy: () =>
              import("@/features/storefront/order-tracking/OrderTrackingPage").then(
                (m) => ({
                  Component: m.OrderTrackingPage,
                }),
              ),
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
