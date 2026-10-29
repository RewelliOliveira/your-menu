import { Router } from "express";

import * as restaurantController from "../controllers/restaurant-controller";
import { authenticate } from "../middlewares/authenticate";

export const restaurantRoutes = Router();

restaurantRoutes.use(authenticate);
restaurantRoutes.get("/", restaurantController.getRestaurant);
restaurantRoutes.put("/", restaurantController.updateProfile);
restaurantRoutes.patch("/status", restaurantController.updateStatus);
restaurantRoutes.get("/hours", restaurantController.getHours);
restaurantRoutes.put("/hours", restaurantController.updateHours);
restaurantRoutes.get("/address", restaurantController.getAddress);
restaurantRoutes.put("/address", restaurantController.updateAddress);

export const deliveryZoneRoutes = Router();

deliveryZoneRoutes.use(authenticate);
deliveryZoneRoutes.get("/", restaurantController.listZones);
deliveryZoneRoutes.post("/", restaurantController.createZone);
deliveryZoneRoutes.put("/:id", restaurantController.updateZone);
deliveryZoneRoutes.delete("/:id", restaurantController.deleteZone);
