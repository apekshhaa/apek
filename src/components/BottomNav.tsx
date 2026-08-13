import React from "react";
import { NavTab } from "../types";
import { Home, TrendingUp, Scan, Utensils, User } from "lucide-react";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDarkMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, isDarkMode = false }) => {
  return (
    <nav className={`fixed bottom-0 left-0 w-full z-50 pb-safe backdrop-blur-xl border-t transition-colors shadow-lg ${
      isDarkMode
        ? "bg-[#0a120e]/90 border-[#1d2d23]"
        : "bg-[#faf9f5]/80 border-[#e3e2df]/60"
    }`}>
      <div className="flex items-center justify-between h-20 px-4 max-w-lg mx-auto">
        {/* Home */}
        <button
          onClick={() => onTabChange("home")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "home"
              ? isDarkMode ? "text-[#3fff80] font-bold" : "text-[#173124] font-bold"
              : isDarkMode ? "text-[#b0c4b5] hover:text-[#ffffff]" : "text-[#727973] hover:text-[#173124]"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </button>

        {/* Growth */}
        <button
          onClick={() => onTabChange("growth-tracking")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "growth-tracking"
              ? isDarkMode ? "text-[#3fff80] font-bold" : "text-[#173124] font-bold"
              : isDarkMode ? "text-[#b0c4b5] hover:text-[#ffffff]" : "text-[#727973] hover:text-[#173124]"
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-xs mt-1">Growth</span>
        </button>

        {/* Center AI Scan FAB */}
        <div className="flex-1 flex justify-center -mt-8">
          <button
            onClick={() => onTabChange("ai-scan")}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ${
              isDarkMode
                ? "bg-[#3fff80] text-[#0a120e] ring-[#0a120e]"
                : "bg-[#173124] text-white ring-[#faf9f5]"
            }`}
            aria-label="Start AI Scan"
          >
            <Scan className="w-7 h-7" />
          </button>
        </div>

        {/* Nutrition */}
        <button
          onClick={() => onTabChange("nutrition-plan")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "nutrition-plan"
              ? isDarkMode ? "text-[#3fff80] font-bold" : "text-[#173124] font-bold"
              : isDarkMode ? "text-[#b0c4b5] hover:text-[#ffffff]" : "text-[#727973] hover:text-[#173124]"
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-xs mt-1">Nutrition</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onTabChange("child-profile")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === "child-profile"
              ? isDarkMode ? "text-[#3fff80] font-bold" : "text-[#173124] font-bold"
              : isDarkMode ? "text-[#b0c4b5] hover:text-[#ffffff]" : "text-[#727973] hover:text-[#173124]"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
