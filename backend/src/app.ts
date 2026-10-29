import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { ensureDatabase } from "./middlewares/ensure-database";
import { errorHandler, notFound } from "./middlewares/error-handler";
import { routes } from "./routes";

export const app = express();

const allowedOrigins: (string | RegExp)[] = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

if (env.NODE_ENV === "development") {
  allowedOrigins.push(/^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
}

app.set("trust proxy", true);
app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigins.includes("*") ? true : allowedOrigins }));
app.use(express.json({ limit: "100kb" }));
app.use(ensureDatabase);
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);
