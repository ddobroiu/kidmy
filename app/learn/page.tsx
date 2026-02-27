"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { modelsData, categories, CategoryInfo } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });

export default function LearnPage() {
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const displayedModels = activeCategory === "all"
        ? modelsData
        : modelsData.filter(m => m.categoryId === activeCategory);

    return (
        <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10 grid-pattern" />
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-primary/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-accent/6 rounded-full blur-[140px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* ─── Header ─── */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 border border-primary/20"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Enciclopedia Ta 3D
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-black tracking-tight leading-[1.1] mb-5"
                        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
                    >
                        Descoperă <span className="magic-text">Fascinația</span>
                        <br />
                        <span className="text-foreground/60 text-[0.6em] font-bold tracking-normal">explorată în 3D interactiv</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="text-muted-foreground text-lg max-w-xl mx-auto font-medium leading-relaxed"
                    >
                        Alege o categorie, vizualizează modelul în 3D și ascultă povestea lui — generată live de AI!
                    </motion.p>
                </div>

                {/* ─── Categories Navbar ─── */}
                <div className="flex justify-center mb-12">
                    <div className="flex flex-wrap items-center justify-center gap-2 bg-muted/50 p-2 rounded-2xl border border-border/50 max-w-full overflow-x-auto no-scrollbar">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={cn(
                                        "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap",
                                        isActive
                                            ? "bg-primary text-white shadow-magic"
                                            : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/5 hover:text-foreground"
                                    )}
                                >
                                    <span className="text-lg">{cat.icon}</span>
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ─── Models Grid ─── */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
                    >
                        {displayedModels.map((model, index) => (
                            <motion.div
                                key={model.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <ModelCard model={model} index={index} />
                            </motion.div>
                        ))}
                        {displayedModels.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="text-4xl mb-4">🔮</div>
                                <h3 className="text-xl font-bold text-foreground">Nu am găsit încă modele în această categorie</h3>
                                <p className="text-muted-foreground font-medium text-sm">Curând vom adăuga noi surprize!</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* ─── Bottom CTA ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <p className="text-muted-foreground font-medium mb-6">
                        Ai văzut ceva ce îți place? Creează-ți propria versiune!
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 magic-bg text-white px-8 py-4 rounded-2xl font-black text-base shadow-magic hover:scale-105 hover:shadow-glow transition-all active:scale-95"
                    >
                        <Zap className="w-5 h-5" />
                        Creează Acum
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

function ModelCard({ model, index }: { model: any; index: number }) {
    const isFeature = index === 0;

    return (
        <Link href={`/learn/${model.id}`} className="group block h-full">
            <div className={cn(
                "relative h-full rounded-3xl overflow-hidden transition-all duration-300 border hover:shadow-magic cursor-pointer",
                isFeature
                    ? "border-primary/30 shadow-premium"
                    : "glass border-border/60 hover:border-[var(--primary)] shadow-card"
            )}>
                {/* Colored gradient top */}
                <div className={cn(
                    "relative h-40 flex items-center justify-center overflow-hidden",
                    model.color || "bg-gradient-to-br from-primary/20 to-accent/20"
                )}>
                    <div className="absolute inset-0 opacity-80" />
                    <div className="absolute inset-0 bg-black/15" />

                    {model.modelUrl && !model.modelUrl.includes("PLACEHOLDER") ? (
                        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                            <div className="w-full h-full scale-[1.35]">
                                <ModelViewer
                                    url={model.modelUrl}
                                    showControls={false}
                                    showArButton={false}
                                    backgroundColor="transparent"
                                    height="100%"
                                    className="scale-[0.8]"
                                />
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="relative z-10 text-7xl filter drop-shadow-xl animate-float"
                            style={{ animationDelay: `${index * 0.3}s` }}
                        >
                            {model.emoji}
                        </motion.div>
                    )}

                    {/* Badge */}
                    {isFeature && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-primary uppercase tracking-wider">
                            ⭐ Prezentat
                        </div>
                    )}

                    {/* 3D badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-white text-[9px] font-black uppercase tracking-wider">3D Live</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 bg-card/80 backdrop-blur-sm dark:bg-card/90">
                    <div className="flex items-start justify-between mb-3 gap-3">
                        <h3 className="text-xl font-black group-hover:text-primary transition-colors duration-200 line-clamp-1">
                            {model.name}
                        </h3>
                        <div className="shrink-0 p-1.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed font-medium line-clamp-2 mb-5">
                        {model.description}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black text-muted-foreground bg-muted/90 border border-border/50 px-2.5 py-1 rounded-md uppercase tracking-widest">
                            🔬 {model.facts?.length || 5} informații
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground bg-muted/90 border border-border/50 px-2.5 py-1 rounded-md uppercase tracking-widest">
                            🎙️ Poveste
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
