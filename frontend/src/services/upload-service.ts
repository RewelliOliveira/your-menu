import { compressImage, validateImageFile } from "@/lib/image";
import { ApiError, delay, requireAuth } from "./mock/db";

export async function uploadImage(file: File, maxSize?: number) {
  requireAuth();
  const error = validateImageFile(file);
  if (error) throw new ApiError(error);
  await delay(300);
  return compressImage(file, maxSize);
}
