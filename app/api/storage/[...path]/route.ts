
import { NextRequest, NextResponse } from "next/server";
import { r2, UPLOAD_BUCKET } from "@/lib/r2";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    try {
        const path = (await params).path.join("/");
        const fileKey = path;

        if (!fileKey) {
            return new NextResponse("Missing file key", { status: 400 });
        }

        console.log(`Proxying download from R2 for: ${fileKey}`);

        // Fetch from R2 using S3 client
        const file = await r2.getObject({
            Bucket: UPLOAD_BUCKET,
            Key: fileKey,
        }).promise();

        if (!file.Body) {
            return new NextResponse("File not found", { status: 404 });
        }

        const buffer = Buffer.from(file.Body as Buffer);

        const headers = new Headers();
        headers.set("Content-Type", file.ContentType || "application/octet-stream");
        headers.set("Content-Length", buffer.length.toString());
        headers.set("Cache-Control", "public, max-age=31536000, mutable");

        return new NextResponse(buffer, {
            status: 200,
            headers: headers
        });

    } catch (error: any) {
        console.error("Storage Proxy Error:", error);
        if (error.code === 'NoSuchKey') {
            return new NextResponse("File not found", { status: 404 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
