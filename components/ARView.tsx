"use client";

import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, ARButton, Interactive, createXRStore } from "@react-three/xr";
import { useGLTF, Html } from "@react-three/drei";
import { Vector3 } from "three";
import { Volume2 } from "lucide-react";

// Create XR Store INSIDE the client-only module scope (it's fine here if the file is loaded only on client)
const store = createXRStore();

// Componenta pentru Modelul Plasat
function PlacedModel({ url, position, isSpeaking, onSpeak }: { url: string, position: Vector3, isSpeaking: boolean, onSpeak: () => void }) {
    const model = useGLTF(url);
    const meshRef = useRef<any>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
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
                scale={[0.5, 0.5, 0.5]}
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
    const modelPos = new Vector3(0, -0.5, -3);

    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={2} />
            <Suspense fallback={null}>
                <PlacedModel
                    url={modelUrl}
                    position={modelPos}
                    isSpeaking={isSpeaking}
                    onSpeak={onCharacterTouch}
                />
            </Suspense>
        </>
    );
}

export default function ARView({
    modelUrl,
    isSpeaking,
    onCharacterTouch
}: {
    modelUrl: string,
    isSpeaking: boolean,
    onCharacterTouch: () => void
}) {
    return (
        <>
            <div className="absolute inset-x-0 bottom-10 z-50 flex justify-center pointer-events-none">
                <ARButton
                    store={store}
                    className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/20 transition-all flex items-center gap-3"
                />
            </div>
            <Canvas>
                <XR store={store}>
                    <ARScene
                        modelUrl={modelUrl}
                        isSpeaking={isSpeaking}
                        onCharacterTouch={onCharacterTouch}
                    />
                </XR>
            </Canvas>
        </>
    );
}
