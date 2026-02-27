import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const billingDetails = await prisma.billingDetails.findUnique({
            where: { userId: session.user.id }
        });

        return NextResponse.json({ billingDetails });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching billing" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        const billingDetails = await prisma.billingDetails.upsert({
            where: { userId: session.user.id },
            update: {
                type: data.type,
                firstName: data.firstName,
                lastName: data.lastName,
                companyName: data.companyName,
                cui: data.cui,
                regCom: data.regCom,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                zip: data.zip,
            },
            create: {
                userId: session.user.id,
                type: data.type,
                firstName: data.firstName,
                lastName: data.lastName,
                companyName: data.companyName,
                cui: data.cui,
                regCom: data.regCom,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                zip: data.zip,
            }
        });

        return NextResponse.json({ billingDetails });
    } catch (error) {
        return NextResponse.json({ error: "Error saving billing" }, { status: 500 });
    }
}
