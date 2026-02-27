"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Acasă", href: "/", emoji: "⚡" },
        { name: "Galerie", href: "/gallery", emoji: "💎" },
        { name: "Blog", href: "/blog", emoji: "📝" },
        { name: "Descoperă", href: "/learn", emoji: "🪐" },
        { name: "Părinți", href: "/parents", emoji: "🛡️" },
    ];

    return (
        <nav className="fixed w-full z-50 top-0 left-0 px-4 pt-4 md:px-6">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                    "max-w-6xl mx-auto transition-all duration-500",
                    scrolled
                        ? "rounded-full glass shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 dark:border-white/10 py-3 px-6 backdrop-blur-2xl"
                        : "rounded-2xl py-4 px-6"
                )}
            >
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="relative">
                            <div className="magic-bg p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-lg leading-none">⚡</span>
                            </div>
                            <div className="absolute -inset-1 magic-bg rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-foreground">
                            Kid<span className="magic-text">my</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                                        isActive
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-primary/15 rounded-xl border border-primary/20"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative flex items-center gap-1.5">
                                        <span>{link.emoji}</span>
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        {!session ? (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-bold text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
                                >
                                    Intră în cont
                                </Link>
                                <Link
                                    href="/create"
                                    className="magic-bg text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-magic transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Creează
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50">
                                    <div className="w-6 h-6 rounded-full magic-bg flex items-center justify-center text-white text-xs font-black">
                                        {session.user?.name?.charAt(0).toUpperCase() || "K"}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-foreground max-w-[100px] truncate leading-none">
                                            {session.user?.name?.split(" ")[0] || "Hey!"}
                                        </span>
                                        <span className="text-[10px] font-black text-primary flex items-center gap-0.5 mt-0.5">
                                            <Sparkles className="w-2 h-2" />
                                            {session.user?.credits || 0} credite
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href="/create"
                                    className="magic-bg text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-magic transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Creează
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    title="Ieșire"
                                    className="p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-xl glass border-white/20 text-foreground hover:text-primary transition-colors"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isOpen ? "x" : "menu"}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10 mt-20"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-4 right-4 mt-2 glass border border-white/20 dark:border-white/5 rounded-2xl p-4 shadow-2xl md:hidden"
                        >
                            <div className="flex flex-col gap-1">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-foreground hover:bg-muted/60 hover:text-primary"
                                            )}
                                        >
                                            <span className="text-xl">{link.emoji}</span>
                                            {link.name}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="h-px bg-border/50 my-3" />

                            {!session ? (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <User className="w-4 h-4" /> Intră în cont
                                    </Link>
                                    <Link
                                        href="/create"
                                        onClick={() => setIsOpen(false)}
                                        className="magic-bg text-white py-3.5 rounded-xl text-base font-black shadow-magic flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" /> Creează Magie
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
                                        <div className="w-8 h-8 rounded-full magic-bg flex items-center justify-center text-white text-sm font-black">
                                            {session.user?.name?.charAt(0).toUpperCase() || "K"}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-foreground">
                                                {session.user?.name || "Super Creator"}
                                            </span>
                                            <span className="text-[12px] font-black text-primary flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                {session.user?.credits || 0} credite disponibile
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href="/create"
                                        onClick={() => setIsOpen(false)}
                                        className="magic-bg text-white py-3.5 rounded-xl text-base font-black shadow-magic flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" /> Creează Magie
                                    </Link>
                                    <button
                                        onClick={() => { signOut(); setIsOpen(false); }}
                                        className="flex items-center justify-center gap-2 text-red-500 font-black py-3 text-sm"
                                    >
                                        <LogOut className="w-4 h-4" /> Ieșire din cont
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
