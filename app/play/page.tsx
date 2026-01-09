"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { XR, ARButton, Interactive } from "@react-three/xr";
import { Environment, useGLTF, Text, Html } from "@react-three/drei";
import { Matrix4, Vector3, Quaternion, Euler } from "three";
import { Mic, Volume2, Gamepad2, AlertTriangle } from "lucide-react";

// Componenta pentru Modelul Plasat
function PlacedModel({ url, position, isSpeaking, onSpeak }: { url: string, position: Vector3, isSpeaking: boolean, onSpeak: () => void }) {
    const model = useGLTF(url);
    const meshRef = useRef<any>(null);

    // Animație simplă "Idle" (plutire ușoară)
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
            // Salt mic când vorbește
            if (isSpeaking) {
                meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 10) * 0.05;
            } else {
                meshRef.current.position.y = position.y;
            }
        }
    });

    return (
        <Interactive onSelect={onSpeak}>
            <primitive
                ref={meshRef}
                object={model.scene}
                position={position}
                scale={[0.5, 0.5, 0.5]} // Scala modelului - ajustabil
            />
            {isSpeaking && (
                <Html position={[position.x, position.y + 1, position.z]} center>
                    <div className="bg-white px-3 py-1 rounded-full shadow-lg border border-primary animate-pulse">
                        <Volume2 className="w-5 h-5 text-primary" />
                    </div>
                </Html>
            )}
        </Interactive>
    );
}

// Scena Principală AR
function ARScene({ modelUrl, isSpeaking, onCharacterTouch }: { modelUrl: string, isSpeaking: boolean, onCharacterTouch: () => void }) {
    // Plasare fixă în fața camerei pentru moment (0, -0.5, -2)
    const modelPos = new Vector3(0, -0.5, -3);

    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={2} />

            <PlacedModel
                url={modelUrl}
                position={modelPos}
                isSpeaking={isSpeaking}
                onSpeak={onCharacterTouch}
            />
        </>
    );
}

export default function PlayARPage() {
    const [isArSupported, setIsArSupported] = useState(true); // Presupunem true, testăm la mount
    const [placed, setPlaced] = useState(false);
    const [transcript, setTranscript] = useState("Apasă pe ecran pentru a plasa personajul!");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Model de test (înlocuiește cu cel generat)
    // const modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

    // Vom folosi un URL public temporar pentru că useGLTF cere URL accesibil
    const modelUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";

    // Funcție simplă de Speak (Browser API)
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
        // Mock recognition
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

    useEffect(() => {
        if (navigator.xr) {
            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                setIsArSupported(supported);
            });
        } else {
            setIsArSupported(false);
        }
    }, []);

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
            {/* Butonul de Start AR (necesar pentru permisiuni) */}
            <div className="absolute inset-x-0 bottom-10 z-50 flex justify-center pointer-events-none">
                <ARButton
                    className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/20 transition-all flex items-center gap-3"
                    sessionInit={{ requiredFeatures: ['hit-test'] }}
                />
            </div>

            {/* Mesaje HUD (Heads-Up Display) */}
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

            {/* Canvas 3D */}
            <Canvas>
                <XR>
                    <ARScene
                        modelUrl={modelUrl}
                        isSpeaking={isSpeaking}
                        onCharacterTouch={handleCharacterTouch}
                    />
                </XR>
            </Canvas>
        </div>
    );
}
