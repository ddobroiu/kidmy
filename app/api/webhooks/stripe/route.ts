import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { oblioService } from "@/lib/oblio";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-12-15.clover" as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const sig = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                if (session.payment_status === "paid") {
                    const purchaseId = session.client_reference_id;
                    const userId = session.metadata?.userId;
                    const creditsStr = session.metadata?.credits;

                    if (!purchaseId || !userId || !creditsStr) {
                        console.error("Missing metadata in webhook:", { purchaseId, userId, creditsStr });
                        break;
                    }

                    const credits = parseInt(creditsStr, 10);

                    // Find purchase and update if PENDING
                    const purchase = await prisma.purchase.findUnique({
                        where: { id: purchaseId }
                    });

                    if (purchase && purchase.status === "PENDING") {
                        // Update purchase status
                        await prisma.purchase.update({
                            where: { id: purchaseId },
                            data: {
                                status: "COMPLETED",
                                completedAt: new Date(),
                            },
                        });

                        // Add credits to user
                        await prisma.user.update({
                            where: { id: userId },
                            data: {
                                credits: { increment: credits },
                            }
                        });

                        // Create transaction record
                        await prisma.creditTransaction.create({
                            data: {
                                userId,
                                amount: credits,
                                type: "PURCHASE",
                                description: `Achiziție credite - ${credits} credite`,
                                purchaseId
                            }
                        });

                        console.log(`Successfully processed purchase ${purchaseId} for user ${userId}: ${credits} credits.`);

                        // === OBLIO INVOICE GENERATION ===
                        try {
                            const billingDetails = await prisma.billingDetails.findUnique({ where: { userId } });

                            if (billingDetails) {
                                const amountTotal = (session.amount_total || 0) / 100;
                                const currency = (session.currency || "RON").toUpperCase();

                                // VAT Logic - ISSUER IS NON-VAT PAYER
                                const vatPercentage = 0;
                                const vatName = "Neplatitor TVA";

                                const invoiceClient = {
                                    cif: billingDetails.cui || "",
                                    name: billingDetails.type === "company" && billingDetails.companyName ? billingDetails.companyName : `${billingDetails.firstName} ${billingDetails.lastName}`,
                                    rc: billingDetails.regCom || "",
                                    address: billingDetails.address,
                                    state: billingDetails.state || billingDetails.city,
                                    city: billingDetails.city,
                                    country: billingDetails.country.toUpperCase(),
                                    email: session.customer_details?.email || undefined,
                                    save: true
                                };

                                const invoice = await oblioService.createInvoice({
                                    currency: currency,
                                    language: "RO",
                                    issueDate: new Date().toISOString().split("T")[0],
                                    dueDate: new Date().toISOString().split("T")[0],
                                    products: [{
                                        name: `Pachet Credite Magice (${credits} Credite)`,
                                        price: parseFloat(amountTotal.toFixed(4)),
                                        quantity: 1,
                                        measuringUnitName: "buc",
                                        currency: currency,
                                        vatName: vatName,
                                        vatPercentage: vatPercentage
                                    }],
                                    client: invoiceClient
                                });

                                if (invoice) {
                                    console.log(`Invoice generated: ${invoice.seriesName} ${invoice.number}`);
                                    await prisma.purchase.update({
                                        where: { id: purchaseId },
                                        data: {
                                            invoiceSeries: invoice.seriesName || "N/A",
                                            invoiceNumber: invoice.number || "N/A",
                                            invoiceUrl: invoice.link || ""
                                        }
                                    });
                                }
                            }
                        } catch (invoiceError) {
                            console.error("Error generating invoice:", invoiceError);
                        }
                    }
                }
                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;
                const purchaseId = session.client_reference_id;

                if (purchaseId) {
                    await prisma.purchase.update({
                        where: { id: purchaseId },
                        data: { status: "FAILED" },
                    });
                }
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
