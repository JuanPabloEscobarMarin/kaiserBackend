import ResourcesServices from "../services/resources.services.ts";
import type { Request, Response } from "express";

class ResourcesController {
  getImageBySlug = async (req: Request, res: Response) => {
    const stream = await ResourcesServices.imageBySlug(req.params.slug);
    res.setHeader("Content-Type", "image/webp");
    return stream.pipe(res);
  };

  storeImage = async (req: Request, res: Response) => {
    const response = await ResourcesServices.storeImage(req.file);
    return res.json({
      message: `Successfully uploaded object. ETag: ${response.ETag}`,
    });
  };
}

export default new ResourcesController();
