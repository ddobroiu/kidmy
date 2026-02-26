"use client";

import { use } from "react";
import { animals } from "@/lib/animals";
import ModelViewer from "@/components/ModelViewer";
import StoryNarrator from "@/components/StoryNarrator";
import Link from "next/link";
import { ChevronLeft, Info, Sparkles, Wand2, Star, Target } from "lucide-react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AnimalDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const animal = animals.find((a) => a.id === id);

    if (!animal) return notFound();

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative">
            {/* Background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className={cn("absolute top-0 right-0 w-[50%] h-[50%] rounded-full blur-[150px] opacity-20", animal.color)} />
                <div className={cn("absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full blur-[120px] opacity-10", animal.color)} />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header/Back Button */}
                <Link
                    href="/learn"
                    className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary mb-12 font-black transition-all group px-4 py-2 glass rounded-2xl border-white/20 shadow-premium"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Înapoi la Școală
                </Link>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Side: 3D Model Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-[4rem] overflow-hidden glass border-white/40 shadow-magic h-[500px] md:h-[650px] lg:h-[750px] group"
                    >
                        <div className="absolute top-8 left-8 z-10 flex flex-col gap-3">
                            <div className="glass px-5 py-2.5 rounded-full border-white/40 shadow-premium flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Vizualizare 3D Activă</span>
                            </div>
                        </div>

                        <ModelViewer
                            url={animal.modelUrl}
                            height="100%"
                            className="bg-transparent border-none rounded-none"
                            showArButton={true}
                            backgroundColor="transparent"
                        />
                    </motion.div>

                    {/* Right Side: Info & Facts */}
                    <div className="flex flex-col gap-10">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
                                {animal.name}
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed mb-6">
                                {animal.description}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass rounded-[3rem] p-10 border-white/40 shadow-premium relative overflow-hidden"
                        >
                            <div className={cn("absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-20", animal.color)} />

                            <div className="flex items-center gap-5 mb-10 relative z-10">
                                <div className={cn("p-5 rounded-[1.5rem] shadow-lg ring-4 ring-white/10 text-white", animal.color)}>
                                    <Info className="w-10 h-10" />
                                </div>
                                <h2 className="text-4xl font-black tracking-tight italic">Știai că... ?</h2>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {animal.facts.map((fact, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (index * 0.1) }}
                                        className="flex items-start gap-5 p-6 rounded-3xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-white/5 transition-all group"
                                    >
                                        <div className="mt-2 w-3 h-3 rounded-full bg-primary shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                        <p className="text-xl font-bold text-foreground leading-snug">
                                            {fact}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <StoryNarrator
                            animalName={animal.name}
                            description={animal.description}
                            animalColor={animal.color}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="pt-6"
                        >
                            <Link
                                href="/create"
                                className="glass hover:bg-white/40 text-foreground px-10 py-6 rounded-[2.5rem] text-2xl font-black shadow-premium border-white/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 w-full group"
                            >
                                <Wand2 className="w-7 h-7 text-primary group-hover:rotate-12 transition-transform" />
                                Creează propriul tău {animal.name}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
