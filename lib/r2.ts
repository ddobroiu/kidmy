import { S3 } from "aws-sdk";

export const r2 = new S3({
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    signatureVersion: "v4",
    region: "auto",
});

export const UPLOAD_BUCKET = process.env.R2_BUCKET_NAME || "kidmy-assets";
