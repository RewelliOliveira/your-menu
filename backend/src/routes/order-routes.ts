import { Router } from "express";

import * as orderController from "../controllers/order-controller";
import { authenticate } from "../middlewares/authenticate";

export const orderRoutes = Router();

orderRoutes.use(authenticate);
orderRoutes.get("/", orderController.listOrders);
orderRoutes.patch("/:id/status", orderController.updateStatus);
