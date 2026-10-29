import { z } from "zod";

import { imageUrl, money, text } from "./common";

export const categorySchema = z.object({ name: text(80) });

export const dishSchema = z.object({
  categoryId: text(64),
  name: text(120),
  description: text(600),
  imageUrl,
  isAvailable: z.boolean(),
  variants: z
    .array(z.object({ id: z.string().max(64).optional().default(""), label: text(80), price: money }))
    .max(20, "Muitas opções para um único prato."),
});

export const availabilitySchema = z.object({ isAvailable: z.boolean() });
