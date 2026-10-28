import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error";

const UPLOAD_ERRORS: Partial<Record<MulterError["code"], string>> = {
  LIMIT_FILE_SIZE: "A imagem deve ter no máximo 5 MB.",
  LIMIT_UNEXPECTED_FILE: "Envie apenas uma imagem.",
};

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Rota não encontrada." });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    res.status(error.status).json({ message: error.message });
    return;
  }
  if (error instanceof ZodError) {
    res.status(422).json({ message: error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  if (error instanceof MulterError) {
    res.status(400).json({ message: UPLOAD_ERRORS[error.code] ?? "Não foi possível enviar a imagem." });
    return;
  }
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ message: "Requisição inválida." });
    return;
  }
  console.error(error);
  res.status(500).json({ message: "Erro interno. Tente novamente em instantes." });
}
