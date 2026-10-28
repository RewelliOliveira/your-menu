import type { Request, Response } from "express";

import { getAuth } from "../middlewares/authenticate";
import * as menuService from "../services/menu-service";
import { idParam } from "../validators/common";
import { availabilitySchema, categorySchema, dishSchema } from "../validators/menu-validators";

export async function getMenu(req: Request, res: Response) {
  res.json(await menuService.getMenu(getAuth(req).restaurantId));
}

export async function listCategories(req: Request, res: Response) {
  res.json(await menuService.getCategories(getAuth(req).restaurantId));
}

export async function createCategory(req: Request, res: Response) {
  const { name } = categorySchema.parse(req.body);
  res.status(201).json(await menuService.createCategory(getAuth(req).restaurantId, name));
}

export async function updateCategory(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  const { name } = categorySchema.parse(req.body);
  res.json(await menuService.updateCategory(getAuth(req).restaurantId, id, name));
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  await menuService.deleteCategory(getAuth(req).restaurantId, id);
  res.status(204).end();
}

export async function getDish(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  res.json(await menuService.getDish(getAuth(req).restaurantId, id));
}

export async function createDish(req: Request, res: Response) {
  res.status(201).json(await menuService.createDish(getAuth(req).restaurantId, dishSchema.parse(req.body)));
}

export async function updateDish(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  res.json(await menuService.updateDish(getAuth(req).restaurantId, id, dishSchema.parse(req.body)));
}

export async function updateAvailability(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  const { isAvailable } = availabilitySchema.parse(req.body);
  await menuService.setDishAvailability(getAuth(req).restaurantId, id, isAvailable);
  res.status(204).end();
}

export async function deleteDish(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  await menuService.deleteDish(getAuth(req).restaurantId, id);
  res.status(204).end();
}
