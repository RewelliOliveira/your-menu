import { z } from "zod";

export const text = (max: number) => z.string({ error: "Preencha todos os campos obrigatórios." }).max(max, "Texto muito longo.");

export const money = z.number({ error: "Informe um valor válido." }).finite("Informe um valor válido.");

export const imageUrl = z.url({ error: "Imagem inválida." }).max(2048).nullable();

export const idParam = z.object({ id: z.string().min(1).max(64) });

export const slugParam = z.object({ slug: z.string().min(1).max(64) });
