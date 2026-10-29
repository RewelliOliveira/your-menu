import { AppError, NotFoundError } from "../errors/app-error";
import { storage } from "../storage";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const SIGNATURES: Record<string, (data: Buffer) => boolean> = {
  "image/jpeg": (data) => data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
  "image/png": (data) => data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "image/webp": (data) => data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP",
};

export async function saveImage(restaurantId: string, file: Express.Multer.File | undefined) {
  if (!file) throw new AppError("Envie uma imagem.");
  if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype) || !SIGNATURES[file.mimetype](file.buffer)) {
    throw new AppError("Envie uma imagem JPG, PNG ou WEBP.");
  }
  return storage.save(restaurantId, { mimeType: file.mimetype, data: file.buffer });
}

export async function readImage(id: string) {
  const file = await storage.read(id);
  if (!file) throw new NotFoundError("Imagem não encontrada.");
  return file;
}
