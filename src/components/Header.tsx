import React from "react";
import { NavTab } from "../types";
import { ArrowLeft, User, Sun, Moon } from "lucide-react";

interface HeaderProps {
  title: string;
  activeTab: NavTab;
  onProfileClick: () => void;
  onBackClick?: () => void;
  showBack?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onProfileClick,
  onBackClick,
  showBack = false,
  isDarkMode = false,
  onToggleTheme,
}) => {
  return (
    <header className={`fixed top-0 w-full z-50 pt-safe backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-colors border-b ${
      isDarkMode ? "bg-[#0a120e]/80 border-[#1d2d23]/80 text-[#f1f5f2]" : "bg-[#faf9f5]/60 border-[#e3e2df]/50 text-[#173124]"
    }`}>
      <div className="flex items-center justify-between h-16 px-5 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={onBackClick}
              className={`w-9 h-9 -ml-2 rounded-full flex items-center justify-center active:scale-95 transition-all ${
                isDarkMode ? "hover:bg-[#18261e] text-[#f1f5f2]" : "hover:bg-[#e9e8e4] text-[#173124]"
              }`}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}

          {/* PoshanEye Brand Logo SVG */}
          <div className="flex items-center gap-2">
            <svg
              className={`h-7 w-auto ${isDarkMode ? "text-[#3fff80]" : "text-[#173124]"}`}
              viewBox="0 0 120 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 40 Q25 10 60 10 C85 10 100 25 100 35 M20 40 Q60 70 100 40"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M20 35 Q50 15 90 20 C70 35 40 45 20 35 Z"
                fill="currentColor"
                opacity="0.15"
              />
              <circle cx="60" cy="42" r="8" fill="currentColor" />
            </svg>
            <span className={`font-semibold text-xl tracking-tight ${isDarkMode ? "text-[#f1f5f2]" : "text-[#173124]"}`}>
              {title}
            </span>
          </div>
        </div>

        {/* Right side buttons: Dark Mode Toggle & Profile Avatar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
              isDarkMode
                ? "bg-[#18261e] border-[#293d31] text-[#3fff80] hover:bg-[#23362b]"
                : "bg-[#efeeea] border-[#e3e2df] text-[#173124] hover:bg-[#e3e2df]"
            }`}
            title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-[#3fff80]" />
            ) : (
              <Moon className="w-4 h-4 text-[#173124]" />
            )}
          </button>

          <button
            onClick={onProfileClick}
            className="w-9 h-9 rounded-full bg-[#173124] text-[#faf9f5] flex items-center justify-center ring-2 ring-[#cceacc] active:scale-95 transition-transform"
            aria-label="Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
