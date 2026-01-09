"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Pencil, Gamepad2, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-white dark:bg-black/90">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/30 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8 text-sm font-bold text-primary shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Magia 3D este aici!</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
          >
            Dă Vieță <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">Imaginației Tale</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Crează personaje unice, transformă desenele în modele 3D reale și joacă-te cu ele în Realitate Augmentată!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/create"
              className="bg-primary hover:bg-primary/90 text-white text-xl px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/30 transition-all hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <Wand2 className="w-6 h-6" />
              Creează Acum
            </Link>
            <Link
              href="/gallery"
              className="bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 text-xl px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              Vezi Galerie
            </Link>
          </motion.div>
        </div>

        {/* Floating 3D Elements Placeholder */}
        {/* We can add actual 3D elements here later */}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Cum Funcționează?</h2>
            <p className="text-gray-500 text-lg">Este super simplu să devii un creator 3D!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <FeatureCard
              icon={<Pencil className="w-8 h-8 text-white" />}
              color="bg-purple-500"
              title="1. Descrie sau Desenează"
              description="Scrie o descriere amuzantă sau încarcă un desen făcut de tine."
            />
            {/* Card 2 */}
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-white" />}
              color="bg-pink-500"
              title="2. Magia AI"
              description="Inteligența noastră artificială transformă ideea ta într-un model 3D în câteva secunde."
            />
            {/* Card 3 */}
            <FeatureCard
              icon={<Gamepad2 className="w-8 h-8 text-white" />}
              color="bg-yellow-500"
              title="3. Joacă-te!"
              description="Vezi personajul în camera ta cu AR sau descarcă-l pentru jocuri."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none"
    >
      <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
