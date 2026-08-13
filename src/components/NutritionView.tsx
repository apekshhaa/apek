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
    const iconClass = isDarkMode ? "text-[#3fff80]" : "text-[#4f6951]";
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
    <div className="flex flex-col w-full relative pt-20 pb-32 px-5 max-w-lg mx-auto">
      <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDarkMode ? "text-[#ffffff]" : "text-[#173124]"}`}>
        {child.name}'s Nutrition Plan
      </h1>
      <p className={`text-sm mb-8 leading-relaxed ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>
        Here is a gentle, nourishing meal guide for today. Feel free to swap items based on what {child.name} is in the mood for.
      </p>

      {/* Timeline List */}
      <div className={`relative pl-12 space-y-6 before:content-[''] before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[2px] ${
        isDarkMode ? "before:bg-[#22392b]" : "before:bg-[#bfc9bf]"
      }`}>
        {meals.map((meal) => (
          <div key={meal.id} className="relative">
            <div className={`absolute -left-12 top-1 w-10 h-10 rounded-full flex items-center justify-center shadow-xs z-10 border ${
              isDarkMode ? "bg-[#1f3829] border-[#294a36]" : "bg-[#cae8c9] border-transparent"
            }`}>
              {renderMealIcon(meal.icon)}
            </div>

            <div className={`p-5 rounded-2xl border transition-colors ${
              isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]/80"
            }`}>
              <div className="flex justify-between items-start mb-1">
                <h2 className={`text-lg font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#173124]"}`}>
                  {meal.mealType}
                </h2>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#efeeea] text-[#424844]"
                }`}>
                  {meal.time}
                </span>
              </div>
              <p className={`text-sm mb-3 font-medium leading-normal ${
                isDarkMode ? "text-[#e5e7eb]" : "text-[#1b1c1a]"
              }`}>
                {meal.title}
              </p>

              <div className={`flex items-center justify-between flex-wrap gap-2 pt-2 border-t ${
                isDarkMode ? "border-[#22392b]" : "border-[#efeeea]"
              }`}>
                <div className="flex flex-wrap gap-1.5">
                  {meal.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
                        isDarkMode
                          ? "bg-[#1f3829] text-[#3fff80]"
                          : `${tag.textClass} ${tag.bgClass}`
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
                  className={`text-xs font-bold flex items-center gap-1 active:scale-95 transition-all ${
                    isDarkMode ? "text-[#3fff80] hover:text-[#52ff8f]" : "text-[#173124] hover:underline"
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

      <div className={`mt-8 p-5 rounded-2xl border flex items-start gap-4 transition-colors ${
        isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#f4f4f0] border-[#e3e2df]"
      }`}>
        <Lightbulb className={`w-7 h-7 shrink-0 mt-0.5 ${isDarkMode ? "text-[#3fff80]" : "text-[#173124]"}`} />
        <div>
          <h3 className={`font-bold text-base mb-1 ${isDarkMode ? "text-[#ffffff]" : "text-[#173124]"}`}>
            A quick tip
          </h3>
          <p className={`text-xs leading-relaxed ${isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"}`}>
            Remember to keep portions small and introduce one new food at a time to monitor for any sensitivities.
          </p>
        </div>
      </div>
    </div>
  );
};
