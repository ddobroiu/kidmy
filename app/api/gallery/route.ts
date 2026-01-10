
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();

        // 1. Fetch Shop Items (Always available)
        const items = await prisma.shopItem.findMany({
            where: { isPublic: true },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Fetch User's Generations (Only if logged in)
        let generations: any[] = [];
        if (session?.user?.id) {
            generations = await prisma.generation.findMany({
                where: {
                    userId: session.user.id,
                    status: "COMPLETED"
                },
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json({ items, generations });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }
}
