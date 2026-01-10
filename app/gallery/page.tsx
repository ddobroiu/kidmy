"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingCart, User, Download, Share2, Loader2, Rocket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState<"creations" | "shop">("creations");
    const [items, setItems] = useState<any[]>([]); // Shop items
    const [generations, setGenerations] = useState<any[]>([]); // User generations
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch("/api/gallery");
                const data = await res.json();
                if (data.items) setItems(data.items);
                if (data.generations) setGenerations(data.generations);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const displayedItems = activeTab === "shop" ? items : generations;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                        Galeria de Modele
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Explorează lumea magică a creațiilor 3D! Vezi ce au făcut alți copii sau alege modele premium din magazin.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white dark:bg-gray-900 p-1.5 rounded-2xl shadow-lg inline-flex gap-2">
                        <button
                            onClick={() => setActiveTab("creations")}
                            className={cn(
                                "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
                                activeTab === "creations"
                                    ? "bg-primary text-white shadow-md transform scale-105"
                                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            )}
                        >
                            <User className="w-5 h-5" />
                            Jucăriile Mele
                        </button>
                        <button
                            onClick={() => setActiveTab("shop")}
                            className={cn(
                                "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
                                activeTab === "shop"
                                    ? "bg-accent text-white shadow-md transform scale-105"
                                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            )}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Magazin Premium
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {displayedItems.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">
                                    {activeTab === "creations" ? "Nu ai nicio jucărie încă." : "Încă nu sunt modele aici."}
                                </h3>

                                {activeTab === "creations" && (
                                    <div className="mt-6 flex flex-col items-center gap-3">
                                        <p className="text-gray-500 max-w-md mx-auto mb-2">
                                            Dacă te-ai logat, creează prima ta jucărie! Dacă nu, autentifică-te pentru a vedea colecția ta.
                                        </p>
                                        <div className="flex gap-4">
                                            <Link href="/create" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                                                <Rocket className="w-5 h-5" />
                                                Creează Acum
                                            </Link>
                                            <Link href="/login" className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                                <User className="w-5 h-5" />
                                                Logare
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {displayedItems.map((item) => (
                                        <GalleryCard
                                            key={item.id}
                                            item={item}
                                            type={activeTab}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}

function GalleryCard({ item, type }: { item: any, type: "shop" | "creations" }) {
    const title = type === "shop" ? item.title : (item.prompt || "Personaj Misterios");
    const modelUrl = item.modelUrl || (item.output && item.output.model_file); // Adapting based on API response structure if needed

    // Fallback if URL is missing
    if (!item.modelUrl && !modelUrl) return null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
        >
            <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                    {type === "shop" ? (
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20 shadow-sm">
                            PREMIUM
                        </span>
                    ) : (
                        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800 shadow-sm">
                            GENERAT DE AI
                        </span>
                    )}
                </div>

                <div className="w-full h-full pointer-events-none group-hover:pointer-events-auto">
                    <ModelViewer url={item.modelUrl} showControls={false} />
                </div>
            </div>

            <div className="p-6">
                <h3 className="font-bold text-lg mb-2 truncate" title={title}>
                    {title}
                </h3>

                <div className="flex items-center justify-between mt-4">
                    {type === "shop" ? (
                        <div className="text-xl font-black text-primary">
                            {item.price === 0 ? "GRATUIT" : `${item.price} Credite`}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Creat de Tine ✨</span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition-colors"
                            title="Descarcă"
                            onClick={() => {
                                const a = document.createElement('a');
                                a.href = item.modelUrl;
                                a.download = `${title}.glb`;
                                a.click();
                            }}
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
