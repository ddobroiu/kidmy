"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles, BookOpen, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type StoryNarratorProps = {
    animalName: string;
    description: string;
    animalColor: string;
};

export default function StoryNarrator({ animalName, description, animalColor }: StoryNarratorProps) {
    const [facts, setFacts] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Clean up audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playAudio = (url: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = (e) => {
            console.error("Audio Playback Error:", e);
            setIsSpeaking(false);
            setError("Nu s-a putut reda fișierul audio.");
        };

        audio.play().catch(err => {
            console.error("Audio play failed:", err);
            setIsSpeaking(false);
        });
    };

    const generateFacts = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/story", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ animalName, description }),
            });

            if (!res.ok) throw new Error("A apărut o eroare la generarea informațiilor.");

            const data = await res.json();
            setFacts(data.story);
            setAudioUrl(data.audioUrl);

            if (data.audioUrl) {
                playAudio(data.audioUrl);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePlayback = () => {
        if (!audioRef.current) {
            if (audioUrl) playAudio(audioUrl);
            return;
        }

        if (isSpeaking) {
            audioRef.current.pause();
            setIsSpeaking(false);
        } else {
            audioRef.current.play();
            setIsSpeaking(true);
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsSpeaking(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-6">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={facts ? togglePlayback : generateFacts}
                disabled={loading}
                className={`flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] font-black text-xl shadow-2xl transition-all relative overflow-hidden group
                    ${loading ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' :
                        isSpeaking ? 'bg-indigo-500 text-white shadow-indigo-500/30' :
                            animalColor + ' text-white shadow-primary/30'}
                `}
            >
                {/* Background Animation while speaking */}
                {isSpeaking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/20 animate-pulse"
                    />
                )}

                <div className="relative z-10 flex items-center gap-3">
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 border-4 border-gray-300 border-t-white rounded-full animate-spin" />
                            <span>Ghidul AI caută informații...</span>
                        </div>
                    ) : isSpeaking ? (
                        <>
                            <Volume2 className="w-6 h-6 animate-bounce" />
                            <span>Ascultă Curiozitățile...</span>
                        </>
                    ) : (
                        <>
                            <BookOpen className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span>{facts ? "Reascultă Curiozitățile" : "Vrei să știi mai multe? (AI)"}</span>
                        </>
                    )}
                </div>
            </motion.button>

            <AnimatePresence>
                {facts && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/90 dark:bg-gray-900 border-2 border-primary/20 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Info className="w-12 h-12" />
                        </div>

                        <div className="absolute -top-3 left-8 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg z-20">
                            Enciclopedie Audio
                        </div>

                        <p className="text-gray-700 dark:text-gray-100 text-lg md:text-xl leading-relaxed font-bold relative z-10">
                            {facts}
                        </p>

                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4">
                            <span className="text-xs font-black text-primary uppercase tracking-widest">Voce Generată de AI (XTTS)</span>
                            {isSpeaking && (
                                <button
                                    onClick={handleStop}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 bg-red-500/10 px-4 py-2 rounded-full transition-all hover:scale-105"
                                >
                                    <VolumeX className="w-4 h-4" /> Oprește Redarea
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-black text-center">
                    {error}
                </div>
            )}
        </div>
    );
}
