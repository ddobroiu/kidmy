"use client";

import { use } from "react";
import { blogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) return notFound();

    return (
        <article className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* Back Button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-12 font-black transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Inapoi la Blog
                </Link>

                {/* Header Content */}
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary/10 text-primary text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full inline-block mb-6"
                    >
                        {post.category}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight"
                    >
                        {post.title}
                    </motion.h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-400 font-bold border-b border-gray-100 dark:border-white/5 pb-12">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {post.author}
                        </div>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors ml-auto">
                            <Share2 className="w-5 h-5" />
                            Distribuie
                        </button>
                    </div>
                </header>

                {/* Main Image */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative h-[300px] md:h-[500px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl"
                >
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Article Body */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-xl dark:prose-invert max-w-none 
                prose-headings:font-black prose-headings:tracking-tight
                prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-p:font-medium
                prose-strong:text-black dark:prose-strong:text-white prose-strong:font-black
                prose-h3:text-primary prose-h3:text-3xl prose-h3:mt-12
            "
                >
                    {post.content.split('\n').map((line, i) => {
                        if (line.trim().startsWith('###')) {
                            return <h3 key={i}>{line.replace('###', '').trim()}</h3>;
                        }
                        if (line.trim() === '') return <br key={i} />;
                        return <p key={i}>{line.trim()}</p>;
                    })}
                </motion.div>

                {/* Footer Info */}
                <footer className="mt-20 pt-12 border-t border-gray-100 dark:border-white/5">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-black mb-4">Ți-a plăcut articolul?</h2>
                        <p className="text-gray-400 font-medium mb-8 max-w-lg mx-auto">
                            Începe chiar astăzi aventura digitală alături de copilul tău pe platforma Kidmy.
                        </p>
                        <Link
                            href="/login"
                            className="bg-primary text-white text-lg px-12 py-4 rounded-2xl font-black inline-block shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                        >
                            Începe Acum Gratuit
                        </Link>
                    </div>
                </footer>
            </div>
        </article>
    );
}
