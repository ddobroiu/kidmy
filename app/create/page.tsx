"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Pencil, Image as ImageIcon, Rocket, Loader2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });


export default function CreatePage() {
    const [mode, setMode] = useState<"text" | "image">("text");
    const [prompt, setPrompt] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultModel, setResultModel] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setResultModel(null);

        let id, generationId;

        try {
            // 1. Start Generation
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode,
                    prompt: mode === 'text' ? prompt : undefined,
                    imageUrl: mode === 'image' && imageFile ? previewUrl : undefined
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "A apărut o eroare la pornire.");
            }
            const data = await res.json();
            id = data.id;
            generationId = data.generationId;

        } catch (err: any) {
            console.error("Start Error:", err);
            setIsGenerating(false);
            alert(err.message || "Ceva nu a mers bine la pornire.");
            return;
        }

        if (!id || !generationId) {
            setIsGenerating(false);
            alert("Eroare: Nu am primit ID-ul generării.");
            return;
        }

        // 2. Poll for status
        let attempts = 0;
        const maxAttempts = 120; // 6 minutes max

        const interval = setInterval(async () => {
            attempts++;
            try {
                // We use id (from replicate) to check status. generationId is for DB update on server.
                const statusRes = await fetch(`/api/status?id=${id}&generationId=${generationId}`);

                if (!statusRes.ok) {
                    console.error("Status check failed:", statusRes.status, statusRes.statusText);
                    return;
                }

                const data = await statusRes.json();
                console.log("Polling Status:", data.status, data);

                if (data.status === "succeeded") {
                    clearInterval(interval);
                    setIsGenerating(false);

                    // Logic to extract URL
                    // data.output usually is { model_file: "url" } | "url"
                    let finalUrl = undefined;

                    if (typeof data.output === 'string') {
                        finalUrl = data.output;
                    } else if (data.output?.model_file) {
                        finalUrl = data.output.model_file;
                    } else if (data.output && typeof data.output === 'object' && Object.values(data.output).length > 0) {
                        // Fallback: take first value if it's a string, hoping it's the url
                        const potential = Object.values(data.output).find(v => typeof v === 'string');
                        if (potential) finalUrl = potential as string;
                    }

                    if (finalUrl) {
                        console.log("Generation Success. Model URL:", finalUrl);
                        setResultModel(finalUrl);
                    } else {
                        console.error("Succeeded but no URL found in output:", data.output);
                        alert("Generarea a reușit dar nu găsim fișierul. Verifică în Galerie!");
                    }

                } else if (data.status === "failed" || data.status === "canceled") {
                    clearInterval(interval);
                    setIsGenerating(false);
                    console.error("Generation Failed:", data.error);
                    alert(`Generarea a eșuat: ${data.error || "Eroare necunoscută"}`);
                } else {
                    // still processing
                    if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        setIsGenerating(false);
                        alert("Generarea durează prea mult. Verifică mai târziu în Galerie.");
                    }
                }
            } catch (e) {
                console.error("Polling Error:", e);
                // Don't stop polling for network blips immediately, but could count errors
            }
        }, 3000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            // In a real app, we would upload this to R2/S3 here
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black/50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Atelierul Magic
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Alege cum vrei să creezi personajul tău!
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Creation Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl"
                    >
                        {/* Mode Switcher */}
                        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8">
                            <button
                                onClick={() => setMode("text")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all",
                                    mode === "text" ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <Pencil className="w-4 h-4" />
                                Scrie Povestea
                            </button>
                            <button
                                onClick={() => setMode("image")}
                                title="Momentan doar Text funcționează complet automat"
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all opacity-50 cursor-not-allowed",
                                    mode === "image" ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <ImageIcon className="w-4 h-4" />
                                Încarcă Poza (Prototip)
                            </button>
                        </div>

                        <form onSubmit={handleGenerate} className="space-y-6">
                            {mode === "text" ? (
                                <div>
                                    <label className="block text-sm font-bold mb-2">Descrie personajul tău</label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Un robot prietenos care iubește înghețata..."
                                        className="w-full h-40 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-primary focus:ring-0 resize-none text-lg"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block w-full h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative overflow-hidden group">
                                        {previewUrl ? (
                                            <img src={previewUrl} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                <ImageIcon className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
                                                <span>Apasă pentru a încărca</span>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isGenerating || (mode === 'text' && !prompt)}
                                className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Se Magicianizează...
                                    </>
                                ) : (
                                    <>
                                        <Rocket />
                                        Generează!
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-xs text-gray-400 mt-4 text-center">
                            Folosim AI avansat pentru a crea modelele. Durează aprox. 30-60 secunde.
                        </p>
                    </motion.div>

                    {/* Preview Panel */}
                    <div className="h-[500px] lg:h-auto bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden relative border border-white/10">
                        {resultModel ? (
                            <>
                                <ModelViewer url={resultModel} />
                                <button
                                    onClick={() => setResultModel(null)}
                                    className="absolute top-4 left-4 bg-white/20 backdrop-blur text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center opacity-50">
                                <Sparkles className="w-16 h-16 mb-4" />
                                <p className="text-xl font-bold">Magia va apărea aici!</p>
                            </div>
                        )}

                        {isGenerating && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                                <div className="text-4xl animate-bounce mb-4">🎨</div>
                                <p className="text-2xl font-bold">Pictăm în 3D...</p>
                                <p className="text-sm opacity-80 mt-2">AI-ul lucrează... ai răbdare!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
