import React, { useState, useEffect, useRef } from "react";
import { NavTab, ChildProfile, VitalRecord } from "../types";
import { Volume2, Camera, RefreshCw, X, CheckCircle2, Utensils } from "lucide-react";

interface AiScanViewProps {
  child: ChildProfile;
  vitals: VitalRecord;
  onNavigate: (tab: NavTab) => void;
  isDarkMode?: boolean;
}

export const AiScanView: React.FC<AiScanViewProps> = ({ child, onNavigate, isDarkMode = false }) => {
  const [scanMode, setScanMode] = useState<"camera" | "distraction" | "result">("camera");
  const [isDistractingSoundsOn, setIsDistractingSoundsOn] = useState(false);
  const [isCapturing, setIsCalculating] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);

  const playSoothingSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chime
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.6);
      });
    } catch {
      // Audio play error
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (scanMode === "camera" || scanMode === "distraction") {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
          if (pipVideoRef.current) pipVideoRef.current.srcObject = s;
        })
        .catch(() => {
          // Camera permission fallback
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [scanMode]);

  const handleCapture = () => {
    setIsCalculating(true);
    if (isDistractingSoundsOn) playSoothingSound();

    setTimeout(() => {
      setIsCalculating(false);
      setScanMode("result");
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full relative pt-16 pb-32 min-h-screen px-4 max-w-lg mx-auto">
      {/* 1. CAMERA SCAN FRAME MODE */}
      {scanMode === "camera" && (
        <div className="flex flex-col items-center justify-between min-h-[calc(100vh-140px)] animate-fade-in relative z-10">
          {/* Top Instruction */}
          <div className="text-center pt-3">
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
              Let's check in on their growth
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>
              Position {child.name} inside the gentle frame below.
            </p>
          </div>

          {/* Positioning Guide */}
          <div className={`relative w-full max-w-[300px] h-[380px] my-6 flex items-center justify-center rounded-3xl overflow-hidden shadow-inner border transition-colors ${
            isDarkMode ? "bg-[#14231b] border-[#3fff80]/40" : "bg-[#efeeea] border-[#cceacc]"
          }`}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none ${
              isDarkMode ? "from-[#0a120e]/40 via-transparent to-[#0a120e]/80" : "from-[#faf9f5]/30 via-transparent to-[#faf9f5]/80"
            }`} />

            {/* Silhouette Outline */}
            <svg
              className={`w-full h-[320px] drop-shadow-md opacity-85 z-10 animate-pulse ${
                isDarkMode ? "text-[#3fff80]" : "text-[#2d4739]"
              }`}
              viewBox="0 0 200 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50 C 130 50, 140 80, 140 100 C 140 130, 110 150, 100 150 C 90 150, 60 130, 60 100 C 60 80, 70 50, 100 50 Z"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
              <path
                d="M100 150 L 100 250"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
              <path
                d="M100 170 C 140 180, 160 220, 160 250"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
              <path
                d="M100 170 C 60 180, 40 220, 40 250"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
              <path
                d="M100 250 C 120 280, 130 350, 130 380"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
              <path
                d="M100 250 C 80 280, 70 350, 70 380"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
            </svg>

            {/* Corner Brackets */}
            <div className={`absolute top-4 left-4 w-7 h-7 border-t-3 border-l-3 rounded-tl-lg ${isDarkMode ? "border-[#3fff80]" : "border-[#173124]"}`} />
            <div className={`absolute top-4 right-4 w-7 h-7 border-t-3 border-r-3 rounded-tr-lg ${isDarkMode ? "border-[#3fff80]" : "border-[#173124]"}`} />
            <div className={`absolute bottom-4 left-4 w-7 h-7 border-b-3 border-l-3 rounded-bl-lg ${isDarkMode ? "border-[#3fff80]" : "border-[#173124]"}`} />
            <div className={`absolute bottom-4 right-4 w-7 h-7 border-b-3 border-r-3 rounded-br-lg ${isDarkMode ? "border-[#3fff80]" : "border-[#173124]"}`} />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 w-full pb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const nextState = !isDistractingSoundsOn;
                  setIsDistractingSoundsOn(nextState);
                  if (nextState) playSoothingSound();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-xs active:scale-95 transition-all border ${
                  isDarkMode
                    ? "bg-[#14231b] border-[#22392b] text-[#ffffff]"
                    : "bg-[#e9e8e4] border-[#e3e2df] text-[#424844]"
                }`}
              >
                <Volume2 className={`w-4 h-4 ${isDarkMode ? "text-[#3fff80]" : "text-[#4f6951]"}`} />
                <span className="text-xs font-semibold">Distract with sounds</span>
                <span
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    isDistractingSoundsOn
                      ? isDarkMode ? "bg-[#3fff80]" : "bg-[#173124]"
                      : "bg-[#bfc9bf]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      isDarkMode ? "bg-[#0a120e]" : "bg-white"
                    } ${isDistractingSoundsOn ? "translate-x-4" : "translate-x-0"}`}
                  />
                </span>
              </button>

              <button
                onClick={() => setScanMode("distraction")}
                className={`text-xs font-bold px-3 py-2 rounded-full shadow-xs transition-all ${
                  isDarkMode
                    ? "bg-[#3fff80] text-[#0a120e] hover:bg-[#34e06e]"
                    : "bg-[#cae8c9] text-[#07200e] hover:bg-[#b1ceb1]"
                }`}
              >
                Mascot Mode
              </button>
            </div>

            {/* Shutter Button */}
            <div className="relative mt-2">
              <div className={`absolute inset-0 rounded-full blur-lg animate-pulse ${
                isDarkMode ? "bg-[#3fff80]/30" : "bg-[#173124]/20"
              }`} />
              <button
                onClick={handleCapture}
                disabled={isCapturing}
                className="relative w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center p-2 hover:scale-105 active:scale-95 transition-transform"
              >
                <div className={`w-full h-full rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#173124] text-white"
                }`}>
                  {isCapturing ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DISTRACTION MODE */}
      {scanMode === "distraction" && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] animate-fade-in relative">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-extrabold tracking-tight mb-1 ${
              isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
            }`}>
              DISTRACTION MODE ON
            </h1>
            <p className={`text-lg ${isDarkMode ? "text-[#ffffff]" : "text-[#424844]"}`}>
              Look here, {child.name}!
            </p>
          </div>

          <div
            onClick={playSoothingSound}
            className="relative w-64 h-64 mb-8 flex items-center justify-center cursor-pointer transform hover:scale-105 active:scale-95 transition-transform"
          >
            <svg
              className="w-full h-full drop-shadow-lg"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M40 100 C40 40 160 40 160 100 C160 160 40 160 40 100 Z"
                fill={isDarkMode ? "#3fff80" : "#cae8c9"}
              />
              <circle cx="80" cy="90" r="8" fill="#062014" />
              <circle cx="120" cy="90" r="8" fill="#062014" />
              <polygon points="90,105 110,105 100,120" fill="#4a654d" />
              <path d="M30 90 Q10 110 30 130 Q50 110 30 90 Z" fill="#b0cdbb" />
              <path d="M170 90 Q190 110 170 130 Q150 110 170 90 Z" fill="#b0cdbb" />
            </svg>
          </div>

          <p className={`text-xs mb-6 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`}>
            Tap the bird for a cheerful chime!
          </p>

          <button
            onClick={() => setScanMode("camera")}
            className={`font-semibold text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-colors shadow-xs border ${
              isDarkMode
                ? "bg-[#14231b] border-[#22392b] text-[#ffffff] hover:bg-[#1f3829]"
                : "bg-[#e9e8e4] border-[#e3e2df] text-[#424844] hover:bg-[#e3e2df]"
            }`}
          >
            <X className="w-5 h-5" />
            Exit Distraction Mode
          </button>
        </div>
      )}

      {/* 3. SCAN RESULT MODE */}
      {scanMode === "result" && (
        <div className="flex flex-col w-full relative pt-2 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xs ${
              isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#cae8c9] text-[#07200e]"
            }`}>
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>

          <h1 className={`text-2xl font-bold text-center mb-1 ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
            {child.name} is growing normally
          </h1>
          <p className={`text-sm text-center mb-6 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>
            Last checked today at 10:42 AM
          </p>

          <div className={`rounded-2xl p-5 mb-6 flex flex-col gap-4 border ${
            isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#f4f4f0] border-[#e3e2df]"
          }`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-[#3fff80]" : "text-[#727973]"}`}>
              LATEST MEASUREMENTS
            </h2>

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className={`text-xs mb-0.5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>Weight</span>
                <span className={`text-2xl font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
                  14.2 <span className={`text-sm font-normal ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>kg</span>
                </span>
              </div>
            </div>

            <div className={`w-full h-px ${isDarkMode ? "bg-[#22392b]" : "bg-[#c2c8c2]/40"}`} />

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className={`text-xs mb-0.5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>Height</span>
                <span className={`text-2xl font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
                  94.5 <span className={`text-sm font-normal ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>cm</span>
                </span>
              </div>
            </div>

            <div className={`w-full h-px ${isDarkMode ? "bg-[#22392b]" : "bg-[#c2c8c2]/40"}`} />

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className={`text-xs mb-0.5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>MUAC</span>
                <span className={`text-2xl font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
                  15.0 <span className={`text-sm font-normal ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>cm</span>
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${
                isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#4f6951]"
              }`}>
                <div className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-[#3fff80]" : "bg-[#4a654d]"}`} />
                <span className="text-xs font-semibold">Healthy</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-8">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-[#3fff80]" : "text-[#727973]"}`}>
              WHAT THIS MEANS
            </h3>
            <p className={`text-base leading-relaxed ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
              {child.name} is right on track. Weight and height are perfectly balanced, and arm circumference shows good nutrition intake!
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onNavigate("nutrition-plan")}
              className={`w-full font-bold py-4 rounded-full flex items-center justify-center gap-2 active:scale-98 transition-all ${
                isDarkMode ? "bg-[#3fff80] text-[#0a120e] hover:bg-[#34e06e]" : "bg-[#173124] text-white hover:bg-[#2d4739]"
              }`}
            >
              <Utensils className="w-5 h-5" />
              View nutrition plan
            </button>
            <button
              onClick={() => setScanMode("camera")}
              className={`w-full border-2 font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all ${
                isDarkMode
                  ? "border-[#3fff80] text-[#3fff80] hover:bg-[#3fff80]/10"
                  : "border-[#173124] text-[#173124] hover:bg-[#173124]/5"
              }`}
            >
              Scan again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
