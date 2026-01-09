import { NextRequest, NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    try {
        const prediction = await replicate.predictions.get(id);

        if (prediction.status === "succeeded") {
            // Trellis output format usually contains 'model_file' (glb)
            return NextResponse.json({
                status: "succeeded",
                output: prediction.output // Contains .glb url
            });
        } else if (prediction.status === "failed" || prediction.status === "canceled") {
            return NextResponse.json({ status: "failed", error: prediction.error });
        } else {
            return NextResponse.json({ status: "processing" });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
