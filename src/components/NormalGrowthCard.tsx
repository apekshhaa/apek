import React from "react";
import { ChildProfile, VitalRecord } from "../types";

interface NormalGrowthCardProps {
  child: ChildProfile;
  vitals?: VitalRecord;
  isDarkMode?: boolean;
}

export const NormalGrowthCard: React.FC<NormalGrowthCardProps> = ({
  child,
  isDarkMode = true
}) => {
  return (
    <div className={`mb-8 rounded-2xl p-5 border transition-colors ${
      isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#efeeea] border-[#e3e2df]/60"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2.5 h-2.5 rounded-full inline-block animate-pulse ${
          isDarkMode ? "bg-[#3fff80]" : "bg-[#4a654d]"
        }`}></span>
        <span className={`text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? "text-[#3fff80]" : "text-[#2d4739]"
        }`}>
          Growth Status
        </span>
      </div>
      <div className={`text-3xl font-extrabold tracking-tight mb-2 ${
        isDarkMode ? "text-[#ffffff]" : "text-[#173124]"
      }`}>
        Normal Growth
      </div>
      <p className={`text-sm leading-relaxed ${
        isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"
      }`}>
        {child.name} remains in the healthy percentile for his age group according to WHO standards.
      </p>
    </div>
  );
};
