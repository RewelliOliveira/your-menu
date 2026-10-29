import { Router } from "express";

import * as menuController from "../controllers/menu-controller";
import { authenticate } from "../middlewares/authenticate";

export const menuRoutes = Router();

menuRoutes.use(authenticate);
menuRoutes.get("/", menuController.getMenu);

export const categoryRoutes = Router();

categoryRoutes.use(authenticate);
categoryRoutes.get("/", menuController.listCategories);
categoryRoutes.post("/", menuController.createCategory);
categoryRoutes.put("/:id", menuController.updateCategory);
categoryRoutes.delete("/:id", menuController.deleteCategory);

export const dishRoutes = Router();

dishRoutes.use(authenticate);
dishRoutes.post("/", menuController.createDish);
dishRoutes.get("/:id", menuController.getDish);
dishRoutes.put("/:id", menuController.updateDish);
dishRoutes.patch("/:id/availability", menuController.updateAvailability);
dishRoutes.delete("/:id", menuController.deleteDish);
