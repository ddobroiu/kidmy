
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

import { auth } from "@/auth";

// Helper to search Sketchfab
async function fetchSketchfab(query: string | null) {
    const apiKey = process.env.SKETCHFAB_API_KEY;
    if (!apiKey) return [];

    try {
        let url = `https://api.sketchfab.com/v3/search?type=models&downloadable=true&sort_by=-likeCount&count=24`;

        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        } else {
            url += `&staffpicked=true`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
            headers: { 'Authorization': `Token ${apiKey}` },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) return [];

        const data = await response.json();

        return (data.results || [])
            .filter((item: any) => item.uid && item.thumbnails)
            .map((item: any) => {
                const glbSize = item.archives?.glb?.size || 0;
                if (glbSize === 0) return null;

                const sizeMB = glbSize / (1024 * 1024);
                let price = 15;
                if (sizeMB > 50) price = 35;
                else if (sizeMB > 20) price = 25;

                return {
                    id: item.uid,
                    title: item.name || "Untitled Model",
                    description: item.description,
                    imageUrl: item.thumbnails?.images?.find((i: any) => i.width >= 300)?.url || item.thumbnails?.images?.[0]?.url || "",
                    author: item.user?.username || "Unknown",
                    price: price,
                    category: "Premium (Sketchfab)",
                    isSketchfab: true,
                    modelUrl: item.uid, // For viewer, we'll need to fetch download URL on demand or proxy
                    isPublic: true,
                    createdAt: item.createdAt || new Date()
                };
            })
            .filter(Boolean);

    } catch (e) {
        console.error("Sketchfab Error:", e);
        return [];
    }
}

export async function GET(req: any) { // Type 'any' or 'NextRequest' if imported
    try {
        const session = await auth();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");

        // 1. Fetch Shop Items (DB)
        const whereClause: any = { isPublic: true };
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [dbItems, sketchfabItems, generations] = await Promise.all([
            prisma.shopItem.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' }
            }),
            fetchSketchfab(search),
            session?.user?.id ? prisma.generation.findMany({
                where: {
                    userId: session.user.id,
                    status: "COMPLETED"
                },
                orderBy: { createdAt: 'desc' }
            }) : Promise.resolve([])
        ]);

        return NextResponse.json({
            items: [...dbItems, ...sketchfabItems],
            generations
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }
}
