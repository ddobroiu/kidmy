import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const purchases = await prisma.purchase.findMany({
            where: {
                userId: session.user.id,
                status: "COMPLETED"
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ purchases });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching history" }, { status: 500 });
    }
}
