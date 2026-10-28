import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import type { AuthContext } from "../types/auth";

interface TokenPayload {
  sub: string;
  rid: string;
  exp: number;
}

export function signToken({ userId, restaurantId }: AuthContext) {
  const token = jwt.sign({ rid: restaurantId }, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
  const { exp } = jwt.decode(token) as TokenPayload;
  return { token, expiresAt: exp * 1000 };
}

export function verifyToken(token: string): AuthContext {
  const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  return { userId: payload.sub, restaurantId: payload.rid };
}
