import React, { useState, useEffect, useRef } from "react";
import { NavTab, ChildProfile, VitalRecord } from "../types";
import { Volume2, Camera, RefreshCw, X, CheckCircle2, Utensils } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { RetroButton } from "./RetroButton";
import { ScanOverlay } from "./ScanOverlay";
import CardSwap, { Card } from "./CardSwap";

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
  const [selectedMascot, setSelectedMascot] = useState("cheetah");
  const [isMascotPlaying, setIsMascotPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);
  const mascotPreviewTimers = useRef<Record<string, number>>({});
  const localCartoonVideoPath = (name: string) => `/cartoons/${name}.mp4`;

  const mascots = [
    { id: "cheetah", label: "Cheetah", src: localCartoonVideoPath("cheetah") },
    { id: "albatross", label: "Albatross", src: localCartoonVideoPath("albatross") },
    { id: "shark", label: "Shark", src: localCartoonVideoPath("shark") }
  ];

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
    <div className="flex flex-col w-full relative pt-4 pb-28 min-h-[calc(100vh-80px)] px-5 max-w-lg mx-auto gap-5">
      {/* 1. CAMERA SCAN FRAME MODE */}
      {scanMode === "camera" && (
        <div className="flex flex-col items-center justify-between w-full relative z-10 gap-4">
          {/* Top Instruction */}
          <div className="flex flex-col items-center text-center w-full">
            <h1 className={`font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight leading-tight ${
              isDarkMode ? "text-white" : "text-[#173124]"
            }`}>
              AI Growth Scan
            </h1>
            <p className={`font-['Manrope',sans-serif] text-sm sm:text-base font-medium tracking-normal mt-1 ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
            }`}>
              Position {child.name} inside the guide frame below.
            </p>
          </div>

          {/* Positioning Guide Viewport */}
          <div className={`relative w-full max-w-[320px] h-[360px] my-2 flex items-center justify-center rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] border transition-all ${
            isDarkMode ? "bg-[#14231b] border-[#3fff80]/40" : "bg-white/80 border-[#e3e2df]"
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

            <ScanOverlay active={isCapturing} isDarkMode={isDarkMode} />
            <svg
              className={`w-full h-[300px] drop-shadow-md opacity-85 z-10 animate-pulse ${
                isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
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
            <div className={`absolute top-4 left-4 w-7 h-7 border-t-3 border-l-3 rounded-tl-xl ${isDarkMode ? "border-[#3fff80]" : "border-[#173124]"}`} />
            <div className={`absolute top-4 right-4 w-7 h-7 border-t-3 border-r-3 rounded-tr-xl ${isDarkMode ? "border-[#3fff80]" : "border-[#173124]"}`} />
            <div className={`absolute bottom-4 left-4 w-7 h-7 border-b-3 border-l-3 rounded-bl-xl ${isDarkMode ? "border-[#3fff80]" : "border-[#173124]"}`} />
            <div className={`absolute bottom-4 right-4 w-7 h-7 border-b-3 border-r-3 rounded-br-xl ${isDarkMode ? "border-[#3fff80]" : "border-[#173124]"}`} />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const nextState = !isDistractingSoundsOn;
                  setIsDistractingSoundsOn(nextState);
                  if (nextState) playSoothingSound();
                }}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full shadow-xs active:scale-95 transition-all border ${
                  isDarkMode
                    ? "bg-[#14231b] border-[#22392b] text-white"
                    : "bg-white border-[#e3e2df] text-[#424844]"
                }`}
              >
                <Volume2 className={`w-4 h-4 ${isDarkMode ? "text-[#3fff80]" : "text-[#173124]"}`} />
                <span className="font-['Space_Grotesk',sans-serif] text-[11.5px] font-semibold uppercase tracking-wider">Sounds</span>
                <span
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${
                    isDistractingSoundsOn
                      ? isDarkMode ? "bg-[#3fff80]" : "bg-[#173124]"
                      : "bg-[#d1d5db]"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-transform ${
                      isDarkMode ? "bg-[#0a120e]" : "bg-white"
                    } ${isDistractingSoundsOn ? "translate-x-3.5" : "translate-x-0"}`}
                  />
                </span>
              </button>

              <button
                onClick={() => setScanMode("distraction")}
                className={`font-['Manrope',sans-serif] text-xs font-bold px-4 py-2.5 rounded-full shadow-xs active:scale-95 transition-all border ${
                  isDarkMode
                    ? "bg-[#3fff80] text-[#0a120e] border-[#3fff80]"
                    : "bg-[#cae8c9] text-[#173124] border-transparent"
                }`}
              >
                Mascot Mode
              </button>
            </div>

            {/* Shutter Button */}
            <div className="relative mt-1">
              <div className={`absolute inset-0 rounded-full blur-md animate-pulse ${
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
        <div className="flex flex-col items-center justify-center w-full py-8 text-center gap-6">
          <div className="flex flex-col items-center">
            <span className={`font-['Space_Grotesk',sans-serif] text-[12px] font-semibold uppercase tracking-[2px] mb-2 ${
              isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
            }`}>
              Interactive Mode
            </span>
            <h1 className={`font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight ${
              isDarkMode ? "text-white" : "text-[#173124]"
            }`}>
              Look here, {child.name}!
            </h1>
            <p className={`font-['Manrope',sans-serif] text-sm font-medium mt-1 ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
            }`}>
              Pick a mascot to keep {child.name} focused.
            </p>
          </div>

          <div className="relative flex w-full justify-center py-8">
            <CardSwap
              width="min(100%, 280px)"
              height={270}
              cardDistance={20}
              verticalDistance={18}
              delay={3600}
              pauseOnHover
              stopOnClick
              skewAmount={2}
              isDarkMode={isDarkMode}
              onCardClick={(index) => {
                const mascot = mascots[index];
                if (mascot) {
                  setSelectedMascot(mascot.id);
                  setIsMascotPlaying(true);
                  playSoothingSound();
                }
              }}
            >
              {mascots.map((mascot) => (
                <Card
                  key={mascot.id}
                  className={`overflow-hidden border-2 bg-black ${
                    selectedMascot === mascot.id
                      ? isDarkMode ? "border-[#3fff80]" : "border-[#173124]"
                      : isDarkMode ? "border-[#22392b]" : "border-[#e3e2df]"
                  }`}
                >
                  <video
                    src={mascot.src}
                    muted
                    playsInline
                    onMouseEnter={(event) => {
                      const preview = event.currentTarget;
                      window.clearTimeout(mascotPreviewTimers.current[mascot.id]);
                      preview.currentTime = 0;
                      void preview.play();
                      mascotPreviewTimers.current[mascot.id] = window.setTimeout(() => {
                        preview.pause();
                        preview.currentTime = 0;
                      }, 10000);
                    }}
                    onMouseLeave={(event) => {
                      const preview = event.currentTarget;
                      window.clearTimeout(mascotPreviewTimers.current[mascot.id]);
                      preview.pause();
                      preview.currentTime = 0;
                    }}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-10">
                    <span className="font-['Sora',sans-serif] text-lg font-bold text-white">{mascot.label}</span>
                    {selectedMascot === mascot.id && <CheckCircle2 className="h-5 w-5 text-[#3fff80]" />}
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>

          {isMascotPlaying && (
            <div className={`relative w-full max-w-[360px] overflow-hidden rounded-[28px] border-2 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.28)] ${
              isDarkMode ? "border-[#3fff80]" : "border-[#173124]"
            }`}>
              <video
                key={selectedMascot}
                src={mascots.find((mascot) => mascot.id === selectedMascot)?.src}
                autoPlay
                muted
                playsInline
                onLoadedMetadata={(event) => {
                  event.currentTarget.currentTime = 0;
                  void event.currentTarget.play();
                }}
                className="aspect-video w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent px-5 pb-5 pt-14">
                <span className="font-['Sora',sans-serif] text-xl font-bold text-white">
                  {mascots.find((mascot) => mascot.id === selectedMascot)?.label}
                </span>
                <span className="font-['Space_Grotesk',sans-serif] text-[11px] font-semibold uppercase tracking-[1.5px] text-[#3fff80]">
                  Playing
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setScanMode("camera")}
            className={`font-['Manrope',sans-serif] text-sm font-bold px-6 py-3 rounded-full flex items-center gap-2 border transition-all active:scale-95 ${
              isDarkMode
                ? "bg-[#14231b] border-[#22392b] text-white hover:bg-[#1f3829]"
                : "bg-white border-[#e3e2df] text-[#173124] hover:bg-[#efeeea]"
            }`}
          >
            <X className="w-4 h-4" />
            Exit Distraction Mode
          </button>
        </div>
      )}

      {/* 3. SCAN RESULT MODE */}
      {scanMode === "result" && (
        <div className="flex flex-col w-full gap-5 animate-fade-in">
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm mb-3 ${
              isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
            }`}>
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h1 className={`font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight ${
              isDarkMode ? "text-white" : "text-[#173124]"
            }`}>
              {child.name} is growing normally
            </h1>
            <p className={`font-['Manrope',sans-serif] text-sm font-medium mt-1 ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
            }`}>
              Scan completed today at 10:42 AM
            </p>
          </div>

          <div className={`rounded-3xl p-6 flex flex-col gap-4 border shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
            isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white/80 border-[#e3e2df]"
          }`}>
            <span className={`font-['Space_Grotesk',sans-serif] text-[12px] font-semibold uppercase tracking-[1.75px] ${
              isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
            }`}>
              Latest Measurements
            </span>

            <div className="flex justify-between items-center">
              <span className={`font-['Manrope',sans-serif] text-sm font-medium ${
                isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
              }`}>Weight</span>
              <div className="flex items-baseline gap-1">
                <span className={`font-['Sora',sans-serif] text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-[#173124]"
                }`}>
                  <AnimatedCounter value={14.2} duration={1} decimals={1} startAnimation={true} />
                </span>
                <span className={`font-['Manrope',sans-serif] text-sm font-semibold ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                }`}>kg</span>
              </div>
            </div>

            <div className={`w-full h-px ${isDarkMode ? "bg-[#22392b]" : "bg-[#efeeea]"}`} />

            <div className="flex justify-between items-center">
              <span className={`font-['Manrope',sans-serif] text-sm font-medium ${
                isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
              }`}>Height</span>
              <div className="flex items-baseline gap-1">
                <span className={`font-['Sora',sans-serif] text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-[#173124]"
                }`}>
                  <AnimatedCounter value={94.5} duration={1} decimals={1} startAnimation={true} />
                </span>
                <span className={`font-['Manrope',sans-serif] text-sm font-semibold ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                }`}>cm</span>
              </div>
            </div>

            <div className={`w-full h-px ${isDarkMode ? "bg-[#22392b]" : "bg-[#efeeea]"}`} />

            <div className="flex justify-between items-center">
              <span className={`font-['Manrope',sans-serif] text-sm font-medium ${
                isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
              }`}>MUAC</span>
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-1">
                  <span className={`font-['Sora',sans-serif] text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-[#173124]"
                  }`}>
                    <AnimatedCounter value={15.0} duration={1} decimals={1} startAnimation={true} />
                  </span>
                  <span className={`font-['Manrope',sans-serif] text-sm font-semibold ${
                    isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                  }`}>cm</span>
                </div>
                <span className={`font-['Space_Grotesk',sans-serif] text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
                }`}>
                  Healthy
                </span>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-3xl border flex flex-col gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
            isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white/80 border-[#e3e2df]"
          }`}>
            <span className={`font-['Space_Grotesk',sans-serif] text-[12px] font-semibold uppercase tracking-[1.75px] ${
              isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
            }`}>
              Analysis Insights
            </span>
            <p className={`font-['Manrope',sans-serif] text-sm sm:text-base font-medium leading-relaxed ${
              isDarkMode ? "text-[#e5e7eb]" : "text-[#1b1c1a]"
            }`}>
              {child.name} is tracking perfectly on standard WHO percentile growth curves. Weight and height are well-proportioned, and upper-arm circumference reflects robust nutritional health.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            <RetroButton
              onClick={() => onNavigate("nutrition-plan")}
              variant="green"
              icon={<Utensils className="w-5 h-5" />}
            >
              View Nutrition Plan
            </RetroButton>
            <RetroButton
              onClick={() => setScanMode("camera")}
              variant="greenBorder"
              icon={<Camera className="w-5 h-5" />}
            >
              Scan Again
            </RetroButton>
          </div>
        </div>
      )}
    </div>
  );
};
