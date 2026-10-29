import { randomUUID } from "node:crypto";

export const createId = () => randomUUID();

export const nowIso = () => new Date().toISOString();
