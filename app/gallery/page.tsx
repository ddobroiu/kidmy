"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, ShoppingCart, User, Download, Share2,
    Loader2, X, Search, LayoutGrid, Filter, SlidersHorizontal
} from "lucide-react";
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
        <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10 grid-pattern" />
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[5%] left-[-5%] w-[30%] h-[30%] bg-primary/6 rounded-full blur-[120px]" />
                <div className="absolute top-[50%] right-[-5%] w-[35%] h-[35%] bg-accent/5 rounded-full blur-[140px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* ─── Header ─── */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 border border-primary/20"
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Colecția Magică
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-black tracking-tight mb-5"
                        style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
                    >
                        Galeria de <span className="magic-text">Modele</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-base max-w-xl mx-auto font-medium"
                    >
                        Descoperă creații uimitoare sau alege modele premium gata de joacă.
                    </motion.p>
                </div>

                {/* ─── Tabs & Search bar ─── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50 w-fit mx-auto sm:mx-0">
                        <TabButton
                            active={activeTab === "creations"}
                            onClick={() => setActiveTab("creations")}
                            icon={<Sparkles className="w-4 h-4" />}
                            label="Creațiile Mele"
                        />
                        <TabButton
                            active={activeTab === "shop"}
                            onClick={() => setActiveTab("shop")}
                            icon={<ShoppingCart className="w-4 h-4" />}
                            label="Magazin"
                        />
                    </div>

                    {/* Search — only for shop */}
                    <AnimatePresence>
                        {activeTab === "shop" && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="relative flex-1 max-w-md ml-auto overflow-hidden"
                            >
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <input
                                    type="text"
                                    className="w-full pl-11 pr-4 py-2.5 glass border border-border/60 rounded-xl text-sm font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
                                    placeholder="Caută modele premium..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ─── Content ─── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl magic-bg flex items-center justify-center shadow-magic animate-pulse">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <p className="text-base font-bold text-muted-foreground">Se încarcă colecția...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {displayedItems.length === 0 ? (
                            <EmptyState activeTab={activeTab} />
                        ) : (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
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

/* ─── TabButton ─── */
function TabButton({ active, onClick, icon, label }: {
    active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                active
                    ? "bg-primary text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
            )}
        >
            {icon}
            {label}
        </button>
    );
}

/* ─── Empty State ─── */
function EmptyState({ activeTab }: { activeTab: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20"
        >
            <div className="text-6xl mb-6 animate-bounce-gentle">
                {activeTab === "creations" ? "🪄" : "💎"}
            </div>
            <h3 className="text-2xl font-black text-foreground mb-3">
                {activeTab === "creations" ? "Nicio creație încă..." : "Niciun model găsit"}
            </h3>
            <p className="text-muted-foreground font-medium mb-8 max-w-sm mx-auto text-sm">
                {activeTab === "creations"
                    ? "Fii primul care aduce creativitate în galerie!"
                    : "Încearcă altă căutare sau explorează toate modelele."}
            </p>
            {activeTab === "creations" && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                    <Link href="/create" className="magic-bg text-white px-6 py-3 rounded-xl font-black text-sm shadow-magic hover:scale-105 transition-all flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" /> Creează acum
                    </Link>
                    <Link href="/login" className="glass text-foreground px-6 py-3 rounded-xl font-black text-sm border border-border/60 hover:scale-105 transition-all flex items-center justify-center gap-2">
                        <User className="w-4 h-4" /> Autentifică-te
                    </Link>
                </div>
            )}
        </motion.div>
    );
}

/* ─── Gallery Card ─── */
function GalleryCard({ item, type, onRemove }: { item: any; type: "shop" | "creations"; onRemove?: (id: string) => void }) {
    const title = type === "shop" ? item.title : (item.prompt || "Personaj Misterios");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Ești sigur că vrei să ștergi această creație?")) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/gallery/item?id=${item.id}`, { method: "DELETE" });
            if (res.ok && onRemove) onRemove(item.id);
            else alert("Eroare la ștergere.");
        } catch {
            alert("Eroare de rețea.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="group glass border border-border/60 hover:border-primary/25 rounded-2xl overflow-hidden shadow-card hover:shadow-magic transition-all relative flex flex-col h-full"
        >
            {/* Image / Model area */}
            <div className="aspect-square relative bg-muted/30 overflow-hidden">
                {/* Type badge */}
                <div className="absolute top-3 left-3 z-20">
                    <div className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md",
                        type === "shop"
                            ? "bg-amber-400/90 text-amber-950"
                            : "bg-primary text-white"
                    )}>
                        {type === "shop" ? "💎 Premium" : "⚡ Tine"}
                    </div>
                </div>

                {/* Action buttons overlay */}
                <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    {type === "creations" && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-lg backdrop-blur-sm"
                        >
                            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                    )}
                    {!item.isSketchfab && (
                        <button
                            className="p-1.5 rounded-lg bg-white/90 dark:bg-black/60 text-foreground hover:bg-primary hover:text-white transition-colors shadow-lg backdrop-blur-sm"
                            onClick={() => {
                                const a = document.createElement('a');
                                a.href = item.modelUrl;
                                a.download = `${title}.glb`;
                                a.click();
                            }}
                        >
                            <Download className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                    {item.isSketchfab || !item.modelUrl?.startsWith('http') ? (
                        <div className="relative w-full h-full">
                            <img src={item.imageUrl} alt={title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="glass px-4 py-1.5 rounded-full text-white font-black text-xs border border-white/20">
                                    Previzualizare
                                </span>
                            </div>
                        </div>
                    ) : (
                        <ModelViewer url={item.modelUrl} showControls={false} />
                    )}
                </div>
            </div>

            {/* Card footer */}
            <div className="p-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-black truncate group-hover:text-primary transition-colors" title={title}>
                    {title}
                </h3>

                {type === "shop" ? (
                    <div className="shrink-0">
                        {item.isSketchfab ? (
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!confirm(`Cumpăr "${title}" cu ${item.price} credite?`)) return;
                                    const btn = e.currentTarget;
                                    btn.disabled = true;
                                    try {
                                        const res = await fetch("/api/gallery/buy-sketchfab", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ uid: item.uid || item.id, title: item.title, price: item.price, imageUrl: item.imageUrl })
                                        });
                                        if (res.ok) {
                                            alert("Cumpărat! 🎉");
                                            window.location.reload();
                                        } else alert("Eroare la cumpărare");
                                    } catch { alert("Eroare de rețea"); }
                                    btn.disabled = false;
                                }}
                                className="flex items-center gap-1.5 magic-bg text-white px-3 py-1.5 rounded-lg font-black text-xs shadow-lg hover:scale-105 transition-all"
                            >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                {item.price === 0 ? "Gratuit" : `${item.price} CT`}
                            </button>
                        ) : (
                            <div className="text-sm font-black magic-text">
                                {item.price === 0 ? "GRATUIT" : `${item.price} CT`}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="shrink-0 flex items-center gap-1 text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
