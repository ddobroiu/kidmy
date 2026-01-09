"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle } from "lucide-react";

// Importăm dinamic componenta AR pentru a evita SSR (Server Side Rendering)
const ARView = dynamic(() => import("@/components/ARView"), {
    ssr: false,
    loading: () => <p className="text-white text-center mt-20">Se încarcă modulul AR...</p>
});

export default function PlayARPage() {
    const [arStatus, setArStatus] = useState<"checking" | "supported" | "unsupported">("checking");
    const [isClient, setIsClient] = useState(false);

    // Model de test
    const modelUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";

    useEffect(() => {
        setIsClient(true);
        if (navigator.xr) {
            navigator.xr.isSessionSupported('immersive-ar')
                .then((supported) => {
                    setArStatus(supported ? "supported" : "unsupported");
                })
                .catch((err) => {
                    console.error("WebXR check error:", err);
                    setArStatus("unsupported");
                });
        } else {
            console.log("WebXR not found");
            setArStatus("unsupported");
        }
    }, []);

    if (!isClient) return null; // Avoid hydration mismatch

    if (arStatus === "checking") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p>Se verifică compatibilitatea AR...</p>
            </div>
        );
    }

    if (arStatus === "unsupported") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-black">
                <div className="bg-yellow-100 p-6 rounded-full mb-6">
                    <AlertTriangle className="w-12 h-12 text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Dispozitiv Incompatibil cu WebXR</h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    Pentru a vedea personajul în cameră, ai nevoie de un telefon Android cu Chrome (sau iPhone cu aplicația WebXR Viewer).
                </p>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm mb-8">
                    <p className="font-bold mb-2">Alternativă:</p>
                    <p>Folosește "Atelierul Magic" (/create) pentru a vedea personajul pe ecran.</p>
                </div>
                <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Înapoi Acasă</a>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-black relative overflow-hidden">
            {/* AR View Component (Client Only) */}
            <ARView
                modelUrl={modelUrl}
            />
        </div>
    );
}
