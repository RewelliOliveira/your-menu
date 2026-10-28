export interface StoredFile {
  mimeType: string;
  data: Buffer;
}

export interface StorageProvider {
  save(restaurantId: string, file: StoredFile): Promise<string>;
  read(id: string): Promise<StoredFile | null>;
}
