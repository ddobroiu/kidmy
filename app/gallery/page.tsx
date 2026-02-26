"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingCart, User, Download, Share2, Loader2, Rocket, X, Search, Grid, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState<"creations" | "shop">("creations");
    const [items, setItems] = useState<any[]>([]);
    const [generations, setGenerations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        const fetchGallery = async () => {
            setLoading(true);
            try {
                const query = activeTab === 'shop' && debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : '';
                const res = await fetch(`/api/gallery${query}`);
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
    }, [activeTab, debouncedSearch]);

    const handleRemoveItem = (id: string) => {
        setGenerations(prev => prev.filter(g => g.id !== id));
    };

    const displayedItems = activeTab === "shop" ? items : generations;

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative">
            {/* Background elements */}
            <div className="fixed inset-0 -z-10 bg-[var(--background)]">
                <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 glass px-6 py-2 rounded-full mb-6 text-sm font-black text-primary border-primary/20 shadow-premium"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="uppercase tracking-widest text-[10px]">Colecția Magică</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        Galeria de <span className="magic-text">Modele</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        Aici locuiesc toate creațiile voastre. Inspiră-te sau alege modele premium gata de joacă!
                    </p>
                </div>

                {/* Tabs & Search */}
                <div className="flex flex-col items-center gap-8 mb-20">
                    <div className="glass p-2 rounded-[2rem] border-white/20 shadow-premium inline-flex gap-3">
                        <button
                            onClick={() => setActiveTab("creations")}
                            className={cn(
                                "px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 transition-all text-sm",
                                activeTab === "creations"
                                    ? "magic-bg text-white shadow-magic scale-105"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                            )}
                        >
                            <User className="w-5 h-5" />
                            Creat de Mine
                        </button>
                        <button
                            onClick={() => setActiveTab("shop")}
                            className={cn(
                                "px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 transition-all text-sm",
                                activeTab === "shop"
                                    ? "magic-bg text-white shadow-magic scale-105"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                            )}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Magazin Premium
                        </button>
                    </div>

                    {activeTab === 'shop' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative w-full max-w-xl"
                        >
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-primary" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-16 pr-6 py-5 glass border-white/40 rounded-[2rem] text-lg font-bold placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/20 outline-none transition-all shadow-premium"
                                placeholder="Caută jucării premium..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <Loader2 className="w-16 h-16 animate-spin text-primary" />
                        <p className="text-xl font-black text-muted-foreground italic">Se încarcă magia...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {displayedItems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-32 glass rounded-[4rem] border-dashed border-white/20 border-2"
                            >
                                <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mx-auto mb-8 border-white/20 opacity-50">
                                    <Sparkles className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-3xl font-black text-muted-foreground mb-4">
                                    Inca niciun model aici...
                                </h3>
                                <p className="text-lg text-muted-foreground font-medium mb-12 max-w-md mx-auto">
                                    Fii primul care aduce această categorie la viață!
                                </p>

                                {activeTab === "creations" && (
                                    <div className="flex flex-col sm:flex-row gap-6 justify-center px-4">
                                        <Link href="/create" className="magic-bg text-white px-10 py-5 rounded-2xl font-black text-xl shadow-magic hover:scale-105 transition-all flex items-center justify-center gap-3">
                                            <Rocket className="w-6 h-6" />
                                            Începe magia
                                        </Link>
                                        <Link href="/login" className="glass text-foreground px-10 py-5 rounded-2xl font-black text-xl border-white/40 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                            <User className="w-6 h-6" />
                                            Autentificare
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
                            >
                                <AnimatePresence mode="popLayout">
                                    {displayedItems.map((item) => (
                                        <GalleryCard
                                            key={item.id}
                                            item={item}
                                            type={activeTab}
                                            onRemove={handleRemoveItem}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

function GalleryCard({ item, type, onRemove }: { item: any, type: "shop" | "creations", onRemove?: (id: string) => void }) {
    const title = type === "shop" ? item.title : (item.prompt || "Personaj Misterios");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Ești sigur că vrei să ștergi această jucărie?")) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/gallery/item?id=${item.id}`, { method: "DELETE" });
            if (res.ok && onRemove) onRemove(item.id);
            else alert("Eroare la ștergere.");
        } catch (e) {
            console.error(e);
            alert("Eroare de rețea.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -12 }}
            className="group glass border-white/40 rounded-[3rem] overflow-hidden shadow-premium transition-all relative flex flex-col h-full"
        >
            <div className="aspect-square relative bg-muted/20 overflow-hidden">
                {/* Badge Overlay */}
                <div className="absolute top-6 left-6 z-20">
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-premium backdrop-blur-md",
                        type === "shop" ? "bg-amber-400 text-amber-950 border-amber-500/30" : "bg-primary text-white border-primary/20"
                    )}>
                        {type === "shop" ? "Premium" : "Creat de Tine"}
                    </div>
                </div>

                <div className="w-full h-full pointer-events-none group-hover:pointer-events-auto transition-transform duration-700 group-hover:scale-105">
                    {item.isSketchfab || !item.modelUrl.startsWith('http') ? (
                        <div className="w-full h-full relative">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="glass px-6 py-2 rounded-full text-white font-black text-sm border-white/20">Previzualizare</span>
                            </div>
                        </div>
                    ) : (
                        <ModelViewer url={item.modelUrl} showControls={false} />
                    )}
                </div>
            </div>

            <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-black mb-6 truncate group-hover:text-primary transition-colors" title={title}>
                    {title}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                    {type === "shop" ? (
                        <div className="flex items-center gap-3">
                            {item.isSketchfab ? (
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (!confirm(`Vrei să cumperi "${title}" cu ${item.price} credite?`)) return;
                                        const btn = e.currentTarget;
                                        btn.disabled = true;
                                        try {
                                            const res = await fetch("/api/gallery/buy-sketchfab", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ uid: item.uid || item.id, title: item.title, price: item.price, imageUrl: item.imageUrl })
                                            });
                                            if (res.ok) {
                                                alert("Model cumpărat cu succes!");
                                                window.location.reload();
                                            } else alert("Eroare la cumpărare");
                                        } catch (err) { alert("Eroare de rețea"); }
                                        btn.disabled = false;
                                    }}
                                    className="magic-bg text-white px-6 py-3 rounded-2xl font-black text-sm shadow-magic hover:scale-105 transition-all flex items-center gap-2 active:scale-95"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    {item.price} Credite
                                </button>
                            ) : (
                                <div className="text-2xl font-black magic-text">
                                    {item.price === 0 ? "GRATUIT" : `${item.price} CT`}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-primary font-black text-sm italic">
                            <Sparkles className="w-4 h-4" />
                            Creația Ta
                        </div>
                    )}

                    <div className="flex gap-2">
                        {type === "creations" && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-3 rounded-2xl glass hover:bg-red-500 hover:text-white text-red-500 border-white/10 transition-all shadow-premium"
                            >
                                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                            </button>
                        )}
                        {!item.isSketchfab && (
                            <button
                                className="p-3 rounded-2xl glass hover:bg-primary hover:text-white border-white/10 transition-all shadow-premium"
                                onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = item.modelUrl;
                                    a.download = `${title}.glb`;
                                    a.click();
                                }}
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
