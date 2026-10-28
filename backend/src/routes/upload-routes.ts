import { Router } from "express";

import * as uploadController from "../controllers/upload-controller";
import { authenticate } from "../middlewares/authenticate";
import { uploadImage } from "../middlewares/upload-image";

export const uploadRoutes = Router();

uploadRoutes.post("/", authenticate, uploadImage, uploadController.upload);
uploadRoutes.get("/:id", uploadController.show);
