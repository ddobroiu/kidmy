"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import "@google/model-viewer";

type Props = {
    url?: string;
    height?: number | string;
    poster?: string;
    showControls?: boolean;
    className?: string
};

export default function ModelViewer({ url = "", height = 400, poster, showControls = true, className = "" }: Props) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const viewerRef = useRef<HTMLElement | null>(null);
    const [exposure, setExposure] = useState(1);
    const [bgColor, setBgColor] = useState("transparent");
    const [showQR, setShowQR] = useState(false);
    const [fullUrl, setFullUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Just confirm we have a URL
            setFullUrl(url);
        }
    }, [url]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        const existing = host.querySelector("model-viewer");
        if (existing) host.removeChild(existing);

        const el = document.createElement("model-viewer");
        el.setAttribute("src", url);
        if (poster) el.setAttribute("poster", poster);
        el.setAttribute("camera-controls", "");
        el.setAttribute("shadow-intensity", "1");
        el.setAttribute("auto-rotate", "");
        el.setAttribute("ar", "");
        el.setAttribute("ar-modes", "webxr scene-viewer quick-look");
        el.style.width = "100%";
        el.style.height = "100%";
        el.setAttribute("exposure", String(exposure));
        // Transparent by default for better UI integration
        // el.style.backgroundColor = bgColor; 

        // Custom AR Button
        const arButton = document.createElement("button");
        arButton.slot = "ar-button";
        arButton.style.cssText = `
      position: absolute; 
      bottom: 20px; 
      right: 20px; 
      background-color: #8b5cf6; 
      color: white; 
      border-radius: 12px; 
      border: none; 
      padding: 10px 20px; 
      font-weight: bold; 
      font-family: inherit; 
      font-size: 14px; 
      cursor: pointer; 
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4); 
      z-index: 1000; 
      display: flex; 
      align-items: center; 
      gap: 8px;
    `;
        arButton.innerHTML = `
      <span>Vezi în Cameră (AR)</span>
    `;
        el.appendChild(arButton);

        host.appendChild(el);
        viewerRef.current = el;

        return () => {
            host.removeChild(el);
        };
    }, [url]);

    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.setAttribute("exposure", String(exposure));
            // viewerRef.current.style.backgroundColor = bgColor;
        }
    }, [exposure]);

    return (
        <div
            className={`w-full h-full flex flex-col relative ${className}`}
            style={{ height: height }}
        >
            <div
                ref={hostRef}
                className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-white/20 shadow-inner"
            />

            {/* Overlay Controls */}
            {showControls && (
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                        onClick={() => setShowQR(!showQR)}
                        className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        title="Cod QR pentru mobil"
                    >
                        <span className="text-xl">📱</span>
                    </button>
                    {showQR && (
                        <div className="absolute top-12 right-0 bg-white p-2 rounded-xl shadow-xl">
                            <QRCode value={url} size={100} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
