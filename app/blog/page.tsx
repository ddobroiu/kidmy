"use client";

import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, BookOpen } from "lucide-react";

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
                    >
                        Blog <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Kidmy</span>
                    </motion.h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                        Idei, ghiduri și povești despre cum tehnologia poate transforma educația copiilor noștri.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all flex flex-col h-full"
                        >
                            <Link href={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black uppercase px-4 py-2 rounded-full shadow-lg">
                                    {post.category}
                                </div>
                            </Link>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4 font-bold">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </div>

                                <h2 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>

                                <p className="text-gray-500 dark:text-gray-400 mb-8 line-clamp-3 font-medium">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-primary font-black group-hover:gap-4 transition-all"
                                    >
                                        Citește Articolul <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}
