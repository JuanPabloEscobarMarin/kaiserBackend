import ResourcesServices from "../services/resources.services.ts";
import type { Request, Response } from "express";

class ResourcesController {
    getImageBySlug = async (req: Request, res: Response) => {
        try {
            const stream = await ResourcesServices.imageBySlug(req.params.slug);
            res.setHeader('Content-Type', 'image/webp');
            return stream.pipe(res);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    storeImage = async (req: Request, res: Response) => {
        try {
            const response = await ResourcesServices.storeImage(req.file);
            return res.json({ message: `Successfully uploaded object. ETag: ${response.ETag}` });
        } catch (err) {
            console.error('Error uploading file:', err);
            return res.json({ error: 'Error uploading file' })
        }
    }
}

export default new ResourcesController();