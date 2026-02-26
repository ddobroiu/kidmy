"use client";

import Link from "next/link";
import { animals } from "@/lib/animals";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play } from "lucide-react";

export default function LearnPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black/95 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full mb-4 text-sm font-bold"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Școala de Aventură 3D</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                    >
                        Descoperă <span className="text-primary italic">Lumea Animalelor</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Apasă pe animalul preferat pentru a-l vedea în 3D și a învăța lucruri uimitoare despre el!
                    </motion.p>
                </div>

                {/* Animals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {animals.map((animal, index) => (
                        <motion.div
                            key={animal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/learn/${animal.id}`} className="group block">
                                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 dark:border-gray-800 relative overflow-hidden h-full flex flex-col">
                                    {/* Color Splash Background */}
                                    <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity ${animal.color}`} />

                                    {/* Content Area */}
                                    <div className="p-4 flex-grow flex flex-col">
                                        <div className={`${animal.color} w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-12 transition-transform`}>
                                            <Play className="text-white w-8 h-8 fill-current translate-x-0.5" />
                                        </div>

                                        <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">
                                            {animal.name}
                                        </h3>

                                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6 line-clamp-2">
                                            {animal.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between text-sm font-bold">
                                            <span className="bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-xl text-gray-500">
                                                3 Model Animatie
                                            </span>
                                            <div className="flex items-center gap-2 text-primary group-hover:translate-x-1 transition-transform">
                                                Vezi Acum <ArrowRight className="w-4 h-4" />
                                            </div>
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
