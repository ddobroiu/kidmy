"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });

function Viewer() {
    const searchParams = useSearchParams();
    const url = searchParams.get("url");

    if (!url) return <div className="grid place-items-center min-h-screen bg-black text-white">Se încarcă...</div>;

    return (
        <div className="fixed inset-0 bg-black">
            <ModelViewer url={url} height="100%" showControls={true} />
        </div>
    );
}

export default function ViewPage() {
    return (
        <Suspense fallback={<div className="grid place-items-center min-h-screen bg-black text-white">Se încarcă...</div>}>
            <Viewer />
        </Suspense>
    );
}
