import { NextRequest, NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";
import { r2, UPLOAD_BUCKET } from "@/lib/r2";
import { prisma } from "@/lib/db";

// Force dynamic since we use Request
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { prompt, imageUrl, mode } = await req.json();

        // 1. Basic Validation
        if (!prompt && !imageUrl) {
            return NextResponse.json({ error: "Ai nevoie de un text sau o imagine!" }, { status: 400 });
        }

        console.log(`Starting generation. Mode: ${mode}, Prompt: ${prompt}`);

        let prediction;

        // 2. Text to 3D Generation (using Trellis or similar fast model)
        if (mode === 'text' && prompt) {
            // Step A: Text-to-Image first (Flux)
            // Step B: Image-to-3D (Trellis)
            // For speed/demo, we use a direct Text-to-3D or standard workflow if available
            // Or we generate an image first. Let's start with a high quality Image generation.

            console.log("Generating base image from text...");
            const imagePrediction = await replicate.run(
                "black-forest-labs/flux-schnell", // Fast & Good
                {
                    input: {
                        prompt: `A cute 3d render of ${prompt}, white background, high quality, cartoony style, pixar style, 4k`,
                        go_fast: true,
                        num_outputs: 1
                    }
                }
            );

            const generatedImageUrl = (imagePrediction as string[])[0]; // Output is array of URLs
            console.log("Image generated:", generatedImageUrl);

            // Now convert this image to 3D
            console.log("Converting to 3D...");
            prediction = await replicate.predictions.create({
                version: "59dd024346fa44b4131af668277259f9351475c742c38848a624f220377227c2", // Trellis (State of the art, fast)
                input: {
                    image: generatedImageUrl,
                    texture_size: 1024,
                    mesh_simplify: 0.95 // Optimize for mobile AR
                }
            });

        } else if (imageUrl) {
            // Image to 3D directly
            prediction = await replicate.predictions.create({
                version: "59dd024346fa44b4131af668277259f9351475c742c38848a624f220377227c2", // Trellis
                input: {
                    image: imageUrl,
                    texture_size: 1024,
                    mesh_simplify: 0.95
                }
            });
        }

        // 3. Save initial record to DB (Optional, skipping for speed in MVP)

        return NextResponse.json({
            id: prediction?.id,
            status: prediction?.status
        });

    } catch (error: any) {
        console.error("Generation Error:", error);
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}
