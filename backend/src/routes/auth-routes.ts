import { Router } from "express";

import * as authController from "../controllers/auth-controller";
import { authenticate } from "../middlewares/authenticate";

export const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.get("/me", authenticate, authController.me);
