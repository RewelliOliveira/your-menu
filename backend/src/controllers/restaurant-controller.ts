import type { Request, Response } from "express";

import { getAuth } from "../middlewares/authenticate";
import * as restaurantService from "../services/restaurant-service";
import { idParam } from "../validators/common";
import { addressSchema, flagsSchema, hoursSchema, profileSchema, zoneSchema } from "../validators/restaurant-validators";

export async function getRestaurant(req: Request, res: Response) {
  res.json(await restaurantService.getMyRestaurant(getAuth(req).restaurantId));
}

export async function updateProfile(req: Request, res: Response) {
  res.json(await restaurantService.updateProfile(getAuth(req).restaurantId, profileSchema.parse(req.body)));
}

export async function updateStatus(req: Request, res: Response) {
  res.json(await restaurantService.updateFlags(getAuth(req).restaurantId, flagsSchema.parse(req.body)));
}

export async function getHours(req: Request, res: Response) {
  res.json(await restaurantService.getHours(getAuth(req).restaurantId));
}

export async function updateHours(req: Request, res: Response) {
  res.json(await restaurantService.updateHours(getAuth(req).restaurantId, hoursSchema.parse(req.body)));
}

export async function getAddress(req: Request, res: Response) {
  res.json(await restaurantService.getAddress(getAuth(req).restaurantId));
}

export async function updateAddress(req: Request, res: Response) {
  res.json(await restaurantService.updateAddress(getAuth(req).restaurantId, addressSchema.parse(req.body)));
}

export async function listZones(req: Request, res: Response) {
  res.json(await restaurantService.getDeliveryZones(getAuth(req).restaurantId));
}

export async function createZone(req: Request, res: Response) {
  res.status(201).json(await restaurantService.createDeliveryZone(getAuth(req).restaurantId, zoneSchema.parse(req.body)));
}

export async function updateZone(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  res.json(await restaurantService.updateDeliveryZone(getAuth(req).restaurantId, id, zoneSchema.parse(req.body)));
}

export async function deleteZone(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  await restaurantService.deleteDeliveryZone(getAuth(req).restaurantId, id);
  res.status(204).end();
}
