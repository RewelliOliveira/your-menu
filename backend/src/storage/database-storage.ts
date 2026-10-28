import { findUpload, insertUpload } from "../repositories/upload-repository";
import type { StorageProvider } from "./storage-provider";

export const databaseStorage: StorageProvider = {
  save: (restaurantId, file) => insertUpload({ restaurantId, mimeType: file.mimeType, data: file.data }),
  async read(id) {
    const row = await findUpload(id);
    return row ? { mimeType: row.mime_type, data: Buffer.from(row.data) } : null;
  },
};
