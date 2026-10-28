const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

export const ACCEPTED_IMAGE_TYPES = ACCEPTED_TYPES.join(",");

export function validateImageFile(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Envie uma imagem JPG, PNG ou WEBP.";
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `A imagem deve ter no máximo ${MAX_SIZE_MB} MB.`;
  return null;
}

export async function compressImage(file: File, maxSize = 1200, quality = 0.82) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível processar a imagem."))),
      "image/webp",
      quality,
    ),
  );
}
