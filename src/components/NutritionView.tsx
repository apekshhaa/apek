import React, { useState } from "react";
import { ChildProfile, MealItem } from "../types";
import { Sun, SunMedium, Apple, Moon, Wheat, Zap, Dumbbell, Flame, Sparkles, Leaf, RefreshCw, Lightbulb } from "lucide-react";

interface NutritionViewProps {
  child: ChildProfile;
  isDarkMode?: boolean;
}

const defaultMeals: MealItem[] = [
  {
    id: "m1",
    mealType: "Breakfast",
    time: "8:00 AM",
    title: "Oatmeal with mashed bananas & almond dust",
    icon: "sun",
    tags: [
      { label: "Fiber", icon: "wheat", bgClass: "bg-[#cae8c9]", textClass: "text-[#4f6951]" },
      { label: "Energy", icon: "zap", bgClass: "bg-[#cae8c9]", textClass: "text-[#4f6951]" },
    ],
  },
  {
    id: "m2",
    mealType: "Lunch",
    time: "12:30 PM",
    title: "Soft lentil soup (Dal) with mashed rice & ghee",
    icon: "sun-medium",
    tags: [
      { label: "Protein", icon: "dumbbell", bgClass: "bg-[#b0cdbb]", textClass: "text-[#324c3e]" },
      { label: "Iron", icon: "flame", bgClass: "bg-[#b0cdbb]", textClass: "text-[#324c3e]" },
    ],
  },
  {
    id: "m3",
    mealType: "Afternoon Snack",
    time: "3:30 PM",
    title: "Thinly sliced apples or pureed fruit with curd",
    icon: "apple",
    tags: [
      { label: "Vitamins", icon: "sparkles", bgClass: "bg-[#bfc9bf]", textClass: "text-[#404941]" },
    ],
  },
  {
    id: "m4",
    mealType: "Dinner",
    time: "7:00 PM",
    title: "Steamed vegetables and pumpkin porridge",
    icon: "moon",
    tags: [
      { label: "Digestion", icon: "leaf", bgClass: "bg-[#cae8c9]", textClass: "text-[#4f6951]" },
      { label: "Sleep Aid", icon: "moon", bgClass: "bg-[#cae8c9]", textClass: "text-[#4f6951]" },
    ],
  },
];

export const NutritionView: React.FC<NutritionViewProps> = ({ child, isDarkMode = false }) => {
  const [meals, setMeals] = useState<MealItem[]>(defaultMeals);
  const [swappingId, setSwappingId] = useState<string | null>(null);

  const handleSwapMeal = (mealId: string) => {
    setSwappingId(mealId);
    setTimeout(() => {
      setMeals((prev) =>
        prev.map((m) => {
          if (m.id !== mealId) return m;
          if (m.mealType === "Breakfast") {
            return { ...m, title: "Warm ragi porridge with grated apples & almonds" };
          } else if (m.mealType === "Lunch") {
            return { ...m, title: "Mashed khichdi with ghee and steamed carrots" };
          } else if (m.mealType === "Afternoon Snack") {
            return { ...m, title: "Steamed sweet potato sticks with curd dip" };
          } else {
            return { ...m, title: "Soft pumpkin soup with whole wheat mini roti" };
          }
        })
      );
      setSwappingId(null);
    }, 800);
  };

  const renderMealIcon = (icon: string) => {
    const iconClass = isDarkMode ? "text-[#3fff80]" : "text-[#173124]";
    switch (icon) {
      case "sun":
        return <Sun className={`w-5 h-5 ${iconClass}`} />;
      case "sun-medium":
        return <SunMedium className={`w-5 h-5 ${iconClass}`} />;
      case "apple":
        return <Apple className={`w-5 h-5 ${iconClass}`} />;
      case "moon":
      default:
        return <Moon className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const renderTagIcon = (icon: string) => {
    switch (icon) {
      case "wheat":
        return <Wheat className="w-3.5 h-3.5" />;
      case "zap":
        return <Zap className="w-3.5 h-3.5" />;
      case "dumbbell":
        return <Dumbbell className="w-3.5 h-3.5" />;
      case "flame":
        return <Flame className="w-3.5 h-3.5" />;
      case "sparkles":
        return <Sparkles className="w-3.5 h-3.5" />;
      case "leaf":
        return <Leaf className="w-3.5 h-3.5" />;
      case "moon":
      default:
        return <Moon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col w-full relative pt-4 pb-28 px-5 max-w-lg mx-auto gap-5">
      {/* Header */}
      <div className="flex flex-col items-start w-full">
        <h1 className={`font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight leading-tight ${
          isDarkMode ? "text-white" : "text-[#173124]"
        }`}>
          {child.name}'s Nutrition Plan
        </h1>
        <p className={`font-['Manrope',sans-serif] text-sm sm:text-base font-medium tracking-normal mt-1 ${
          isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
        }`}>
          Nourishing meal guide tailored for today.
        </p>
      </div>

      {/* Timeline List */}
      <div className={`relative pl-12 space-y-6 mt-2 before:content-[''] before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[2px] ${
        isDarkMode ? "before:bg-[#22392b]" : "before:bg-[#cae8c9]"
      }`}>
        {meals.map((meal) => (
          <div key={meal.id} className="relative">
            <div className={`absolute -left-12 top-1 w-10 h-10 rounded-full flex items-center justify-center shadow-xs z-10 border transition-transform hover:scale-105 ${
              isDarkMode ? "bg-[#1f3829] border-[#294a36]" : "bg-[#cae8c9] border-transparent text-[#173124]"
            }`}>
              {renderMealIcon(meal.icon)}
            </div>

            <div className={`p-5 sm:p-6 rounded-3xl border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
              isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white/80 border-[#e3e2df]"
            }`}>
              <div className="flex justify-between items-center mb-2">
                <h2 className={`font-['Sora',sans-serif] text-lg sm:text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-[#173124]"
                }`}>
                  {meal.mealType}
                </h2>
                <span className={`font-['Space_Grotesk',sans-serif] text-[11.5px] font-semibold uppercase tracking-wider px-3 py-1 rounded-lg ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#efeeea] text-[#424844]"
                }`}>
                  {meal.time}
                </span>
              </div>

              <p className={`font-['Manrope',sans-serif] text-sm sm:text-[15px] font-medium leading-relaxed mb-4 ${
                isDarkMode ? "text-[#e5e7eb]" : "text-[#1b1c1a]"
              }`}>
                {meal.title}
              </p>

              <div className={`flex items-center justify-between flex-wrap gap-2 pt-3 border-t ${
                isDarkMode ? "border-[#22392b]" : "border-[#efeeea]"
              }`}>
                <div className="flex flex-wrap gap-1.5">
                  {meal.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`font-['Space_Grotesk',sans-serif] text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        isDarkMode
                          ? "bg-[#1f3829] text-[#3fff80]"
                          : "bg-[#cae8c9]/80 text-[#173124]"
                      }`}
                    >
                      {renderTagIcon(tag.icon)}
                      {tag.label}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleSwapMeal(meal.id)}
                  disabled={swappingId === meal.id}
                  className={`font-['Manrope',sans-serif] text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all ${
                    isDarkMode ? "text-[#3fff80] hover:text-[#52ff8f]" : "text-[#173124] hover:opacity-80"
                  }`}
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${swappingId === meal.id ? "animate-spin" : ""}`}
                  />
                  {swappingId === meal.id ? "Swapping..." : "Swap Option"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tip Banner */}
      <div className={`p-6 rounded-3xl border flex items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
        isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white/80 border-[#e3e2df]"
      }`}>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
          isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
        }`}>
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`font-['Sora',sans-serif] font-bold text-base mb-1 ${
            isDarkMode ? "text-white" : "text-[#173124]"
          }`}>
            Parent Tip
          </h3>
          <p className={`font-['Manrope',sans-serif] text-xs sm:text-sm font-medium leading-relaxed ${
            isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"
          }`}>
            Keep portion sizes modest and introduce single foods gradually to monitor taste preferences and tolerance.
          </p>
        </div>
      </div>
    </div>
  );
};
