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

        const GENERATION_COST = 10;

        // 2. Check Credits
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { credits: true }
        });

        if (!user || user.credits < GENERATION_COST) {
            return NextResponse.json({
                error: "Nu ai suficiente credite! (Ai nevoie de 10 credite)"
            }, { status: 402 }); // 402 Payment Required
        }

        console.log(`Starting generation. Mode: ${mode}, Prompt: ${prompt}`);

        // 3. Deduct Credits (Optimistic)
        await prisma.$transaction([
            prisma.user.update({
                where: { id: session.user.id },
                data: {
                    credits: { decrement: GENERATION_COST },
                    totalCreditsUsed: { increment: GENERATION_COST }
                }
            }),
            prisma.creditTransaction.create({
                data: {
                    userId: session.user.id,
                    amount: -GENERATION_COST,
                    type: "GENERATION_USE",
                    description: `Generare 3D: ${mode === 'text' ? prompt.substring(0, 20) + '...' : 'Imagine'}`
                }
            })
        ]);

        let prediction;
        let finalPrompt = prompt;
        let sourceImage = imageUrl;
        let generation: any;

        try {
            // 4. Text to 3D Generation
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

            // 5. Save initial record to DB
            if (prediction) {
                generation = await prisma.generation.create({
                    data: {
                        userId: session.user.id,
                        prompt: finalPrompt,
                        originalImageUrl: sourceImage,
                        status: "PROCESSING",
                        creditsCost: GENERATION_COST
                    }
                });
            }
        } catch (error: any) {
            // REFUND if generation failed launch
            console.error("Generation Start Failed, Refunding...", error);
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: session.user.id },
                    data: {
                        credits: { increment: GENERATION_COST },
                        totalCreditsUsed: { decrement: GENERATION_COST }
                    }
                }),
                prisma.creditTransaction.create({
                    data: {
                        userId: session.user.id,
                        amount: GENERATION_COST,
                        type: "REFUND",
                        description: "Refund: Failed Generation Start"
                    }
                })
            ]);
            throw error; // Re-throw to be caught by outer catch
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
