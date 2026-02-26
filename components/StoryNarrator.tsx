"use client";

import { useState, useEffect } from "react";
import { Mic, Speech, Volume2, VolumeX, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type StoryNarratorProps = {
    animalName: string;
    description: string;
    animalColor: string;
};

export default function StoryNarrator({ animalName, description, animalColor }: StoryNarratorProps) {
    const [story, setStory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial check for Speech Synthesis
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ro-RO";
        utterance.pitch = 1.1;
        utterance.rate = 0.95;

        // Try to find a Romanian voice
        const voices = window.speechSynthesis.getVoices();
        const roVoice = voices.find(v => v.lang.startsWith('ro'));
        if (roVoice) utterance.voice = roVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("Speech Error:", e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const generateStory = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/story", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ animalName, description }),
            });

            if (!res.ok) throw new Error("A apărut o eroare la crearea poveștii.");

            const data = await res.json();
            setStory(data.story);
            speak(data.story);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePlayback = () => {
        if (isSpeaking) {
            window.speechSynthesis.pause();
            setIsSpeaking(false);
        } else if (window.speechSynthesis.paused && story) {
            window.speechSynthesis.resume();
            setIsSpeaking(true);
        } else if (story) {
            speak(story);
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div className="flex flex-col gap-4 mt-6">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={story ? togglePlayback : generateStory}
                disabled={loading}
                className={`flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] font-black text-xl shadow-2xl transition-all relative overflow-hidden group
                    ${loading ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' :
                        isSpeaking ? 'bg-green-500 text-white shadow-green-500/30' :
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
                            <span>Povestitorul AI gândește...</span>
                        </div>
                    ) : isSpeaking ? (
                        <>
                            <Volume2 className="w-6 h-6 animate-pulse" />
                            <span>Ascultă Povestea...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span>{story ? "Reascultă Povestea" : "Spune-mi o Poveste (AI)"}</span>
                        </>
                    )}
                </div>
            </motion.button>

            <AnimatePresence>
                {story && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/80 dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-6 rounded-[2rem] shadow-xl relative"
                    >
                        <div className="absolute -top-3 left-8 bg-primary text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                            Povestea Magică
                        </div>
                        <p className="text-gray-700 dark:text-gray-200 text-lg italic leading-relaxed font-medium">
                            "{story}"
                        </p>

                        {isSpeaking && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleStop}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-full"
                                >
                                    <VolumeX className="w-4 h-4" /> Oprește Naratorul
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="text-red-500 text-sm font-bold text-center">{error}</p>
            )}
        </div>
    );
}
