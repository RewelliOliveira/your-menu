import { compressImage, validateImageFile } from "@/lib/image";
import { ApiError } from "./api-error";
import { http } from "./http-client";

export async function uploadImage(file: File, maxSize?: number) {
  const error = validateImageFile(file);
  if (error) throw new ApiError(error);

  const form = new FormData();
  form.append("file", await compressImage(file, maxSize), "image.webp");
  const { url } = await http.post<{ url: string }>("/uploads", form);
  return url;
}
