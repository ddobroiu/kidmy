"use client";

import { use } from "react";
import { animals } from "@/lib/animals";
import ModelViewer from "@/components/ModelViewer";
import StoryNarrator from "@/components/StoryNarrator";
import Link from "next/link";
import { ChevronLeft, Info, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";

export default function AnimalDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const animal = animals.find((a) => a.id === id);

    if (!animal) return notFound();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header/Back Button */}
                <Link
                    href="/learn"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 font-black transition-colors group"
                >
                    <div className="bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronLeft className="w-6 h-6" />
                    </div>
                    Inapoi la Lumea Animalelor
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side: 3D Model */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-[3rem] overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl h-[400px] md:h-[600px] lg:h-[700px]"
                    >
                        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[100px] opacity-20 ${animal.color}`} />
                        <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[100px] opacity-20 ${animal.color}`} />

                        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-xs font-black uppercase tracking-wider">Vizualizare 3D Activa</span>
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
                    <div className="flex flex-col gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                                {animal.name}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                                {animal.description}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-200 dark:border-white/10 shadow-xl"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`${animal.color} p-4 rounded-2xl shadow-lg ring-4 ring-white dark:ring-white/5`}>
                                    <Info className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-black">Știai că?</h2>
                            </div>

                            <div className="space-y-6">
                                {animal.facts.map((fact, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (index * 0.1) }}
                                        className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-primary shrink-0 group-hover:scale-125 transition-transform" />
                                        <p className="text-lg font-bold text-gray-600 dark:text-gray-300">
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
                            className="flex flex-col sm:flex-row gap-4 mt-8"
                        >
                            <Link
                                href="/create"
                                className="bg-white/80 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 text-gray-900 dark:text-white px-8 py-5 rounded-2xl text-xl font-bold shadow-xl border border-gray-200 dark:border-white/10 transition-all hover:scale-105 flex items-center justify-center gap-3 w-full"
                            >
                                <Wand2 className="w-6 h-6" />
                                Creează propriul tău animal
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
