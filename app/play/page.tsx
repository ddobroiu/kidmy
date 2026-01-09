"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Mic, AlertTriangle } from "lucide-react";

// Importăm dinamic componenta AR pentru a evita SSR (Server Side Rendering)
const ARView = dynamic(() => import("@/components/ARView"), {
    ssr: false,
    loading: () => <p className="text-white text-center mt-20">Se încarcă modulul AR...</p>
});

export default function PlayARPage() {
    const [isArSupported, setIsArSupported] = useState(true);
    const [transcript, setTranscript] = useState("Apasă pe ecran pentru a plasa personajul!");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Model de test
    const modelUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";

    useEffect(() => {
        setIsClient(true);
        if (navigator.xr) {
            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                setIsArSupported(supported);
            });
        } else {
            setIsArSupported(false);
        }
    }, []);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'ro-RO';
            u.onstart = () => setIsSpeaking(true);
            u.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(u);
        }
    };

    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Browserul tău nu suportă recunoaștere vocală.");
            return;
        }

        setIsListening(true);
        setTimeout(() => {
            setIsListening(false);
            const responses = [
                "Hei! Aud că vrei să ne jucăm!",
                "Uau, ce cameră frumoasă ai!",
                "Îmi place să fiu un personaj 3D!",
                "Sunt aici cu tine!"
            ];
            const reply = responses[Math.floor(Math.random() * responses.length)];
            setTranscript(reply);
            speak(reply);
        }, 2000);
    };

    const handleCharacterTouch = () => {
        speak("Gâdilă! Hahaha! Sunt prietenul tău!");
        setTranscript("Gâdilă! Hahaha!");
    };

    if (!isClient) return null; // Avoid hydration mismatch

    if (!isArSupported) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-black">
                <div className="bg-yellow-100 p-6 rounded-full mb-6">
                    <AlertTriangle className="w-12 h-12 text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Dispozitiv Incompatibil cu WebXR</h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    Pentru a vedea personajul în cameră și a vorbi cu el, ai nevoie de un telefon Android cu Chrome (sau iPhone cu aplicația WebXR Viewer).
                </p>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm mb-8">
                    <p className="font-bold mb-2">Alternativă:</p>
                    <p>Folosește "Atelierul Magic" (/create) pentru a vorbi cu personajul pe ecran.</p>
                </div>
                <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Înapoi Acasă</a>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-black relative overflow-hidden">

            {/* Mesaje HUD */}
            <div className="absolute top-8 left-0 right-0 z-40 px-6 text-center pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-2xl inline-block max-w-sm shadow-xl border border-white/10">
                    <p className="text-lg font-medium">{transcript}</p>
                </div>
            </div>

            {/* Controale (Microfon) */}
            <div className="absolute bottom-32 right-6 z-40 flex flex-col gap-4 pointer-events-auto">
                <button
                    onClick={handleMicClick}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 transition-all transform hover:scale-110 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-primary text-white'}`}
                >
                    <Mic className="w-8 h-8" />
                </button>
            </div>

            {/* AR View Component (Client Only) */}
            <ARView
                modelUrl={modelUrl}
                isSpeaking={isSpeaking}
                onCharacterTouch={handleCharacterTouch}
            />
        </div>
    );
}
