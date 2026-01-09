"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, ARButton, createXRStore } from "@react-three/xr";
import { useGLTF } from "@react-three/drei";
import { Vector3 } from "three";

// Create XR Store INSIDE the client-only module scope (it's fine here if the file is loaded only on client)
const store = createXRStore();

// Componenta pentru Modelul Plasat
function PlacedModel({ url, position }: { url: string, position: Vector3 }) {
    const model = useGLTF(url);
    const meshRef = useRef<any>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <primitive
            ref={meshRef}
            object={model.scene}
            position={position}
            scale={[0.5, 0.5, 0.5]}
        />
    );
}

// Scena Principală AR
function ARScene({ modelUrl }: { modelUrl: string }) {
    const modelPos = new Vector3(0, -0.5, -3);

    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={2} />
            <Suspense fallback={null}>
                <PlacedModel
                    url={modelUrl}
                    position={modelPos}
                />
            </Suspense>
        </>
    );
}

export default function ARView({
    modelUrl,
}: {
    modelUrl: string,
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
                    />
                </XR>
            </Canvas>
        </>
    );
}
