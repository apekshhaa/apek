import React, { useEffect, useRef, useState } from "react";
import { NavTab, ChildProfile, VitalRecord } from "../types";
import { ClipboardCheck, ArrowRight, Scan, Utensils } from "lucide-react";
import CardSwap, { Card } from "./CardSwap";
import { OrbitStatusIndicator } from "./OrbitStatusIndicator";
import { AnimatedCounter } from "./AnimatedCounter";
import { RetroButton } from "./RetroButton";

interface HomeViewProps {
  child: ChildProfile;
  vitals: VitalRecord;
  onNavigate: (tab: NavTab) => void;
  isDarkMode?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ child, vitals, onNavigate, isDarkMode = false }) => {
  const [shouldAnimateVitals, setShouldAnimateVitals] = useState(false);
  const vitalsAnimationTriggered = useRef(false);

  useEffect(() => {
    // Trigger animation after a short delay when component mounts
    const timer = setTimeout(() => {
      setShouldAnimateVitals(true);
      vitalsAnimationTriggered.current = true;
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col w-full relative pt-4 pb-28 px-5 max-w-lg mx-auto gap-5">
      {/* Greeting Header */}
      <div className="flex flex-col items-start w-full">
        <h1 className={`font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight leading-tight select-none ${
          isDarkMode ? "text-white" : "text-[#173124]"
        }`}>
          Good morning, {child.name}
        </h1>
        <p className={`font-['Sora',sans-serif] text-sm sm:text-base font-medium tracking-normal mt-1 pl-0.5 ${
          isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
        }`}>
          {child.name} is doing well today.
        </p>
      </div>

      {/* Animated Card Stack: Growth Status / Current Vitals / Latest Assessment */}
      <div className="relative w-full flex justify-center pt-8" style={{ height: 260 }}>
        <CardSwap
          width="100%"
          height={204}
          cardDistance={18}
          verticalDistance={14}
          delay={4000}
          skewAmount={2}
          easing="elastic"
          isDarkMode={isDarkMode}
        >
          {/* Card 1 — Growth Status */}
          <Card className="flex flex-col h-full px-5 pt-5 pb-[22px] border transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2.5">
              <OrbitStatusIndicator isDarkMode={isDarkMode} />
              <span
                className={`font-['Space_Grotesk',sans-serif] text-[12.5px] font-semibold uppercase tracking-[1.75px] ${
                  isDarkMode ? "text-[#3fff80]" : "text-[#2d4739]"
                }`}
              >
                Growth Status
              </span>
            </div>
            <div
              className={`font-['Sora',sans-serif] text-[29px] font-bold tracking-tight mb-2 ${
                isDarkMode ? "text-white" : "text-[#173124]"
              }`}
            >
              Normal Growth
            </div>
            <p
              className={`font-['Manrope',sans-serif] text-[14.5px] font-medium leading-[1.5] mb-4 ${
                isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"
              }`}
            >
              {child.name} remains in the healthy percentile for his age group according to WHO standards.
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate("growth-tracking"); }}
              className={`font-['Manrope',sans-serif] text-[13.5px] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity ${
                isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
              }`}
            >
              View growth details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Card>

          {/* Card 2 — Current Vitals */}
          <Card className="flex flex-col h-full p-5 border transition-colors duration-300">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className={`font-['Sora',sans-serif] text-[16px] font-semibold ${isDarkMode ? "text-white" : "text-[#151e17]"}`}>Current Vitals</h3>
              <span className={`font-['Manrope',sans-serif] text-[13px] font-medium ${isDarkMode ? "text-[#b0c4b5]" : "text-[#151e17]/70"}`}>Updated 2 days ago</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Weight", value: vitals.weight, unit: "kg" },
                { label: "Height", value: vitals.height, unit: "cm" },
                { label: "MUAC", value: vitals.muac, unit: "cm" }
              ].map(({ label, value, unit }) => (
                <div
                  key={label}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border ${
                    isDarkMode ? "bg-[#0d1712]/70 border-[#22392b]" : "bg-white/60 border-transparent"
                  }`}
                >
                  <span className={`font-['Space_Grotesk',sans-serif] text-[13.5px] font-semibold mb-2.5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#404941]"}`}>{label}</span>
                  <div className={`flex items-baseline gap-0.5 ${isDarkMode ? "text-white" : "text-[#151e17]"}`}>
                    <span className={`font-['Sora',sans-serif] text-[28px] font-bold leading-none`}>
                      <AnimatedCounter value={value} duration={1.5} decimals={1} startAnimation={shouldAnimateVitals} />
                    </span>
                    <span className="font-['Manrope',sans-serif] text-[13.5px] font-medium leading-none">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 3 — Latest Assessment */}
          <Card className="flex flex-col p-6 border transition-colors duration-300">
            <div className="flex items-start gap-4">
              <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#4f6951]"}`}>
                <ClipboardCheck className="w-6 h-6" strokeWidth={1.875} />
              </div>
              <div className="flex-1">
                <h4 className={`font-['Sora',sans-serif] text-[21px] font-semibold mb-2 ${isDarkMode ? "text-white" : "text-[#1b1c1a]"}`}>Latest Assessment</h4>
                <p className={`font-['Manrope',sans-serif] text-[16px] font-medium leading-[1.6] mb-3 ${isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"}`}>
                  Last scan was 2 days ago. Analysis indicates healthy nutritional milestones.
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigate("growth-tracking"); }}
                  className={`font-['Manrope',sans-serif] text-[16px] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity ${isDarkMode ? "text-[#3fff80]" : "text-[#173124]"}`}
                >
                  View full report <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </CardSwap>
      </div>

      {/* Primary Call to Action Buttons */}
      <div className="grid grid-cols-1 gap-3.5 mt-2">
        <RetroButton
          onClick={() => onNavigate("ai-scan")}
          variant="green"
          icon={<Scan className="w-[22px] h-[22px]" />}
        >
          Start New Scan
        </RetroButton>

        <RetroButton
          onClick={() => onNavigate("nutrition-plan")}
          variant="greenBorder"
          icon={<Utensils className="w-[22px] h-[22px]" />}
        >
          Nutrition Plan
        </RetroButton>
      </div>
    </div>
  );
};
