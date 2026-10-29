import type { Request, Response } from "express";

import * as menuService from "../services/menu-service";
import * as orderService from "../services/order-service";
import * as restaurantService from "../services/restaurant-service";
import { slugParam } from "../validators/common";
import { createOrderSchema, trackingParams } from "../validators/order-validators";

export async function getStorefront(req: Request, res: Response) {
  const { slug } = slugParam.parse(req.params);
  res.json(await restaurantService.getStorefront(slug));
}

export async function getMenu(req: Request, res: Response) {
  const { slug } = slugParam.parse(req.params);
  res.json(await menuService.getPublicMenu(slug));
}

export async function createOrder(req: Request, res: Response) {
  const { slug } = slugParam.parse(req.params);
  res.status(201).json(await orderService.createOrder(slug, createOrderSchema.parse(req.body)));
}

export async function getOrder(req: Request, res: Response) {
  const { slug, trackingCode } = trackingParams.parse(req.params);
  res.json(await orderService.getOrderByTrackingCode(slug, trackingCode));
}
