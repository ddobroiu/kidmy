"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Pencil, Gamepad2, Wand2, Star, Zap, Rocket } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[var(--background)]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
        <motion.div
          style={{ opacity, scale }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full mb-8 text-sm font-bold text-primary shadow-premium border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wide uppercase text-[10px]">Viitorul Creativității este Aici</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-[1.1]"
          >
            Dă Vieță <br />
            <span className="magic-text">Imaginației Tale</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Cea mai avansată platformă pentru micii creatori. Transformă ideile în 3D cu puterea AI și explorează universuri noi în Realitate Augmentată.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/create"
              className="magic-bg hover:opacity-90 text-white text-xl px-12 py-5 rounded-2xl font-black shadow-magic transition-all hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center group"
            >
              <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Începe să Creezi
            </Link>
            <Link
              href="/gallery"
              className="glass hover:bg-white/50 dark:hover:bg-white/10 text-foreground text-xl px-12 py-5 rounded-2xl font-black transition-all hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center border-white/40 shadow-premium"
            >
              Exemple Magice
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <FloatingElement icon={<Star className="text-secondary" />} delay={0} top="20%" left="15%" />
          <FloatingElement icon={<Zap className="text-accent" />} delay={1} top="60%" left="10%" />
          <FloatingElement icon={<Rocket className="text-primary" />} delay={2} top="30%" right="15%" />
          <FloatingElement icon={<Sparkles className="text-primary" />} delay={0.5} bottom="20%" right="10%" />
        </motion.div>
      </section>

      {/* Stats/Social Proof (Makes it look profi) */}
      <section className="py-12 border-y border-border/50 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem label="Modele Create" value="10k+" />
          <StatItem label="Mici Artiști" value="2.5k" />
          <StatItem label="Lecții Interactive" value="50+" />
          <StatItem label="Rating Părinți" value="4.9/5" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl md:text-6xl font-black mb-6"
            >
              Cum aducem <span className="text-primary">Magia</span>?
            </motion.h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Tehnologie de ultimă oră pusă în mâinile copiilor, într-un mod sigur și distractiv.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Pencil className="w-10 h-10 text-white" />}
              color="bg-primary"
              title="Ideea Ta"
              description="Scrie un text sau încarcă un desen. AI-ul nostru înțelege imediat conceptul tău unic."
              delay={0}
            />
            <FeatureCard
              icon={<Sparkles className="w-10 h-10 text-white" />}
              color="bg-accent"
              title="Transformare 3D"
              description="În mai puțin de un minut, schița ta devine un obiect 3D complet, cu texturi și detalii incredibile."
              delay={0.2}
            />
            <FeatureCard
              icon={<Gamepad2 className="w-10 h-10 text-white" />}
              color="bg-secondary"
              title="Joacă și AR"
              description="Proiectează creația în camera ta folosind Realitatea Augmentată sau ia-o cu tine în jocuri."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section - The "Learn" preview enhanced */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="magic-bg rounded-[4rem] p-12 md:p-24 shadow-magic relative overflow-hidden text-white group"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 -skew-x-12 translate-x-20 transition-transform group-hover:translate-x-10 duration-700" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
              <span className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-8">
                Lumea Cunoașterii
              </span>
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                Învață Prin Experiențe 3D
              </h2>
              <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed font-medium">
                Nu doar creezi, ci și descoperi! Explorează modele 3D ale animalelor reale,
                ascultă poveștile lor și devino un expert al naturii.
              </p>
              <Link
                href="/learn"
                className="bg-white text-primary text-2xl px-16 py-6 rounded-3xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
              >
                Începe Aventura <ArrowRight className="w-8 h-8" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FloatingElement({ icon, top, left, right, bottom, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        delay
      }}
      className="absolute p-4 glass rounded-2xl shadow-premium"
      style={{ top, left, right, bottom }}
    >
      {icon}
    </motion.div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-3xl font-black text-foreground">{value}</span>
      <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay }: { icon: React.ReactNode, title: string, description: string, color: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -15, transition: { duration: 0.2 } }}
      className="glass border-white/40 p-10 rounded-[3rem] shadow-premium group"
    >
      <div className={`${color} w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-lg -rotate-6 group-hover:rotate-6 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground text-lg font-medium leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
