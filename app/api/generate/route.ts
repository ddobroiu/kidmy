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
            console.log("Generating base image from text...");

            // Step 1: Generate Image using Flux Pro (reliable URL output)
            // Using predictions.create + polling to ensure we get a clear URL string, not a stream
            const imgPrediction = await replicate.predictions.create({
                model: "black-forest-labs/flux-1.1-pro",
                input: {
                    prompt: `A cute 3d render of ${prompt}, white background, high quality, cartoony style, pixar style, 4k`,
                    width: 1024,
                    height: 1024,
                    aspect_ratio: "1:1",
                    output_format: "png", // Force PNG format 
                    safety_tolerance: 2
                }
            });

            // Poll for image completion
            let generatedImageUrl = "";
            let attempts = 0;
            while (attempts < 60) {
                const status = await replicate.predictions.get(imgPrediction.id);
                if (status.status === 'succeeded' && status.output) {
                    generatedImageUrl = status.output as string;
                    break;
                }
                if (status.status === 'failed' || status.status === 'canceled') {
                    throw new Error("Image generation failed");
                }
                await new Promise(r => setTimeout(r, 1000));
                attempts++;
            }

            if (!generatedImageUrl) throw new Error("Image generation timed out");

            console.log("Image generated successfully:", generatedImageUrl);

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
