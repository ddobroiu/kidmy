
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

import { auth } from "@/auth";

export async function GET(req: any) { // Type 'any' or 'NextRequest' if imported
    try {
        const session = await auth();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");

        // 1. Fetch Shop Items (Always available)
        const whereClause: any = { isPublic: true };
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const items = await prisma.shopItem.findMany({
            where: whereClause,
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
