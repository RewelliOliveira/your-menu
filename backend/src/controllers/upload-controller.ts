import type { Request, Response } from "express";

import { env } from "../config/env";
import { getAuth } from "../middlewares/authenticate";
import * as uploadService from "../services/upload-service";
import { idParam } from "../validators/common";

const publicBaseUrl = (req: Request) => env.PUBLIC_API_URL ?? `${req.protocol}://${req.get("host")}/api`;

export async function upload(req: Request, res: Response) {
  const id = await uploadService.saveImage(getAuth(req).restaurantId, req.file);
  res.status(201).json({ url: `${publicBaseUrl(req)}/uploads/${id}` });
}

export async function show(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  const file = await uploadService.readImage(id);
  res
    .set({
      "Content-Type": file.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "cross-origin",
    })
    .send(file.data);
}
