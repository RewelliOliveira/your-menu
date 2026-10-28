import { z } from "zod";

import { ORDER_STATUSES } from "../domain/order-status";
import { money, text } from "./common";

export const createOrderSchema = z.object({
  fulfillment: z.enum(["DELIVERY", "PICKUP"]),
  customer: z.object({ name: text(120), phone: text(30) }),
  address: z
    .object({
      zoneId: text(64),
      cep: text(9),
      street: text(200),
      number: text(20),
      complement: text(120),
      reference: text(200),
    })
    .nullable(),
  paymentMethod: z.enum(["PIX", "CARD", "CASH"], { error: "Forma de pagamento inválida." }),
  changeFor: money.nullable(),
  note: text(500),
  items: z
    .array(
      z.object({
        dishId: text(64),
        variantId: text(64),
        quantity: z.number({ error: "Quantidade inválida." }),
        note: text(300),
      }),
    )
    .max(200, "Sacola inválida."),
});

export const orderNumberParam = z.object({ id: z.coerce.number().int().positive() });

export const trackingParams = z.object({ slug: z.string().min(1).max(64), trackingCode: z.string().min(1).max(64) });

export const statusSchema = z.object({ status: z.enum(ORDER_STATUSES, { error: "Status inválido." }) });
