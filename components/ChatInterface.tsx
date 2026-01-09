"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MessageSquare, Volume2, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
    characterName?: string;
    characterDescription?: string;
}

export default function ChatInterface({
    characterName = "Prietenul Tău",
    characterDescription = "un personaj prietenos"
}: ChatInterfaceProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Ref pentru a derula chat-ul la ultimul mesaj
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Funcția care face personajul să "vorbească"
    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            // Oprim orice vorbire anterioară
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ro-RO'; // Încercăm limba română
            utterance.rate = 1; // Viteza normală
            utterance.pitch = 1.2; // Puțin mai subțire, ca pentru copii

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    // Logica simplă de "AI" pentru demo (fără API key încă)
    const handleSend = () => {
        if (!input.trim()) return;

        // 1. Adăugăm mesajul utilizatorului
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");

        // 2. Simulăm gândirea AI-ului
        setTimeout(() => {
            let aiResponse = "";

            // Răspunsuri simple bazate pe cuvinte cheie (Mock AI)
            const lowerInput = userMsg.toLowerCase();
            if (lowerInput.includes("salut") || lowerInput.includes("buna")) {
                aiResponse = `Salutare! Sunt ${characterName}. Ce vrei să facem azi?`;
            } else if (lowerInput.includes("nume") || lowerInput.includes("cheama")) {
                aiResponse = `Eu sunt ${characterName}! Îmi place mult numele meu.`;
            } else if (lowerInput.includes("ce faci")) {
                aiResponse = "Mă uit la tine și mă bucur că m-ai creat! Arăt grozav, nu?";
            } else if (lowerInput.includes("jucam") || lowerInput.includes("joc")) {
                aiResponse = "Da! Ador să mă joc! Hai să explorăm lumea împreună în 3D!";
            } else {
                aiResponse = "Wow! Sună interesant. Povestește-mi mai multe!";
            }

            setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
            speak(aiResponse);
        }, 1000);
    };

    if (!isOpen) {
        return (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="absolute bottom-6 left-6 z-20 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg border-2 border-white/20 flex items-center gap-2 font-bold"
            >
                <MessageSquare className="w-6 h-6" />
                <span>Vorbește cu mine!</span>
            </motion.button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-6 left-6 z-20 w-80 md:w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
        >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-full">
                        {isSpeaking ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <span className="font-bold">{characterName}</span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                    ✕
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        <p>Spune "Salut"!</p>
                        <p className="text-sm">Sunt nerăbdător să vorbim.</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "p-3 rounded-2xl max-w-[85%] text-sm font-medium",
                            msg.role === 'user'
                                ? "bg-primary text-white ml-auto rounded-tr-none"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-auto rounded-tl-none"
                        )}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Scrie ceva..."
                    className="flex-1 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button
                    onClick={handleSend}
                    className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
