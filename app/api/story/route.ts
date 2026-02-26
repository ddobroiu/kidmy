import { NextRequest, NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { animalName, description } = await req.json();

        if (!animalName) {
            return NextResponse.json({ error: "Numele animalului este obligatoriu!" }, { status: 400 });
        }

        console.log(`Generating story for: ${animalName}`);

        const output = await replicate.run(
            "meta/meta-llama-3-8b-instruct",
            {
                input: {
                    prompt: `Scrie o poveste scurtă, magică și educativă (maxim 4-5 propoziții) pentru copii despre un animal numit "${animalName}". 
                    Descrierea animalului este: "${description}". 
                    Tonul trebuie să fie cald, prietenos și plin de mirare. 
                    Povestea trebuie să fie în limba ROMÂNĂ. 
                    Începe direct cu povestea, fără introduceri gen "Iată o poveste".`,
                    max_tokens: 256,
                    temperature: 0.7
                }
            }
        );

        const story = Array.isArray(output) ? output.join("").trim() : String(output).trim();

        return NextResponse.json({ story });

    } catch (error: any) {
        console.error("Story Generation Error:", error);
        return NextResponse.json({ error: error.message || "Eroare la generarea poveștii" }, { status: 500 });
    }
}
