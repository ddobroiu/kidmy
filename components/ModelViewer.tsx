"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { FaExpand } from 'react-icons/fa';
import "@google/model-viewer";

type Props = {
    url?: string;
    height?: number | string;
    poster?: string;
    showControls?: boolean;
    showArButton?: boolean;
    className?: string;
    backgroundColor?: string;
    fullScreenUrl?: string | null;
};

export default function ModelViewer({
    url = "",
    height = 400,
    poster,
    showControls = true,
    showArButton = true,
    className = "",
    backgroundColor,
    fullScreenUrl
}: Props) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const viewerRef = useRef<HTMLElement | null>(null);
    const [exposure, setExposure] = useState(1);
    const [innerBgColor, setInnerBgColor] = useState("#202020");
    const [showQR, setShowQR] = useState(false);
    const [fullUrl, setFullUrl] = useState("");
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
    }, []);

    const bgColor = innerBgColor;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const viewerUrl = `${window.location.origin}/view?url=${encodeURIComponent(url)}`;
            setFullUrl(viewerUrl);

            // Inject global styles for model viewer spinner
            if (!document.getElementById('mv-spinner-style')) {
                const style = document.createElement('style');
                style.id = 'mv-spinner-style';
                style.innerHTML = `
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `;
                document.head.appendChild(style);
            }
        }
    }, [url]);

    useEffect(() => {
        if (backgroundColor) {
            setInnerBgColor(backgroundColor);
        }
    }, [backgroundColor]);

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
        el.setAttribute("shadow-softness", "1"); // Softer shadows
        el.setAttribute("auto-rotate", "");
        el.setAttribute("tone-mapping", "aces"); // Cinematic looking
        el.setAttribute("environment-image", "neutral"); // Better lighting
        el.setAttribute("autoplay", ""); // Auto-play animations
        el.setAttribute("animation-crossfade-duration", "1000"); // Smooth transitions
        if (showArButton) {
            el.setAttribute("ar", "");
            el.setAttribute("ar-modes", "webxr scene-viewer quick-look");
        }
        el.style.width = "100%";
        el.style.height = "100%";
        el.setAttribute("exposure", String(exposure));
        el.style.backgroundColor = bgColor;

        // Custom AR Button
        const arButton = document.createElement("button");
        arButton.slot = "ar-button";
        arButton.style.cssText = `
      position: absolute; 
      top: 16px; 
      right: 16px; 
      background-color: rgba(255, 255, 255, 0.9); 
      color: black; 
      border-radius: 12px; 
      border: none; 
      padding: 6px 12px; 
      font-weight: bold; 
      font-family: sans-serif; 
      font-size: 11px; 
      cursor: pointer; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
      z-index: 1000; 
      display: flex; 
      align-items: center; 
      gap: 6px;
      transform: translate(0, 0);
    `;
        arButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
      Vezi în AR
    `;
        el.appendChild(arButton);

        // Custom Progress Bar
        const progressBar = document.createElement("div");
        progressBar.slot = "progress-bar";
        progressBar.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 16px;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        pointer-events: none;
        backdrop-filter: blur(8px);
        transition: opacity 0.3s;
        z-index: 100;
    `;

        progressBar.innerHTML = `
        <div style="font-family: sans-serif; font-size: 12px; font-weight: bold; color: white; display: flex; align-items: center; gap: 8px;">
            <svg class="spinner" viewBox="0 0 50 50" style="width: 14px; height: 14px; animation: spin 1s linear infinite;">
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" style="opacity: 0.3"></circle>
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80" stroke-dashoffset="60"></circle>
            </svg>
            <span id="progress-text">Se încarcă... 0%</span>
        </div>
        <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
            <div id="progress-fill" style="width: 0%; height: 100%; background: #3b82f6; transition: width 0.1s;"></div>
        </div>
    `;

        el.appendChild(progressBar);

        // Event Listeners for Progress
        const onProgress = (event: any) => {
            const percentage = event.detail.totalProgress * 100;
            const fill = progressBar.querySelector('#progress-fill') as HTMLElement;
            const text = progressBar.querySelector('#progress-text') as HTMLElement;
            if (fill) fill.style.width = `${percentage}%`;
            if (text) text.innerText = `Se încarcă... ${Math.round(percentage)}%`;
        };

        const onLoad = () => {
            progressBar.style.opacity = '0';
            setTimeout(() => {
                if (progressBar.parentElement) progressBar.parentElement.removeChild(progressBar);
            }, 500);
        };

        el.addEventListener('progress', onProgress);
        el.addEventListener('load', onLoad);

        host.appendChild(el);
        viewerRef.current = el;

        return () => {
            if (host && host.contains(el)) {
                host.removeChild(el);
            }
        };
    }, [url]);

    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.setAttribute("exposure", String(exposure));

            // Fix background application
            if (bgColor === 'transparent') {
                viewerRef.current.style.backgroundColor = 'transparent';
                viewerRef.current.removeAttribute('environment-image');
            } else {
                viewerRef.current.style.backgroundColor = bgColor;
                viewerRef.current.setAttribute('environment-image', 'neutral');
            }
        }
    }, [exposure, bgColor]);

    return (
        <div
            className={`w-full h-full flex flex-col gap-2 overflow-hidden bg-gray-900 ${className} ${typeof height === 'number' ? 'rounded-xl border border-white/10' : ''}`}
            style={{ height: height }}
        >
            <div
                ref={hostRef}
                className="w-full flex-1 relative min-h-0 group"
            >
                {showArButton && !isTouch && (
                    <div className="absolute top-4 right-4 z-50 hidden lg:block">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowQR(!showQR);
                            }}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-lg border border-white/10 transition-all shadow-lg flex items-center gap-2"
                            title="Scanează pentru AR pe mobil"
                        >
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                            <span className="text-xs font-bold">AR pe Mobil</span>
                        </button>

                        {showQR && (
                            <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200 w-48 flex flex-col items-center">
                                <div className="bg-white p-1">
                                    <QRCode value={fullUrl} size={150} />
                                </div>
                                <p className="text-black text-[10px] font-bold mt-2 text-center leading-tight">
                                    Scanează cu telefonul<br />pentru vizualizare AR
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showControls && (
                <div className="bg-white/5 border-t border-white/10 p-2 flex flex-wrap gap-4 items-center shrink-0">
                    <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                        <span className="text-[10px] uppercase text-gray-400 font-bold whitespace-nowrap">Expunere</span>
                        <input
                            type="range"
                            min="0.2"
                            max="2"
                            step="0.1"
                            value={exposure}
                            onChange={(e) => setExposure(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {fullScreenUrl && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(fullScreenUrl, '_blank');
                                }}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10"
                                title="Ecran complet / Tab nou"
                            >
                                <FaExpand className="text-sm" />
                            </button>
                        )}

                        <span className="text-[10px] uppercase text-gray-400 font-bold ml-2">Fundal</span>
                        <div className="flex gap-1.5">
                            {["#202020", "#ffffff", "#000000", "#3b82f6", "#ef4444", "transparent"].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setInnerBgColor(color)}
                                    className={`w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-110 shadow-sm ${bgColor === color ? "ring-1 ring-white scale-110 border-transparent" : ""} ${color === 'transparent' ? 'bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] bg-center' : ''}`}
                                    style={{ backgroundColor: color === 'transparent' ? undefined : color }}
                                    aria-label={`Set background to ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
