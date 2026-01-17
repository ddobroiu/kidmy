import { NextRequest, NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";
import { r2, UPLOAD_BUCKET } from "@/lib/r2";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const generationId = searchParams.get("generationId"); // We need this to update DB

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    try {
        const prediction = await replicate.predictions.get(id);

        if (prediction.status === "succeeded") {
            // Extract model URL (depends on model, usually prediction.output.model_file)
            // Trellis/Meshy output usually has { model_file: "url...", ... } or just "url"
            const output = prediction.output as any;
            const modelUrl = typeof output === 'string' ? output : (output?.model_file || output);

            // If we have a generationId and a valid modelUrl, let's process it
            if (generationId && modelUrl) {
                // Check if already completed to avoid re-uploading
                const existing = await prisma.generation.findUnique({
                    where: { id: generationId },
                    select: { status: true, modelUrl: true }
                });

                if (existing && existing.status === "COMPLETED") {
                    return NextResponse.json({
                        status: "succeeded",
                        output: { model_file: existing.modelUrl }
                    });
                }

                // Download from Replicate
                console.log(`Downloading model from: ${modelUrl}`);
                const response = await fetch(modelUrl);
                if (!response.ok) throw new Error("Failed to download model from Replicate");
                const buffer = Buffer.from(await response.arrayBuffer());

                // Upload to R2
                const fileKey = `generations/${generationId}.glb`;
                console.log(`Uploading to R2: ${fileKey}`);

                await r2.putObject({
                    Bucket: UPLOAD_BUCKET,
                    Key: fileKey,
                    Body: buffer,
                    ContentType: "model/gltf-binary",
                    ACL: "public-read", // Ensure accessible if bucket is public
                }).promise();

                // Construct Public URL (Use Internal Proxy to bypass R2 public access issues)
                // e.g. https://www.kidmy.ro/api/storage/generations/xyz.glb
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.kidmy.ro";
                const publicUrl = `${baseUrl}/api/storage/${fileKey}`;

                // Update DB
                await prisma.generation.update({
                    where: { id: generationId },
                    data: {
                        status: "COMPLETED",
                        modelUrl: publicUrl,
                        completedAt: new Date(),
                    }
                });

                return NextResponse.json({
                    status: "succeeded",
                    output: { model_file: publicUrl } // Return local proxy URL
                });
            }

            return NextResponse.json({
                status: "succeeded",
                output: prediction.output
            });
        } else if (prediction.status === "failed" || prediction.status === "canceled") {

            if (generationId) {
                await prisma.generation.update({
                    where: { id: generationId },
                    data: { status: "FAILED", errorMessage: prediction.error?.toString() }
                });
            }

            return NextResponse.json({ status: "failed", error: prediction.error });
        } else {
            return NextResponse.json({ status: "processing" });
        }

    } catch (error: any) {
        console.error("Status check error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
