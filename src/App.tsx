import React, { useState, useEffect } from "react";
import { NavTab, ChildProfile, VitalRecord } from "./types";
import { LivingBackgroundShader } from "./components/LivingBackgroundShader";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { HomeView } from "./components/HomeView";
import { GrowthView } from "./components/GrowthView";
import { AiScanView } from "./components/AiScanView";
import { NutritionView } from "./components/NutritionView";
import { PoshanAiView } from "./components/PoshanAiView";
import { ProfileView } from "./components/ProfileView";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("poshan_theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    localStorage.setItem("poshan_theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [child, setChild] = useState<ChildProfile>({
    name: "Aarav",
    parentNames: "Sarah & Leo",
    accountType: "Premium Account",
    gender: "boy",
    ageYears: 2,
    ageMonths: 3,
    avatarUrl: "",
    status: "On Track",
    statusDescription: "Following a healthy growth path compared to WHO standards.",
  });

  const [vitals, setVitals] = useState<VitalRecord>({
    weight: 14.2,
    height: 92.5,
    muac: 14.5,
    date: "Updated 2 days ago",
    bmi: 16.2,
    percentile: "75th",
  });

  const getPageTitle = (): string => {
    switch (activeTab) {
      case "home":
        return "Home";
      case "growth-tracking":
        return "Growth Tracking";
      case "ai-scan":
        return "Ai Scan";
      case "nutrition-plan":
        return "Nutrition Plan";
      case "child-profile":
        return "Child Profile";
      case "poshan-ai":
        return "PoshanAi Voice";
      default:
        return "PoshanEye";
    }
  };

  const handleAddVitalRecord = (record: VitalRecord) => {
    setVitals(record);
  };

  return (
    <div
      className={`min-h-screen font-['Geist',sans-serif] relative flex flex-col transition-colors duration-300 ${
        isDarkMode
          ? "bg-[#0a120e] text-[#f1f5f2] selection:bg-[#1f4a2d]"
          : "bg-[#faf9f5] text-[#1b1c1a] selection:bg-[#cae8c9]"
      }`}
    >
      {/* Animated Flowing Green Line Ribbon Background */}
      <LivingBackgroundShader opacity={0.95} isDarkMode={isDarkMode} />

      {/* Persistent Header */}
      <Header
        title={getPageTitle()}
        activeTab={activeTab}
        onProfileClick={() => setActiveTab("child-profile")}
        showBack={activeTab !== "home"}
        onBackClick={() => setActiveTab("home")}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto overflow-x-hidden relative z-10 pt-16">
        {activeTab === "home" && (
          <HomeView
            child={child}
            vitals={vitals}
            onNavigate={(tab) => setActiveTab(tab)}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "growth-tracking" && (
          <GrowthView
            child={child}
            vitals={vitals}
            onAddVitalRecord={handleAddVitalRecord}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "ai-scan" && (
          <AiScanView
            child={child}
            vitals={vitals}
            onNavigate={(tab) => setActiveTab(tab)}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "nutrition-plan" && (
          <NutritionView child={child} isDarkMode={isDarkMode} />
        )}

        {activeTab === "poshan-ai" && (
          <PoshanAiView child={child} vitals={vitals} isDarkMode={isDarkMode} />
        )}

        {activeTab === "child-profile" && (
          <ProfileView
            child={child}
            vitals={vitals}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode((prev) => !prev)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
