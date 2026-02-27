import { NextRequest, NextResponse } from "next/server";
import { replicate } from "@/lib/replicate";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { animalName, description } = await req.json();

        if (!animalName) {
            return NextResponse.json({ error: "Numele animalului este obligatoriu!" }, { status: 400 });
        }

        console.log(`Generating facts for: ${animalName}`);

        // 1. Generate text facts using Llama-3
        const textOutput = await replicate.run(
            "meta/meta-llama-3-8b-instruct",
            {
                input: {
                    prompt: `Ești un ghid educațional pentru copii. Spune 3 curiozități fascinante și scurte despre animalul numit "${animalName}". 
                    Descrierea contextului: "${description}". 
                    Tonul trebuie să fie entuziasmat, informativ și prietenos. 
                    Folosește limba ROMÂNĂ. 
                    Fiecare curiozitate trebuie să fie o singură propoziție. 
                    Începe direct cu textul, fără "Iată 3 curiozități" sau alte introduceri.`,
                    max_tokens: 256,
                    temperature: 0.7
                }
            }
        );

        const facts = Array.isArray(textOutput) ? textOutput.join("").trim() : String(textOutput).trim();

        console.log(`Generating AI Voice for facts...`);

        // 2. Generate high-quality voice using XTTS-v2
        // We use a predefined nice speaker for Romanian
        const audioOutput = await replicate.run(
            "lucataco/xtts-v2:68414679e306c59344c9f2003eb760a92b23cc3a083d262ed23528b12f4581a0",
            {
                input: {
                    text: facts,
                    language: "ro",
                    // A friendly reference voice (using a sample URL or a known speaker id if available)
                    speaker: "https://replicate.delivery/pbxt/Jt91NoYvPhZ39z1yBf9zWz9/sample.wav"
                }
            }
        );

        // XTTS usually returns a stream or URL
        const audioUrl = typeof audioOutput === 'string' ? audioOutput : (audioOutput as any)?.audio || (audioOutput as any);

        return NextResponse.json({
            story: facts, // Keep key name "story" for backward compatibility or change to facts
            audioUrl
        });

    } catch (error: any) {
        console.error("AI Assistant Error:", error);
        return NextResponse.json({ error: error.message || "Eroare la generarea informațiilor" }, { status: 500 });
    }
}
