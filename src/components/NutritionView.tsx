import React, { useEffect, useState } from "react";
import { ChildProfile, MealItem } from "../types";
import { Coffee, Utensils, Apple, Moon, RefreshCw, ChevronDown } from "lucide-react";

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
    icon: "coffee",
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
    icon: "utensils",
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
  const [expandedNutritionId, setExpandedNutritionId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const dayProgress = (() => {
    const start = 8 * 60;
    const end = 19 * 60;
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return Math.min(100, Math.max(0, ((minutes - start) / (end - start)) * 100));
  })();

  const nutritionByMeal: Record<string, string> = {
    m1: "Approx. 220 kcal · 7 g protein · 5 g fiber",
    m2: "Approx. 280 kcal · 10 g protein · 4 mg iron",
    m3: "Approx. 140 kcal · 5 g protein · 3 g fiber",
    m4: "Approx. 190 kcal · 4 g protein · 3 g fiber",
  };

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
      case "coffee":
        return <Coffee className={`w-5 h-5 ${iconClass}`} />;
      case "utensils":
        return <Utensils className={`w-5 h-5 ${iconClass}`} />;
      case "apple":
        return <Apple className={`w-5 h-5 ${iconClass}`} />;
      case "moon":
      default:
        return <Moon className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  return (
    <div className="flex flex-col w-full relative pt-8 pb-28 px-5 max-w-lg mx-auto gap-5">
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
      <div className="relative pl-12 space-y-6 mt-2">
        <div className={`pointer-events-none absolute top-4 bottom-4 z-[1] w-1.5 rounded-full ${isDarkMode ? "bg-[#31553d]" : "bg-[#cae8c9]"}`} style={{ left: "20px" }} aria-hidden="true">
          <div className={`absolute left-0 top-0 w-full rounded-full transition-[height] duration-1000 ease-out ${isDarkMode ? "bg-[#3fff80]" : "bg-[#86bf15]"}`} style={{ height: `${dayProgress}%` }} />
        </div>
        {meals.map((meal) => (
          <div key={meal.id} className="relative">
            <div className={`absolute -left-12 top-1 w-10 h-10 rounded-full flex items-center justify-center shadow-xs z-10 border transition-transform hover:scale-105 ${
              isDarkMode ? "bg-[#1f3829] border-[#294a36]" : "bg-[#cae8c9] border-transparent text-[#173124]"
            }`}>
              {renderMealIcon(meal.icon)}
            </div>

            <div className={`relative z-10 p-5 sm:p-6 rounded-3xl border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
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
                <div className="flex flex-1 items-center">
                  <button
                    onClick={() => setExpandedNutritionId(expandedNutritionId === meal.id ? null : meal.id)}
                    className={`font-['Manrope',sans-serif] text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all ${
                      isDarkMode ? "text-[#3fff80] hover:text-[#52ff8f]" : "text-[#173124] hover:opacity-80"
                    }`}
                    aria-expanded={expandedNutritionId === meal.id}
                  >
                    Read more
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedNutritionId === meal.id ? "rotate-180" : ""}`} />
                  </button>
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
              {expandedNutritionId === meal.id && (
                <div className={`mt-3 rounded-xl px-3 py-2.5 font-['Manrope',sans-serif] text-xs font-medium ${
                  isDarkMode ? "bg-[#1f3829] text-[#b0c4b5]" : "bg-[#eef5e9] text-[#4f6951]"
                }`}>
                  Nutritional value: {nutritionByMeal[meal.id]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
