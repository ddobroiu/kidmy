"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Pencil, Image as ImageIcon, Rocket, Loader2, RotateCcw, Zap, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

        let attempts = 0;
        const maxAttempts = 120;

        const interval = setInterval(async () => {
            attempts++;
            try {
                const statusRes = await fetch(`/api/status?id=${id}&generationId=${generationId}`);
                if (!statusRes.ok) return;

                const data = await statusRes.json();
                if (data.status === "succeeded") {
                    clearInterval(interval);
                    setIsGenerating(false);
                    let finalUrl = undefined;
                    if (typeof data.output === 'string') finalUrl = data.output;
                    else if (data.output?.model_file) finalUrl = data.output.model_file;
                    else if (data.output && typeof data.output === 'object' && Object.values(data.output).length > 0) {
                        const potential = Object.values(data.output).find(v => typeof v === 'string');
                        if (potential) finalUrl = potential as string;
                    }

                    if (finalUrl) setResultModel(finalUrl);
                    else alert("Generarea a reușit dar nu găsim fișierul. Verifică în Galerie!");

                } else if (data.status === "failed" || data.status === "canceled") {
                    clearInterval(interval);
                    setIsGenerating(false);
                    alert(`Generarea a eșuat: ${data.error || "Eroare necunoscută"}`);
                } else {
                    if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        setIsGenerating(false);
                        alert("Generarea durează prea mult. Verifică mai târziu în Galerie.");
                    }
                }
            } catch (e) {
                console.error("Polling Error:", e);
            }
        }, 3000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-[var(--background)]">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 glass px-6 py-2 rounded-full mb-6 text-sm font-black text-primary border-primary/20 shadow-premium"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="uppercase tracking-widest text-[10px]">Laboratorul de Creație</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        Atelierul <span className="magic-text">Magic</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        Aici ideile tale devin realitate. Scrie ce vrei să creezi și AI-ul se ocupă de restul!
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-stretch">
                    {/* Creation Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass border-white/40 rounded-[3rem] p-10 shadow-premium flex flex-col"
                    >
                        {/* Mode Switcher */}
                        <div className="flex gap-3 bg-muted/50 p-2 rounded-[1.5rem] mb-10 border border-border/50">
                            <button
                                onClick={() => setMode("text")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all",
                                    mode === "text" ? "bg-white dark:bg-white/10 shadow-premium text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Pencil className="w-5 h-5" />
                                Scrie Povestea
                            </button>
                            <button
                                onClick={() => setMode("image")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all",
                                    mode === "image" ? "bg-white dark:bg-white/10 shadow-premium text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <ImageIcon className="w-5 h-5" />
                                Încarcă Poza
                            </button>
                        </div>

                        <form onSubmit={handleGenerate} className="space-y-8 flex-grow flex flex-col">
                            {mode === "text" ? (
                                <div className="flex-grow flex flex-col">
                                    <label className="text-lg font-black mb-4 flex items-center gap-2">
                                        <Wand2 className="w-5 h-5 text-primary" />
                                        Ce vrei să construim astăzi?
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Un astronaut micuț care stă pe o lună de brânză..."
                                        className="w-full flex-grow p-6 rounded-[2rem] border-2 border-dashed border-border/50 bg-white/30 dark:bg-black/20 focus:border-primary focus:ring-0 resize-none text-xl font-medium outline-none transition-all"
                                    />
                                </div>
                            ) : (
                                <div className="flex-grow">
                                    <label className="text-lg font-black mb-4 flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-accent" />
                                        Transformă desenul în 3D
                                    </label>
                                    <label className="block w-full h-80 border-2 border-dashed border-border/50 rounded-[2.5rem] cursor-pointer hover:bg-white/40 dark:hover:bg-black/30 transition-all relative overflow-hidden group">
                                        {previewUrl ? (
                                            <img src={previewUrl} className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                                                <div className="p-5 glass rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-premium">
                                                    <ImageIcon className="w-10 h-10 text-primary" />
                                                </div>
                                                <span className="font-black">Apasă pentru a alege imaginea</span>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isGenerating || (mode === 'text' && !prompt)}
                                    className="w-full py-6 magic-bg text-white rounded-3xl font-black text-2xl shadow-magic hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="animate-spin w-8 h-8" />
                                            <span>Se Magicianizează...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-7 h-7 group-hover:fill-current transition-all" />
                                            <span>Generează Acum!</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-sm font-bold text-muted-foreground mt-6 flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4 text-secondary" />
                                    AI-ul funcționează. Durează aprox. 60 secunde.
                                </p>
                            </div>
                        </form>
                    </motion.div>

                    {/* Preview Panel */}
                    <div className="glass border-white/40 rounded-[3rem] overflow-hidden relative shadow-premium min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {resultModel ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full"
                                >
                                    <ModelViewer url={resultModel} />
                                    <button
                                        onClick={() => setResultModel(null)}
                                        className="absolute top-8 left-8 glass border-white/20 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-premium"
                                    >
                                        <RotateCcw className="w-6 h-6" />
                                    </button>
                                </motion.div>
                            ) : isGenerating ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white z-20"
                                >
                                    <div className="text-6xl animate-bounce mb-8">🎨</div>
                                    <h2 className="text-4xl font-black mb-4">Pictăm în 3D...</h2>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-12 text-center"
                                >
                                    <div className="w-32 h-32 glass rounded-[2.5rem] flex items-center justify-center mb-8 border-white/20 opacity-50">
                                        <Wand2 className="w-16 h-16" />
                                    </div>
                                    <p className="text-3xl font-black mb-4">Așteptăm Magia</p>
                                    <p className="text-lg font-medium max-w-xs">
                                        Completează formularul din stânga pentru a vedea cum ideea ta prinde viață aici!
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
