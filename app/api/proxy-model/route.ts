import { NextRequest, NextResponse } from "next/server";
import { r2, UPLOAD_BUCKET } from "@/lib/r2";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing url", { status: 400 });
    }

    try {
        // Detect if it's an R2 URL from our bucket
        const r2PublicDomain = process.env.R2_PUBLIC_DOMAIN || "pub-718687a71676443c97e5967ee3895315.r2.dev";

        if (url.includes(r2PublicDomain) || url.includes("r2.dev")) {
            // Extract the key from the URL
            const urlObj = new URL(url);
            const key = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname;

            console.log(`Proxying private R2 object via SDK: ${key}`);

            const file = await r2.getObject({
                Bucket: UPLOAD_BUCKET,
                Key: key,
            }).promise();

            if (!file.Body) {
                return new NextResponse("File not found in R2", { status: 404 });
            }

            const buffer = Buffer.from(file.Body as Buffer);
            const headers = new Headers();
            headers.set("Content-Type", file.ContentType || "model/gltf-binary");
            headers.set("Content-Length", buffer.length.toString());
            headers.set("Access-Control-Allow-Origin", "*");
            headers.set("Cache-Control", "public, max-age=31536000, mutable");

            return new NextResponse(buffer, {
                status: 200,
                headers: headers
            });
        }

        // Fallback for non-R2 URLs
        const response = await fetch(url);

        if (!response.ok) {
            return new NextResponse(`Failed to fetch source: ${response.statusText}`, { status: response.status });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const headers = new Headers();
        headers.set("Content-Type", response.headers.get("Content-Type") || "model/gltf-binary");
        headers.set("Content-Length", buffer.length.toString());
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Cache-Control", "public, max-age=31536000, mutable");

        return new NextResponse(buffer, {
            status: 200,
            headers: headers
        });

    } catch (error: any) {
        console.error("Proxy error:", error);
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
}
