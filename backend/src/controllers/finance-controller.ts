import type { Request, Response } from "express";

import { getAuth } from "../middlewares/authenticate";
import * as financeService from "../services/finance-service";
import { idParam } from "../validators/common";
import { monthQuery, transactionSchema } from "../validators/finance-validators";

export async function getReport(req: Request, res: Response) {
  const { month } = monthQuery.parse(req.query);
  res.json(await financeService.getFinanceReport(getAuth(req).restaurantId, month));
}

export async function getLedger(req: Request, res: Response) {
  const { month } = monthQuery.parse(req.query);
  res.json(await financeService.getLedger(getAuth(req).restaurantId, month));
}

export async function createTransaction(req: Request, res: Response) {
  res.status(201).json(await financeService.createTransaction(getAuth(req).restaurantId, transactionSchema.parse(req.body)));
}

export async function updateTransaction(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  res.json(await financeService.updateTransaction(getAuth(req).restaurantId, id, transactionSchema.parse(req.body)));
}

export async function deleteTransaction(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  await financeService.deleteTransaction(getAuth(req).restaurantId, id);
  res.status(204).end();
}
