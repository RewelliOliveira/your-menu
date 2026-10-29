import { z } from "zod";

import { text } from "./common";

export const loginSchema = z.object({
  email: text(120),
  password: text(128),
});

export const registerSchema = loginSchema.extend({
  name: text(80),
  restaurantName: text(60),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
