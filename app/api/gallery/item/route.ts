
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { r2, UPLOAD_BUCKET } from "@/lib/r2";

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        // 1. Verify ownership and get model URL
        const generation = await prisma.generation.findUnique({
            where: { id },
            select: { userId: true, modelUrl: true }
        });

        if (!generation) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        if (generation.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Delete from R2
        if (generation.modelUrl) {
            // Extract Key from URL. 
            // URL format: https://[domain]/generations/[id].glb
            // We stored it as `generations/${generationId}.glb`
            // Let's rely on the Key construction we used during upload:
            const fileKey = `generations/${id}.glb`;

            console.log(`Deleting from R2: ${fileKey}`);
            try {
                await r2.deleteObject({
                    Bucket: UPLOAD_BUCKET,
                    Key: fileKey,
                }).promise();
            } catch (r2Error) {
                console.error("Failed to delete from R2:", r2Error);
                // We proceed to delete from DB even if R2 fails, to keep UI clean
            }
        }

        // 3. Delete from DB
        await prisma.generation.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
