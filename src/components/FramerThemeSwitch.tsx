import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface FramerThemeSwitchProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  className?: string;
}

export const FramerThemeSwitch: React.FC<FramerThemeSwitchProps> = ({
  isDarkMode,
  onToggleTheme,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className={`relative inline-flex items-center w-[66px] h-[34px] rounded-full p-[3px] cursor-pointer select-none transition-colors duration-500 border-2 ${
        isDarkMode
          ? "bg-[#181717] border-[#a37ef9]/40"
          : "bg-[#28bd7a]/20 border-[#28bd7a]/40"
      } ${className}`}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Sun Icon (left side, visible in Light mode) */}
      <motion.div
        className="absolute left-[7px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-[#28bd7a]"
        animate={{
          opacity: isDarkMode ? 0 : 0.95,
          scale: isDarkMode ? 0.6 : 1,
          rotate: isDarkMode ? -45 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <Sun className="w-4 h-4 fill-current" />
      </motion.div>

      {/* Moon Icon (right side, visible in Dark mode) */}
      <motion.div
        className="absolute right-[7px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-[#a480fa]"
        animate={{
          opacity: isDarkMode ? 0.95 : 0,
          scale: isDarkMode ? 1 : 0.6,
          rotate: isDarkMode ? 0 : 45,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <Moon className="w-4 h-4 fill-current" />
      </motion.div>

      {/* Sliding Knob Button */}
      <motion.div
        className="w-[24px] h-[24px] rounded-full z-10"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #e3e3e3 100%)",
        }}
        animate={{
          x: isDarkMode ? 0 : 32,
          boxShadow: isDarkMode
            ? "0px 6px 16px -2px rgba(164, 128, 250, 0.75), 0px 2px 4px rgba(0, 0, 0, 0.4)"
            : "0px 6px 16px -2px rgba(40, 189, 122, 0.75), 0px 2px 4px rgba(0, 0, 0, 0.15)",
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 30,
        }}
      />
    </button>
  );
};

export default FramerThemeSwitch;
