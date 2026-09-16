import React, { useMemo } from "react";
import { NavTab } from "../types";
import { Home, TrendingUp, Scan, Utensils, User } from "lucide-react";
import MagneticDock, { DockItem } from "./MagneticDock";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDarkMode?: boolean;
  hideOnMobile?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, isDarkMode = false, hideOnMobile = false }) => {
  // Memoize so icon JSX identity stays stable across parent re-renders.
  // Only recreates if isDarkMode changes (which is infrequent).
  const dockItems: DockItem[] = useMemo(() => [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
      tint: isDarkMode ? ["#294a36", "#14231b"] : ["#173124", "#2d4739"] as [string, string],
    },
    {
      id: "growth-tracking",
      label: "Growth",
      icon: <TrendingUp className="w-5 h-5" />,
      tint: isDarkMode ? ["#1a4959", "#14231b"] : ["#0f4c47", "#173124"] as [string, string],
    },
    {
      id: "ai-scan",
      label: "AI Scan",
      icon: <Scan className="w-6 h-6" />,
      tint: ["#3fff80", "#22c7d9"] as [string, string],
    },
    {
      id: "nutrition-plan",
      label: "Nutrition",
      icon: <Utensils className="w-5 h-5" />,
      tint: isDarkMode ? ["#5c431d", "#14231b"] : ["#4d3916", "#173124"] as [string, string],
    },
    {
      id: "child-profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      tint: isDarkMode ? ["#243c66", "#14231b"] : ["#1a2a40", "#173124"] as [string, string],
    },
  ], [isDarkMode]);

  return (
    <div className={`fixed bottom-0 left-0 w-full z-50 pointer-events-none ${hideOnMobile ? "hidden sm:block" : ""}`}>
      <div className="max-w-lg mx-auto pointer-events-none">
        <MagneticDock
          items={dockItems}
          activeId={activeTab}
          onSelect={(id) => onTabChange(id as NavTab)}
          idleWave={false}
          tooltip={false}
          lift={22}
          maxScale={1.45}
          pauseWhenHidden={false}
        />
      </div>
    </div>
  );
};
