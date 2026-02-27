"use client";

import Link from "next/link";
import { Rocket, Heart, Sparkles, Mail, Shield, BookOpen, Users } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    const links = [
        {
            title: "Platformă",
            items: [
                { name: "Creează", href: "/create" },
                { name: "Galerie", href: "/gallery" },
                { name: "Enciclopedie 3D", href: "/learn" },
            ],
        },
        {
            title: "Comunitate",
            items: [
                { name: "Părinți", href: "/parents" },
                { name: "Siguranță", href: "#" },
                { name: "Contact", href: "#" },
            ],
        },
    ];

    return (
        <footer className="relative mt-20 overflow-hidden">
            {/* Top gradient separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-glow" />

            <div className="relative bg-muted/20 dark:bg-black/40 backdrop-blur-3xl pt-24 pb-12 px-4 border-t border-white/5">
                {/* Ambient glow in footer */}
                <div className="absolute top-0 left-1/4 w-1/2 h-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                        {/* Brand Column */}
                        <div className="md:col-span-5">
                            <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
                                <div className="magic-bg p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                    <span className="text-lg">⚡</span>
                                </div>
                                <span className="text-2xl font-black tracking-tight">
                                    Kid<span className="magic-text">my</span>
                                </span>
                            </Link>
                            <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-xs mb-8">
                                Platforma unde copiii explorează creativitatea prin puterea AI și modele 3D magice. Sigur, distractiv și educativ.
                            </p>

                            {/* Feature Pills */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: Shield, text: "Sigur pentru copii" },
                                    { icon: Sparkles, text: "AI avansat" },
                                    { icon: BookOpen, text: "Educativ" },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground border border-border/60 rounded-full px-3 py-1.5 bg-background/50">
                                        <Icon className="w-3 h-3 text-primary" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Links Columns */}
                        {links.map((col) => (
                            <div key={col.title} className="md:col-span-2">
                                <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-5">{col.title}</h4>
                                <ul className="space-y-3">
                                    {col.items.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* CTA Column */}
                        <div className="md:col-span-3">
                            <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-5">Începe Acum</h4>
                            <p className="text-sm text-muted-foreground font-medium mb-4 leading-relaxed">
                                Creează primul tău model 3D gratuit în mai puțin de 2 minute.
                            </p>
                            <Link
                                href="/create"
                                className="inline-flex items-center gap-2 magic-bg text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-magic transition-all hover:scale-105 active:scale-95"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Creează Gratuit
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="h-px bg-border/50 mb-8" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <span>© {year} Kidmy.</span>
                            <span className="opacity-50">·</span>
                            <span>Toate drepturile rezervate.</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            Creat cu <Heart className="w-3.5 h-3.5 text-accent fill-current" /> pentru micii artiști ai lumii
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-primary transition-colors">Confidențialitate</a>
                            <a href="#" className="hover:text-primary transition-colors">Termeni</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
