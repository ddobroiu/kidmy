"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Pencil, Gamepad2, Wand2, Star, Zap, Rocket, Brain, Shield, Play, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { blogPosts } from "@/lib/blog-data";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 40]);

  return (
    <div ref={containerRef} className="relative">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 grid-pattern" />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/8 rounded-full blur-[160px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-secondary/6 rounded-full blur-[100px]" />
      </div>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-[95vh] flex flex-col items-center justify-center pt-28 pb-20 px-4 overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="flex items-center gap-2 glass border border-primary/20 px-4 py-2 rounded-full shadow-premium">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">Platforma #1 pentru micii creatori</span>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(3rem,9vw,7rem)] font-black mb-6 tracking-tight leading-[1.05]"
          >
            Unde{" "}
            <span className="relative inline-block">
              <span className="magic-text animate-gradient">Imaginația</span>
            </span>
            <br />
            <span className="text-foreground">devine</span>{" "}
            <span className="magic-text">3D</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[clamp(1.1rem,2.5vw,1.35rem)] text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Transformă idei în modele 3D cu AI, explorează lumi noi în Realitate Augmentată și devino un mic creator.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-4"
          >
            <Link
              href="/create"
              className="group relative magic-bg-hero text-white text-lg px-9 py-4 rounded-2xl font-black shadow-magic transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-glow flex items-center gap-3 w-full sm:w-auto justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform relative z-10" />
              <span className="relative z-10">Creează acum — e gratuit</span>
            </Link>
            <Link
              href="/learn"
              className="glass hover:bg-white/80 dark:hover:bg-white/10 text-foreground text-lg px-9 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center border border-border/60 shadow-card hover:shadow-premium group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                <Play className="w-4 h-4 text-primary group-hover:scale-110 transition-transform fill-current ml-0.5" />
              </div>
              Explorează Lumea
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center justify-center gap-6 mt-12 flex-wrap"
          >
            {[
              { icon: Shield, text: "100% Sigur pentru copii" },
              { icon: Star, text: "4.9★ Rating părinți" },
              { icon: Brain, text: "AI de ultimă generație" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Icon className="w-3.5 h-3.5 text-primary" />
                {text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating cards */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingCard emoji="🏎️" label="Model 3D" top="18%" left="5%" delay={0} />
          <FloatingCard emoji="🛸" label="Navă AI" top="30%" right="4%" delay={0.8} />
          <FloatingCard emoji="🪄" label="Desen Magic" bottom="25%" left="6%" delay={1.5} />
          <FloatingCard emoji="💎" label="Colecție" bottom="22%" right="5%" delay={2} />
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass border border-white/20 dark:border-white/5 rounded-3xl px-8 py-8 shadow-premium relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 text-center relative z-10">
              <StatItem value="10k+" label="Modele Create" emoji="🧊" />
              <StatItem value="2.5k" label="Mici Artiști" emoji="🦸" />
              <StatItem value="50+" label="Lecții 3D" emoji="🧩" />
              <StatItem value="4.9/5" label="Rating" emoji="🏆" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 border border-primary/20"
            >
              <Sparkles className="w-3.5 h-3.5" /> Cum Funcționează
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2rem,5vw,4rem)] font-black mb-5 tracking-tight"
            >
              3 pași spre{" "}
              <span className="magic-text">magie</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-xl mx-auto font-medium"
            >
              Simplu ca 1-2-3. Orice copil poate crea modele 3D uimitoare.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
            {/* Connecting lines (desktop) */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-primary to-accent opacity-30 z-0" />

            <StepCard
              step={1}
              icon={<Pencil className="w-6 h-6 text-white" />}
              color="from-violet-500 to-purple-600"
              title="Descrie ideea ta"
              description="Scrie un text sau încarcă un desen. AI-ul nostru înțelege orice descriere, oricât de creativă!"
              delay={0}
            />
            <StepCard
              step={2}
              icon={<Sparkles className="w-6 h-6 text-white" />}
              color="from-pink-500 to-rose-600"
              title="AI face magia"
              description="În mai puțin de 60 de secunde, ideea ta devine un model 3D complet cu texturi și detalii incredibile."
              delay={0.15}
              featured
            />
            <StepCard
              step={3}
              icon={<Gamepad2 className="w-6 h-6 text-white" />}
              color="from-amber-500 to-orange-500"
              title="Joacă în lumea ta"
              description="Explorează creația în Realitate Augmentată, descarcă-o sau adaug-o în colecția ta."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ═══ LEARN PROMO ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 magic-bg-hero" />
            <div className="absolute inset-0 dots-pattern opacity-20" />
            <div className="absolute top-0 right-0 w-2/3 h-full opacity-10">
              <div className="text-[20rem] leading-none font-black text-white opacity-30 absolute -top-10 -right-10">🪐</div>
            </div>

            <div className="relative z-10 p-10 md:p-16 lg:p-20">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-widest mb-8 border border-white/20">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Nou · Enciclopedia 3D
                </div>
                <h2 className="text-white font-black leading-tight mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                  Descoperă lumea în 3D interactiv
                </h2>
                <p className="text-white/80 text-lg mb-10 leading-relaxed font-medium max-w-lg">
                  Explorează modele 3D din diverse categorii (animale, spațiu, vehicule), ascultă poveștile lor și devino un expert al lumii care ne înconjoară.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/learn"
                    className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all text-base group"
                  >
                    Începe Aventura
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-8 py-4 rounded-2xl font-black transition-all text-base border border-white/20"
                  >
                    <Rocket className="w-5 h-5" />
                    Galeria de Creații
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-8 animate-bounce-gentle">🛸</div>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black mb-5 tracking-tight">
              Gata să creezi{" "}
              <span className="magic-text">ceva uimitor?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 font-medium">
              Alătură-te miilor de copii creativi care construiesc viitorul digital astăzi.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 magic-bg-hero text-white px-10 py-5 rounded-2xl font-black text-lg shadow-magic hover:scale-105 hover:shadow-glow transition-all active:scale-95"
            >
              <Zap className="w-5 h-5" />
              Începe Gratuit Acum
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Blog Section Preview */}
      <section className="py-24 bg-gray-50/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Sfaturi și Noutăți</h2>
            <p className="text-gray-500 font-medium">Descoperă cum tehnologia 3D transformă viitorul copiilor.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-white/5 group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                    <span className="text-primary font-black text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      Citește mai mult <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-black transition-colors"
            >
              Vezi tot blogul <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────── Sub-components ─────── */

function FloatingCard({ emoji, label, top, left, right, bottom, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.5, duration: 0.5 }}
      style={{ top, left, right, bottom }}
      className="absolute animate-float hidden lg:flex group"
    >
      <div className="glass border border-white/30 dark:border-white/10 px-4 py-2.5 rounded-2xl shadow-premium flex items-center gap-3 backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_-5px_var(--primary)] group-hover:-translate-y-1">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xl">
          {emoji}
        </div>
        <span className="text-sm font-black text-foreground/80">{label}</span>
      </div>
    </motion.div>
  );
}

function StatItem({ value, label, emoji }: { value: string; label: string; emoji: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 group cursor-default">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mb-1 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
        {emoji}
      </div>
      <div className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{value}</div>
      <div className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">{label}</div>
    </div>
  );
}

function StepCard({ step, icon, color, title, description, delay, featured }: {
  step: number; icon: React.ReactNode; color: string; title: string; description: string; delay: number; featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`relative rounded-2xl p-8 transition-all duration-300 group card-hover ${featured
        ? "border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 shadow-magic"
        : "glass border border-border/50 shadow-card"
        }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
          Cel Mai Popular
        </div>
      )}
      <div className="flex items-start gap-5">
        <div className={`relative shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          {icon}
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-foreground text-background text-[9px] font-black flex items-center justify-center">
            {step}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
