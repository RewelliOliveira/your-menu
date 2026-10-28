import type { NextFunction, Request, Response } from "express";

import { ensureDatabase as prepareDatabase } from "../database/migrate";

export async function ensureDatabase(_req: Request, _res: Response, next: NextFunction) {
  await prepareDatabase();
  next();
}
