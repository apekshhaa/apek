import React from "react";
import { NavTab, ChildProfile, VitalRecord } from "../types";
import { ClipboardCheck, ArrowRight, Scan, Utensils } from "lucide-react";

interface HomeViewProps {
  child: ChildProfile;
  vitals: VitalRecord;
  onNavigate: (tab: NavTab) => void;
  isDarkMode?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ child, vitals, onNavigate, isDarkMode = false }) => {
  return (
    <div className="flex flex-col w-full relative pt-20 pb-32 px-5 max-w-lg mx-auto">
      {/* Greeting Header */}
      <div className="mb-6 animate-fade-in">
        <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
          Good morning,
        </h2>
        <p className={`text-lg mt-1 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>
          {child.name} is doing well today.
        </p>
      </div>

      {/* Growth Status Summary */}
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

      {/* Current Vitals Module */}
      <div className={`rounded-2xl p-5 mb-8 shadow-xs border transition-colors ${
        isDarkMode ? "bg-[#182b20] border-[#254231]" : "bg-[#dbe5da] border-transparent"
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold text-lg ${isDarkMode ? "text-[#ffffff]" : "text-[#151e17]"}`}>
            Current Vitals
          </h3>
          <span className={`text-xs font-medium ${isDarkMode ? "text-[#b0c4b5]" : "text-[#151e17]/70"}`}>
            Updated 2 days ago
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className={`flex flex-col items-center justify-center p-3 rounded-xl backdrop-blur-xs border ${
            isDarkMode ? "bg-[#0d1712]/70 border-[#22392b]" : "bg-white/60 border-transparent"
          }`}>
            <span className={`text-xs font-semibold mb-1 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#404941]"}`}>Weight</span>
            <span className={`text-xl font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#151e17]"}`}>
              {vitals.weight} <span className="text-xs font-normal">kg</span>
            </span>
          </div>
          <div className={`flex flex-col items-center justify-center p-3 rounded-xl backdrop-blur-xs border ${
            isDarkMode ? "bg-[#0d1712]/70 border-[#22392b]" : "bg-white/60 border-transparent"
          }`}>
            <span className={`text-xs font-semibold mb-1 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#404941]"}`}>Height</span>
            <span className={`text-xl font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#151e17]"}`}>
              {vitals.height} <span className="text-xs font-normal">cm</span>
            </span>
          </div>
          <div className={`flex flex-col items-center justify-center p-3 rounded-xl backdrop-blur-xs border ${
            isDarkMode ? "bg-[#0d1712]/70 border-[#22392b]" : "bg-white/60 border-transparent"
          }`}>
            <span className={`text-xs font-semibold mb-1 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#404941]"}`}>MUAC</span>
            <span className={`text-xl font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#151e17]"}`}>
              {vitals.muac} <span className="text-xs font-normal">cm</span>
            </span>
          </div>
        </div>
      </div>

      {/* Latest Assessment Card */}
      <div className="mb-8">
        <div className={`rounded-2xl p-5 flex items-start gap-4 border transition-colors ${
          isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#f4f4f0] border-[#e3e2df]/80"
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#4f6951]"
          }`}>
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className={`font-bold text-base mb-1 ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
              Latest Assessment
            </h4>
            <p className={`text-sm mb-3 leading-relaxed ${isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"}`}>
              Last scan was 2 days ago. Analysis indicates healthy nutritional milestones.
            </p>
            <button
              onClick={() => onNavigate("growth-tracking")}
              className={`text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity ${
                isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
              }`}
            >
              View full report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Call to Action Buttons */}
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => onNavigate("ai-scan")}
          className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md ${
            isDarkMode
              ? "bg-[#3fff80] text-[#0a120e] hover:bg-[#34e06e]"
              : "bg-[#173124] text-white hover:bg-[#2d4739]"
          }`}
        >
          <Scan className="w-5 h-5" />
          Start New Scan
        </button>

        <button
          onClick={() => onNavigate("nutrition-plan")}
          className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all border-2 ${
            isDarkMode
              ? "border-[#3fff80] text-[#3fff80] hover:bg-[#3fff80]/10"
              : "border-[#173124] text-[#173124] hover:bg-[#173124]/5"
          }`}
        >
          <Utensils className="w-5 h-5" />
          Nutrition Plan
        </button>
      </div>
    </div>
  );
};
