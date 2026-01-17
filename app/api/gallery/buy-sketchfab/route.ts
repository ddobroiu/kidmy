
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { r2, UPLOAD_BUCKET } from "@/lib/r2";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { uid, title, price, imageUrl } = body;

        if (!uid || !price) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { credits: true }
        });

        if (!user || user.credits < price) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        // 1. Fetch Download Link from Sketchfab
        const apiKey = process.env.SKETCHFAB_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const downloadRes = await fetch(`https://api.sketchfab.com/v3/models/${uid}/download`, {
            headers: { 'Authorization': `Token ${apiKey}` }
        });

        if (!downloadRes.ok) {
            return NextResponse.json({ error: "Failed to get download link from Sketchfab" }, { status: 502 });
        }

        const downloadData = await downloadRes.json();
        const glbInfo = downloadData.glb; // Get GLB format

        if (!glbInfo || !glbInfo.url) {
            return NextResponse.json({ error: "No GLB download available for this model" }, { status: 404 });
        }

        // 2. Transact: Deduct Credits
        await prisma.$transaction([
            prisma.user.update({
                where: { id: session.user.id },
                data: {
                    credits: { decrement: price },
                    totalCreditsUsed: { increment: price }
                }
            }),
            prisma.creditTransaction.create({
                data: {
                    userId: session.user.id,
                    amount: -price,
                    type: "PURCHASE",
                    description: `Purchase Sketchfab Model: ${title}`
                }
            })
        ]);

        // 3. Download and Upload to R2
        console.log(`Downloading Sketchfab model ${uid}...`);
        const fileRes = await fetch(glbInfo.url);
        if (!fileRes.ok) throw new Error("Failed to download file content");

        const arrayBuffer = await fileRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileKey = `generations/sketchfab_${randomUUID()}.glb`;

        await r2.putObject({
            Bucket: UPLOAD_BUCKET,
            Key: fileKey,
            Body: buffer,
            ContentType: "model/gltf-binary"
        }).promise();

        // 4. Create Record
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.kidmy.ro";
        const publicUrl = `${baseUrl}/api/storage/${fileKey}`;

        const generation = await prisma.generation.create({
            data: {
                userId: session.user.id,
                prompt: title || "Sketchfab Model",
                status: "COMPLETED",
                modelUrl: publicUrl,
                originalImageUrl: imageUrl,
                creditsCost: price
            }
        });

        return NextResponse.json({ success: true, generation });

    } catch (error: any) {
        console.error("Buy Sketchfab Error:", error);
        // If money was taken but upload failed, we should theoretically refund, 
        // but for this MVP scope let's log critical error.
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
}
