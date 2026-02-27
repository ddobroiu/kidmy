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
        const proxiedUrl = `/api/proxy-model?url=${encodeURIComponent(url)}`;
        el.setAttribute("src", proxiedUrl);
        if (poster) el.setAttribute("poster", poster);
        el.setAttribute("camera-controls", "");
        el.setAttribute("shadow-intensity", "1");
        el.setAttribute("shadow-softness", "1");
        el.setAttribute("auto-rotate", "");
        el.setAttribute("tone-mapping", "aces");
        el.setAttribute("environment-image", "neutral");
        el.setAttribute("autoplay", "");
        el.setAttribute("animation-crossfade-duration", "1000");

        if (showArButton) {
            el.setAttribute("ar", "");
            el.setAttribute("ar-modes", "webxr scene-viewer quick-look");
        }

        el.style.width = "100%";
        el.style.height = "100%";
        el.setAttribute("exposure", String(exposure));
        el.style.backgroundColor = bgColor === 'transparent' ? 'transparent' : bgColor;

        // Custom Progress Bar logic
        const progressBar = document.createElement("div");
        progressBar.slot = "progress-bar";
        progressBar.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 160px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 12px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        pointer-events: none;
        backdrop-filter: blur(8px);
        transition: opacity 0.3s;
        z-index: 100;
    `;

        progressBar.innerHTML = `
        <div style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: white; display: flex; align-items: center; gap: 6px;">
            <svg class="spinner" viewBox="0 0 50 50" style="width: 12px; height: 12px; animation: spin 1s linear infinite;">
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" style="opacity: 0.3"></circle>
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80" stroke-dashoffset="60"></circle>
            </svg>
            <span id="progress-text">Se încarcă magia... 0%</span>
        </div>
        <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
            <div id="progress-fill" style="width: 0%; height: 100%; background: #a855f7; transition: width 0.1s;"></div>
        </div>
    `;

        el.appendChild(progressBar);

        const onProgress = (event: any) => {
            const percentage = event.detail.totalProgress * 100;
            const fill = progressBar.querySelector('#progress-fill') as HTMLElement;
            const text = progressBar.querySelector('#progress-text') as HTMLElement;
            if (fill) fill.style.width = `${percentage}%`;
            if (text) text.innerText = `Se încarcă magia... ${Math.round(percentage)}%`;
        };

        const onLoad = () => {
            progressBar.style.opacity = '0';
            setTimeout(() => {
                if (progressBar.parentElement) progressBar.parentElement.removeChild(progressBar);
            }, 500);
        };

        const onError = (error: any) => {
            console.error("ModelViewer Error:", error);
            const statusLabel = progressBar.querySelector('#progress-text') as HTMLElement;
            if (statusLabel) {
                statusLabel.innerText = "Eroare la model! (Verifică R2)";
                statusLabel.style.color = "#ef4444";
            }
        };

        el.addEventListener('progress', onProgress);
        el.addEventListener('load', onLoad);
        el.addEventListener('error', onError);

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
            if (bgColor === 'transparent') {
                viewerRef.current.style.backgroundColor = 'transparent';
            } else {
                viewerRef.current.style.backgroundColor = bgColor;
            }
        }
    }, [exposure, bgColor]);

    return (
        <div
            className={`w-full overflow-hidden flex flex-col relative ${className}`}
            style={{ height: height }}
        >
            <div
                ref={hostRef}
                className="w-full flex-1 relative min-h-0"
            >
                {showArButton && !isTouch && (
                    <div className="absolute top-4 right-4 z-50">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowQR(!showQR);
                            }}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-lg border border-white/10 transition-all shadow-lg"
                        >
                            <span className="text-xs font-bold">AR Mobile</span>
                        </button>

                        {showQR && (
                            <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 w-48 flex flex-col items-center">
                                <QRCode value={fullUrl} size={150} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showControls && (
                <div className="bg-white/5 border-t border-white/10 p-2 flex gap-4 items-center shrink-0">
                    <div className="flex items-center gap-2 flex-1">
                        <input
                            type="range"
                            min="0.2"
                            max="2"
                            step="0.1"
                            value={exposure}
                            onChange={(e) => setExposure(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
