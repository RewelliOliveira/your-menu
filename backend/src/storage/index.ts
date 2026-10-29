import { env } from "../config/env";
import { databaseStorage } from "./database-storage";
import type { StorageProvider } from "./storage-provider";

const providers: Record<typeof env.STORAGE_DRIVER, StorageProvider> = {
  database: databaseStorage,
};

export const storage = providers[env.STORAGE_DRIVER];
