import Replicate from "replicate";

export const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function translateText(text: string): Promise<string> {
    if (!text || text.trim().length === 0) return text;

    try {
        console.log(`Translating: "${text}"...`);
        const output = await replicate.run(
            "meta/meta-llama-3-8b-instruct",
            {
                input: {
                    prompt: `Translate the following to English (if it is not already). Return ONLY the translated text, nothing else. Text: "${text}"`,
                    max_tokens: 128,
                    temperature: 0.1
                }
            }
        );

        const translation = Array.isArray(output) ? output.join("").trim() : String(output).trim();
        const clean = translation.replace(/^["']|["']$/g, ''); // Remove quotes
        console.log(`Translated: "${clean}"`);
        return clean;

    } catch (e) {
        console.error("Translation Error:", e);
        return text; // Fallback to original
    }
}
