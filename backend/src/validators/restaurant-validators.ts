import { z } from "zod";

import { WEEKDAYS } from "../domain/business-hours";
import { imageUrl, money, text } from "./common";

export const profileSchema = z.object({
  name: text(60),
  description: text(300),
  logoUrl: imageUrl,
  bannerUrl: imageUrl,
  deliveryTimeMin: z.number().int("Confira o tempo de entrega.").max(600),
  deliveryTimeMax: z.number().int("Confira o tempo de entrega.").max(600),
  pixKey: text(120),
});

export const flagsSchema = z
  .object({ isOpen: z.boolean(), pickupEnabled: z.boolean() })
  .partial()
  .refine((flags) => Object.keys(flags).length > 0, "Nada para atualizar.");

export const hoursSchema = z
  .array(
    z.object({
      weekday: z.enum(WEEKDAYS),
      isOpen: z.boolean(),
      openingTime: text(5),
      closingTime: text(5),
    }),
  )
  .max(WEEKDAYS.length);

export const addressSchema = z.object({
  cep: text(9),
  state: text(2),
  city: text(80),
  district: text(80),
  street: text(120),
  number: text(10),
  complement: text(60),
  reference: text(120),
});

export const zoneSchema = z.object({
  name: text(60),
  fee: money,
});
