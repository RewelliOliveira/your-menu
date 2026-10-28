import { Router } from "express";

import { authRoutes } from "./auth-routes";
import { financeRoutes } from "./finance-routes";
import { categoryRoutes, dishRoutes, menuRoutes } from "./menu-routes";
import { orderRoutes } from "./order-routes";
import { deliveryZoneRoutes, restaurantRoutes } from "./restaurant-routes";
import { storefrontRoutes } from "./storefront-routes";
import { uploadRoutes } from "./upload-routes";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
routes.use("/auth", authRoutes);
routes.use("/storefronts", storefrontRoutes);
routes.use("/uploads", uploadRoutes);
routes.use("/restaurant", restaurantRoutes);
routes.use("/delivery-zones", deliveryZoneRoutes);
routes.use("/orders", orderRoutes);
routes.use("/finance", financeRoutes);
routes.use("/menu", menuRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/dishes", dishRoutes);
