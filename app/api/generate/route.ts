import { NextRequest, NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// Force dynamic since we use Request
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        // Allow generation without login? User wants gallery, so login preferred.
        // For now, if not logged in, we might not save to DB or save with null user?
        // Schema says User relation is required: `userId String`.
        // So we strictly require login for saving to gallery.

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Te rugăm să te autentifici pentru a salva creațiile!" }, { status: 401 });
        }

        const { prompt, imageUrl, mode } = await req.json();

        // 1. Basic Validation
        if (!prompt && !imageUrl) {
            return NextResponse.json({ error: "Ai nevoie de un text sau o imagine!" }, { status: 400 });
        }

        console.log(`Starting generation. Mode: ${mode}, Prompt: ${prompt}`);

        let prediction;
        let finalPrompt = prompt;
        let sourceImage = imageUrl;

        // 2. Text to 3D Generation
        if (mode === 'text' && prompt) {
            console.log("Generating base image from text...");

            // Step 1: Generate Image (Flux)
            const imgPrediction = await replicate.predictions.create({
                model: "black-forest-labs/flux-1.1-pro",
                input: {
                    prompt: `A cute 3d render of ${prompt}, white background, high quality, cartoony style, pixar style, 4k`,
                    width: 1024,
                    height: 1024,
                    aspect_ratio: "1:1",
                    output_format: "png",
                    safety_tolerance: 2
                }
            });

            // Poll for image
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

            sourceImage = generatedImageUrl;
            console.log("Image generated:", generatedImageUrl);

            // Step 2: Image to 3D
            console.log("Converting to 3D...");
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

        // 3. Save initial record to DB
        let generation;
        if (prediction) {
            generation = await prisma.generation.create({
                data: {
                    userId: session.user.id,
                    prompt: finalPrompt,
                    originalImageUrl: sourceImage,
                    status: "PROCESSING",
                    // We can store prediction ID temporarily in hostUrl or just rely on client passing it
                    // But for robustness, let's keep it clean. Client passes IDs.
                }
            });
        }

        return NextResponse.json({
            id: prediction?.id,
            status: prediction?.status,
            generationId: generation?.id
        });

    } catch (error: any) {
        console.error("Generation Error:", error);
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}
