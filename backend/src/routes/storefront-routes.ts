import { Router } from "express";

import * as storefrontController from "../controllers/storefront-controller";

export const storefrontRoutes = Router();

storefrontRoutes.get("/:slug", storefrontController.getStorefront);
storefrontRoutes.get("/:slug/menu", storefrontController.getMenu);
storefrontRoutes.post("/:slug/orders", storefrontController.createOrder);
storefrontRoutes.get("/:slug/orders/:trackingCode", storefrontController.getOrder);
