"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Rocket, Sparkles, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Acasă", href: "/" },
        { name: "Galerie", href: "/gallery" },
        { name: "Lumea Animalelor", href: "/learn" },
        { name: "Părinți", href: "/parents" },
    ];

    return (
        <nav
            className={cn(
                "fixed w-full z-50 top-0 left-0 transition-all duration-300 px-4 py-4 md:px-8",
                scrolled ? "md:py-4" : "md:py-6"
            )}
        >
            <div
                className={cn(
                    "max-w-7xl mx-auto rounded-[2rem] transition-all duration-300 border border-transparent px-6 md:px-10",
                    scrolled
                        ? "glass shadow-premium border-white/20 py-3"
                        : "py-4 md:py-2"
                )}
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative">
                        <motion.div
                            whileHover={{ rotate: 12, scale: 1.1 }}
                            className="magic-bg p-2.5 rounded-2xl shadow-magic"
                        >
                            <Rocket className="text-white w-6 h-6" />
                        </motion.div>
                        <span className="text-2xl font-black tracking-tighter text-foreground">
                            Kidmy<span className="text-primary">.</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex flex-1 justify-center items-center">
                        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border/40">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-5 py-2 rounded-xl text-sm font-black text-muted-foreground hover:text-primary hover:bg-white dark:hover:bg-white/5 transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {!session ? (
                            <Link
                                href="/login"
                                className="text-foreground hover:text-primary font-black text-sm px-6 py-2 transition-all flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                Autentificare
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/create"
                                    className="magic-bg text-white px-8 py-2.5 rounded-2xl font-black text-sm shadow-premium hover:shadow-magic transition-all hover:scale-105 flex items-center gap-2 active:scale-95"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Creează
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    title="Ieșire"
                                    className="p-2.5 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2.5 rounded-2xl glass border-white/20 text-foreground"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute top-24 left-4 right-4 glass border-white/20 rounded-[3rem] p-8 shadow-2xl md:hidden"
                        >
                            <div className="flex flex-col gap-4 text-center">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-2xl font-black py-4 hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="h-px bg-border/50 my-4" />
                                {!session ? (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="text-2xl font-black py-4 hover:text-primary transition-colors"
                                    >
                                        Autentificare
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/create"
                                            onClick={() => setIsOpen(false)}
                                            className="magic-bg text-white py-5 rounded-[2rem] text-2xl font-black shadow-magic"
                                        >
                                            Începe magia
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="text-red-500 font-black py-4 text-xl"
                                        >
                                            Ieșire cont
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
