
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const items = await prisma.shopItem.findMany({
            where: { isPublic: true },
            orderBy: { createdAt: 'desc' }
        });

        const generations = await prisma.generation.findMany({
            where: { status: "COMPLETED", hostEnabled: true }, // Show only public/hosted generations
            take: 20,
            orderBy: { createdAt: 'desc' }
        });

        // Combine or just return items?
        // Let's return both for now
        return NextResponse.json({ items, generations });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }
}
