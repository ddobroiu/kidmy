"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Pencil, Image as ImageIcon, Loader2, RotateCcw, Zap, Wand2, Upload, CheckCircle2 } from "lucide-react";
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
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    alert("Generarea durează prea mult. Verifică mai târziu în Galerie.");
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
        <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10 grid-pattern" />
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/6 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto">
                {/* ─── Header ─── */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 border border-primary/20"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Laboratorul de Creație AI
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-black tracking-tight mb-4"
                        style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
                    >
                        Atelierul <span className="magic-text">Magic</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground font-medium max-w-lg mx-auto"
                    >
                        Scrie ce îți dorești sau încarcă un desen — AI-ul transformă ideea ta în 3D în ~60 secunde.
                    </motion.p>
                </div>

                {/* ─── Main Grid ─── */}
                <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                    {/* LEFT: Input Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="glass border border-border/60 rounded-2xl p-6 shadow-card flex flex-col"
                    >
                        {/* Mode tabs */}
                        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-6 border border-border/40">
                            <ModeTab
                                active={mode === "text"}
                                onClick={() => setMode("text")}
                                icon={<Pencil className="w-4 h-4" />}
                                label="Scrie Povestea"
                            />
                            <ModeTab
                                active={mode === "image"}
                                onClick={() => setMode("image")}
                                icon={<ImageIcon className="w-4 h-4" />}
                                label="Încarcă Poza"
                            />
                        </div>

                        <form onSubmit={handleGenerate} className="flex flex-col flex-grow gap-5">
                            <AnimatePresence mode="wait">
                                {mode === "text" ? (
                                    <motion.div
                                        key="text"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="flex-grow flex flex-col"
                                    >
                                        <label className="text-sm font-black mb-3 flex items-center gap-2">
                                            <Wand2 className="w-4 h-4 text-primary" />
                                            Ce vrei să construim astăzi?
                                        </label>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Un astronaut micuț care stă pe o lună de brânză, cu un câine pe lângă el..."
                                            className="flex-grow w-full p-5 rounded-xl border-2 border-dashed border-border/60 bg-background/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 resize-none text-base font-medium outline-none transition-all placeholder:text-muted-foreground/60 min-h-[180px]"
                                        />

                                        {/* Suggestion pills */}
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {["🦕 Dinozaur cute", "🛸 Navă stelară", "🏰 Castel magic", "🐙 Caracatiță ninja"].map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setPrompt(s.slice(3))}
                                                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-muted/70 hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/30 transition-all"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="image"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                    >
                                        <label className="text-sm font-black mb-3 flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-accent" />
                                            Transformă desenul în 3D
                                        </label>
                                        <label className="block border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden group min-h-[200px] relative">
                                            {previewUrl ? (
                                                <div className="relative">
                                                    <img src={previewUrl} className="w-full h-56 object-contain p-3" alt="Preview" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white font-black text-sm flex items-center gap-2">
                                                            <Upload className="w-4 h-4" /> Schimbă imaginea
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3 p-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center group-hover:scale-110 transition-transform border border-border/50">
                                                        <Upload className="w-6 h-6" />
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-black text-foreground text-sm">Apasă pentru a alege</div>
                                                        <div className="text-xs mt-1">PNG, JPG, WEBP · max 10MB</div>
                                                    </div>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                        {imageFile && (
                                            <p className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> {imageFile.name}
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Generate Button */}
                            <button
                                type="submit"
                                disabled={isGenerating || (mode === 'text' && !prompt.trim()) || (mode === 'image' && !imageFile)}
                                className="relative w-full py-4 magic-bg-hero text-white rounded-xl font-black text-lg shadow-magic hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 overflow-hidden group"
                            >
                                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5 relative z-10" />
                                        <span className="relative z-10">Se Generează...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 relative z-10" />
                                        <span className="relative z-10">Generează 3D Magic!</span>
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs font-bold text-muted-foreground flex items-center justify-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                                Durează aproximativ 60 de secunde · Salvat automat în Galerie
                            </p>
                        </form>
                    </motion.div>

                    {/* RIGHT: Preview Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass border border-border/60 rounded-2xl overflow-hidden shadow-card min-h-[500px] relative"
                    >
                        <AnimatePresence mode="wait">
                            {resultModel ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full absolute inset-0"
                                >
                                    <ModelViewer url={resultModel} />

                                    {/* Success banner */}
                                    <div className="absolute top-4 left-4 right-4 z-20">
                                        <div className="glass border border-green-500/30 bg-green-500/10 px-4 py-3 rounded-xl flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                            <div>
                                                <div className="text-sm font-black text-green-500">Modelul e gata! 🎉</div>
                                                <div className="text-xs text-muted-foreground font-medium">Salvat automat în Galeria ta</div>
                                            </div>
                                            <button
                                                onClick={() => setResultModel(null)}
                                                className="ml-auto p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : isGenerating ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 gap-6"
                                >
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-3xl magic-bg-hero flex items-center justify-center shadow-magic animate-pulse">
                                            <span className="text-5xl">🪄</span>
                                        </div>
                                        <div className="absolute inset-0 rounded-3xl magic-bg-hero opacity-40 blur-xl animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-2xl font-black mb-2">AI-ul pictează...</h2>
                                        <p className="text-muted-foreground text-sm font-medium">Aproximativ 60 de secunde</p>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {[0, 150, 300].map(d => (
                                            <div
                                                key={d}
                                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                                style={{ animationDelay: `${d}ms` }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-10 text-center"
                                >
                                    <div className="text-8xl mb-6 opacity-30 animate-float">✨</div>
                                    <p className="text-xl font-black mb-2 text-foreground/50">Modelul tău apare aici</p>
                                    <p className="text-sm font-medium max-w-xs">
                                        Completează formularul, apasă butonul magic și urmărește cum AI-ul îți construiește lumea!
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ModeTab({ active, onClick, icon, label }: {
    active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
                active
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
            )}
        >
            {icon} {label}
        </button>
    );
}
