import type { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "../errors/app-error";
import { verifyToken } from "../utils/token";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];
  if (scheme !== "Bearer" || !token) throw new UnauthorizedError();
  try {
    req.auth = verifyToken(token);
  } catch {
    throw new UnauthorizedError();
  }
  next();
}

export function getAuth(req: Request) {
  if (!req.auth) throw new UnauthorizedError();
  return req.auth;
}
