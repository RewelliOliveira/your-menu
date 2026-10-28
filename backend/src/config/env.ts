import { z } from "zod";

try {
  process.loadEnvFile();
} catch {
  void 0;
}

const booleanString = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const defaultDatabaseUrl = process.env.VERCEL ? "/tmp/your-menu.sqlite" : "./data/your-menu.sqlite";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_TIMEZONE: z.string().default("America/Sao_Paulo"),
  PORT: z.coerce.number().int().positive().default(3333),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  PUBLIC_API_URL: z.url().optional(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("8h"),
  DB_CLIENT: z.enum(["sqlite", "postgres"]).default("sqlite"),
  DATABASE_URL: z.string().default(defaultDatabaseUrl),
  STORAGE_DRIVER: z.enum(["database"]).default("database"),
  SEED_DEMO: booleanString,
  DEMO_EMAIL: z.email().default("demo@yourburger.com.br"),
  DEMO_PASSWORD: z.string().min(8).default("demonstracao"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Variáveis de ambiente inválidas: ${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;

process.env.TZ = env.APP_TIMEZONE;
