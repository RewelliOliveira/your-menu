import multer from "multer";

import { MAX_IMAGE_SIZE } from "../services/upload-service";

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
}).single("file");
