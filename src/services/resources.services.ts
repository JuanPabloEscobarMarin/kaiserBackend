import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3.ts";
import type { Readable } from "stream";

class ResourcesServices {
    imageBySlug = async (slug: any) => {
        if (typeof slug !== 'string' || slug.trim() === '') {
            throw Error('Nombre de archivo incorrecto');
        }

        const command = new GetObjectCommand({
            Bucket: 'resources',
            Key: `images/${slug}`,
            ResponseContentType: 'image/webp'
        });

        const response = await s3Client.send(command);

        return response.Body as Readable;
    }

    storeImage = async (file: Express.Multer.File | undefined) => {
        if (!file) throw Error("File is required");

        const command = new PutObjectCommand({
            Bucket: 'resources',
            Key: `images/${file.originalname}`,
            Body: file.buffer,
            ContentType: 'image/*'
        });

        return await s3Client.send(command);
    }
}

export default new ResourcesServices();