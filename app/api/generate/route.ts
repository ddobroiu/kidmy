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
            console.log("Converting to 3D using proven version...");
            // Use proven version from 3dview project
            prediction = await replicate.predictions.create({
                version: "e8f6c45206993f297372f5436b90350817bd9b4a0d52d2a76df50c1c8afa2b3c",
                input: {
                    images: [generatedImageUrl],
                    generate_model: true,
                    generate_color: true,
                    save_gaussian_ply: true,
                    randomize_seed: true
                }
            });

        } else if (imageUrl) {
            // Image to 3D directly
            prediction = await replicate.predictions.create({
                version: "e8f6c45206993f297372f5436b90350817bd9b4a0d52d2a76df50c1c8afa2b3c",
                input: {
                    images: [imageUrl],
                    generate_model: true,
                    generate_color: true,
                    save_gaussian_ply: true,
                    randomize_seed: true
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
