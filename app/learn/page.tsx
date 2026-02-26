"use client";

import Link from "next/link";
import { animals } from "@/lib/animals";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Star } from "lucide-react";

export default function LearnPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative">
            {/* Background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 glass px-6 py-2 rounded-full mb-6 text-sm font-black text-primary border-primary/20 shadow-premium"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="uppercase tracking-widest text-[10px]">Școala de Aventură 3D</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
                    >
                        Descoperă <span className="magic-text italic">Lumea Animalelor</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Explorează natura într-un mod cu totul nou. Modele 3D realiste și povești captivante te așteaptă!
                    </motion.p>
                </div>

                {/* Animals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {animals.map((animal, index) => (
                        <motion.div
                            key={animal.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <Link href={`/learn/${animal.id}`} className="group block h-full">
                                <div className="glass h-full rounded-[3rem] p-8 transition-all hover:shadow-magic border-white/40 flex flex-col items-start relative overflow-hidden">
                                    {/* Animal Highlight Background */}
                                    <div className={cn(
                                        "absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity",
                                        animal.color
                                    )} />

                                    <div className={cn(
                                        "w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500",
                                        animal.color
                                    )}>
                                        <Play className="text-white w-10 h-10 fill-current translate-x-0.5" />
                                    </div>

                                    <h3 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors">
                                        {animal.name}
                                    </h3>

                                    <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-10 line-clamp-3">
                                        {animal.description}
                                    </p>

                                    <div className="mt-auto w-full flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 px-4 py-2 bg-muted/50 rounded-xl text-xs font-black text-muted-foreground uppercase tracking-widest">
                                            <Star className="w-3 h-3 text-secondary fill-secondary" />
                                            Experiență 3D
                                        </div>
                                        <div className="flex items-center gap-2 text-primary font-black group-hover:translate-x-2 transition-transform">
                                            Vezi Acum <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helper needed since lib/utils/cn might not be imported or available correctly
import { cn } from "@/lib/utils";
