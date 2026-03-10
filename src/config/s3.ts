import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const { AWS_S3_REGION = '', AWS_S3_ACCESS_KEY_ID = '', AWS_S3_SECRET_ACCESS_KEY = '', SUPABASE_STORAGE_URL = '' } = process.env;

export const s3Client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: AWS_S3_SECRET_ACCESS_KEY
  },
  endpoint: SUPABASE_STORAGE_URL, forcePathStyle: true
})