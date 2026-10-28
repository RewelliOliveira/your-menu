import { z } from "zod";

import { TRANSACTION_TYPES } from "../domain/finance";
import { money, text } from "./common";

export const monthQuery = z.object({ month: z.string({ error: "Mês inválido." }) });

export const transactionSchema = z.object({
  type: z.enum(TRANSACTION_TYPES, { error: "Categoria inválida." }),
  category: text(60),
  description: text(200),
  amount: money,
  date: text(10),
});
