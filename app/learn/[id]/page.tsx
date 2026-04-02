"use client";

import { use } from "react";
import { modelsData, categories } from "@/lib/data";
import dynamic from "next/dynamic";
const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });
import StoryNarrator from "@/components/StoryNarrator";
import Link from "next/link";
import { ChevronLeft, Info, Sparkles, Wand2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ModelDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const modelItem = modelsData.find((a) => a.id === id);
    const itemIndex = modelsData.findIndex((a) => a.id === id);
    const nextItem = modelsData[(itemIndex + 1) % modelsData.length];

    if (!modelItem) return notFound();

    const categoryName = categories.find(c => c.id === modelItem.categoryId)?.name || "Element";

    return (
        <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className={cn("absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full blur-[160px] opacity-15", modelItem.color)} />
                <div className={cn("absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] rounded-full blur-[120px] opacity-8", modelItem.color)} />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Back button */}
                <div className="flex items-center justify-between mb-10">
                    <Link
                        href="/learn"
                        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group px-3 py-2 rounded-xl hover:bg-primary/5"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Înapoi la bibliotecă
                    </Link>

                    {/* Next animal */}
                    <Link
                        href={`/learn/${nextItem.id}`}
                        className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group px-3 py-2 rounded-xl hover:bg-primary/5"
                    >
                        Următor: {nextItem.name}
                        <ChevronLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 items-start">
                    {/* ─── LEFT: 3D Model (3 cols) ─── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-3 relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden glass border border-border/60 shadow-magic h-[420px] md:h-[540px] lg:h-[640px] group">
                            {/* Top badges */}
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                                <div className="flex items-center gap-2 glass border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-xl">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">3D Activ</span>
                                </div>
                            </div>

                            {/* AR badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <div className="flex items-center gap-1.5 glass border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-xl">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">AR Ready</span>
                                </div>
                            </div>

                            {/* Emoji overlay - shows on mobile */}
                            <div className="absolute bottom-4 left-4 z-10 text-4xl lg:hidden">
                                {modelItem.emoji}
                            </div>

                            <ModelViewer
                                url={modelItem.modelUrl}
                                height="100%"
                                className="bg-transparent border-none rounded-none"
                                showArButton={true}
                                backgroundColor="transparent"
                            />
                        </div>

                        {/* Quick action under model */}
                        <div className="mt-4">
                            <Link
                                href="/create"
                                className="group w-full flex items-center justify-center gap-2 glass border border-border/60 hover:border-primary/30 hover:bg-primary/5 text-foreground px-6 py-3.5 rounded-xl text-sm font-black shadow-card transition-all hover:shadow-premium"
                            >
                                <Wand2 className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
                                Creează propria ta versiune
                            </Link>
                        </div>
                    </motion.div>

                    {/* ─── RIGHT: Info (2 cols) ─── */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg text-2xl", modelItem.color)}>
                                    {modelItem.emoji}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
                                    Clasa {categoryName}
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                                {modelItem.name}
                            </h1>
                            <p className="text-muted-foreground font-medium leading-relaxed text-base">
                                {modelItem.description}
                            </p>
                        </motion.div>

                        {/* Facts card */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="glass border border-border/60 rounded-2xl p-5 shadow-card relative overflow-hidden"
                        >
                            <div className={cn("absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[60px] opacity-15", modelItem.color)} />

                            <div className="flex items-center gap-2.5 mb-5 relative z-10">
                                <div className={cn("p-2 rounded-xl text-white shadow-md text-sm", modelItem.color)}>
                                    <Info className="w-4 h-4" />
                                </div>
                                <h2 className="text-base font-black">Știai că...? 🤔</h2>
                            </div>

                            <div className="space-y-2.5 relative z-10">
                                {modelItem.facts.map((fact: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.08 }}
                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors group cursor-default"
                                    >
                                        <CheckCircle className={cn("w-4 h-4 shrink-0 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity",
                                            modelItem.color?.includes("bg-") ? "text-primary" : "text-primary"
                                        )} />
                                        <p className="text-sm font-medium text-foreground leading-snug">{fact}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Story Narrator */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            <StoryNarrator
                                animalName={modelItem.name}
                                description={modelItem.description}
                                animalColor={modelItem.color}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
