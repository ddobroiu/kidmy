"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Rocket, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl group-hover:rotate-12 transition-transform">
                            <Rocket className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary tracking-tight">
                            Kidmy
                        </span>
                    </Link>

                    {/* Desktop Menu - Centered */}
                    <div className="hidden md:flex flex-1 justify-center items-center">
                        <div className="flex items-baseline space-x-6">
                            <Link href="/" className="hover:text-primary px-3 py-2 rounded-md font-bold transition-colors">
                                Acasă
                            </Link>
                            <Link href="/gallery" className="hover:text-primary px-3 py-2 rounded-md font-bold transition-colors">
                                Galerie
                            </Link>
                            <Link href="/parents" className="hover:text-primary px-3 py-2 rounded-md font-bold transition-colors">
                                Părinți
                            </Link>
                        </div>
                    </div>

                    {/* Action Buttons - Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        {!session ? (
                            <Link
                                href="/login"
                                className="text-gray-900 dark:text-white hover:text-primary font-bold px-4 py-2 transition-colors border border-gray-200 dark:border-white/10 rounded-full hover:border-primary"
                            >
                                Logare
                            </Link>
                        ) : (
                            <button
                                onClick={() => signOut()}
                                className="text-gray-900 dark:text-white hover:text-red-500 font-bold px-4 py-2 transition-colors"
                            >
                                Ieșire
                            </button>
                        )}

                        {session && (
                            <Link
                                href="/create"
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-primary/30 transition-all hover:scale-105 flex items-center gap-2"
                            >
                                <Gamepad2 className="w-5 h-5" />
                                Creează
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X className="block h-8 w-8" /> : <Menu className="block h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                        <Link href="/" className="text-gray-900 dark:text-white hover:text-primary block px-3 py-4 rounded-md text-base font-bold text-xl">
                            Acasă
                        </Link>
                        <Link href="/gallery" className="text-gray-900 dark:text-white hover:text-primary block px-3 py-4 rounded-md text-base font-bold text-xl">
                            Galerie
                        </Link>
                        <Link href="/parents" className="text-gray-900 dark:text-white hover:text-primary block px-3 py-4 rounded-md text-base font-bold text-xl">
                            Părinți
                        </Link>

                        {!session ? (
                            <Link href="/login" className="text-gray-900 dark:text-white hover:text-primary block px-3 py-4 rounded-md text-base font-bold text-xl">
                                Logare
                            </Link>
                        ) : (
                            <button onClick={() => signOut()} className="w-full text-red-500 hover:text-red-600 block px-3 py-4 rounded-md text-base font-bold text-xl">
                                Ieșire
                            </button>
                        )}

                        {session && (
                            <Link href="/create" className="mt-4 bg-primary text-white block px-3 py-4 rounded-xl text-base font-bold text-xl mx-4">
                                Creează Acum
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
