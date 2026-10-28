import type { Request, Response } from "express";

import { getAuth } from "../middlewares/authenticate";
import * as authService from "../services/auth-service";
import { loginSchema, registerSchema } from "../validators/auth-validators";

export async function register(req: Request, res: Response) {
  res.status(201).json(await authService.register(registerSchema.parse(req.body)));
}

export async function login(req: Request, res: Response) {
  res.json(await authService.login(loginSchema.parse(req.body)));
}

export async function me(req: Request, res: Response) {
  const { userId, restaurantId } = getAuth(req);
  res.json({ user: await authService.getCurrentUser(userId), restaurantId });
}
