import type { Request, Response } from "express";

import { getAuth } from "../middlewares/authenticate";
import * as orderService from "../services/order-service";
import { orderNumberParam, statusSchema } from "../validators/order-validators";

export async function listOrders(req: Request, res: Response) {
  res.json(await orderService.getRecentOrders(getAuth(req).restaurantId));
}

export async function updateStatus(req: Request, res: Response) {
  const { id } = orderNumberParam.parse(req.params);
  const { status } = statusSchema.parse(req.body);
  res.json(await orderService.updateOrderStatus(getAuth(req).restaurantId, id, status));
}
