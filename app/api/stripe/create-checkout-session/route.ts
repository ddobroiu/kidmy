
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getCreditPackageById } from "@/lib/credit-packages";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-12-15.clover", // Matching the installed type definition
});

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user ID from DB using email to be safe, or assume session.user.id is present
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const { packageId } = body;

        const creditPackage = getCreditPackageById(packageId);

        if (!creditPackage) {
            return NextResponse.json({ error: "Invalid package" }, { status: 400 });
        }

        // Create Purchase record
        const purchase = await prisma.purchase.create({
            data: {
                userId: user.id,
                amount: creditPackage.price,
                credits: creditPackage.credits + (creditPackage.bonus || 0),
                currency: "RON",
                status: "PENDING",
            }
        });

        // Base URL
        const headers = req.headers;
        const origin = headers.get("origin") || headers.get("referer") || process.env.NEXTAUTH_URL || "http://localhost:3000";

        // Create Stripe Checkout Session
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "ron",
                        product_data: {
                            name: `Pachet ${creditPackage.name}`,
                            description: `${creditPackage.credits} credite${creditPackage.bonus ? ` + ${creditPackage.bonus} bonus` : ''}`,
                        },
                        unit_amount: Math.round(creditPackage.price * 100), // RON cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/parents?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/parents?canceled=true`,
            customer_email: user.email!,
            client_reference_id: purchase.id,
            metadata: {
                purchaseId: purchase.id,
                userId: user.id,
                credits: (creditPackage.credits + (creditPackage.bonus || 0)).toString(),
                packageId: creditPackage.id,
            },
        });

        // Update purchase with Stripe Session ID
        await prisma.purchase.update({
            where: { id: purchase.id },
            data: { stripeSessionId: stripeSession.id }
        });

        return NextResponse.json({ url: stripeSession.url });

    } catch (error) {
        console.error("Stripe Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
