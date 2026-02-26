"use client";

import { Rocket, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative mt-20 pb-12 pt-20 px-4 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10 bg-muted/30" />

            <div className="max-w-7xl mx-auto">
                <div className="glass border-white/40 rounded-[3rem] p-10 md:p-16 shadow-premium flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                            <div className="magic-bg p-2 rounded-xl">
                                <Rocket className="text-white w-5 h-5" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter">
                                Kidmy<span className="text-primary">.</span>
                            </h3>
                        </div>
                        <p className="text-muted-foreground text-lg font-medium max-w-sm">
                            Platforma unde copiii explorează viitorul 3D prin magie și creativitate.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6 text-sm font-black uppercase tracking-widest text-muted-foreground">
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-primary transition-colors">Despre</a>
                            <a href="#" className="hover:text-primary transition-colors">Siguranță</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact</a>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                            Creat cu <Heart className="w-4 h-4 text-accent fill-accent" /> pentru micii artiști
                        </div>

                        <div className="text-[10px] opacity-40">
                            © {new Date().getFullYear()} Kidmy. Toate drepturile rezervate.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

