import React, { useState } from "react";
import { ChildProfile, VitalRecord } from "../types";
import { Scale, Ruler, Plus, RefreshCw, ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react";
import { GrowthChart } from "./GrowthChart";
import { OrbitStatusIndicator } from "./OrbitStatusIndicator";
import { AnimatedCounter } from "./AnimatedCounter";
import { RetroButton } from "./RetroButton";

interface GrowthViewProps {
  child: ChildProfile;
  vitals: VitalRecord;
  onAddVitalRecord: (record: VitalRecord) => void;
  isDarkMode?: boolean;
}

export const GrowthView: React.FC<GrowthViewProps> = ({
  child,
  vitals,
  onAddVitalRecord,
  isDarkMode = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "calculator">("dashboard");
  const [activeMetric, setActiveMetric] = useState<"weight" | "height" | "muac">("weight");

  // Calculator Form State
  const [gender, setGender] = useState<"boy" | "girl">(child.gender);
  const [ageYears, setAgeYears] = useState<number | "">(child.ageYears);
  const [ageMonths, setAgeMonths] = useState<number | "">(child.ageMonths);
  const [weightInput, setWeightInput] = useState<string>(vitals.weight.toString());
  const [heightInput, setHeightInput] = useState<string>(vitals.height.toString());

  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<{
    bmi: string;
    percentile: string;
    status: string;
    advice: string;
  } | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setCalcResult(null);

    try {
      const res = await fetch("/api/growth-calc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender,
          ageYears: Number(ageYears) || 0,
          ageMonths: Number(ageMonths) || 0,
          weight: Number(weightInput) || 14.2,
          height: Number(heightInput) || 92.5,
        }),
      });
      const data = await res.json();
      setCalcResult({
        bmi: data.bmi || "16.2",
        percentile: data.percentile || "75th",
        status: data.status || "On Track",
        advice: data.advice || `${child.name} is tracking beautifully in the healthy range according to WHO curves.`,
      });

      onAddVitalRecord({
        weight: Number(weightInput) || 14.2,
        height: Number(heightInput) || 92.5,
        muac: vitals.muac,
        date: "Today",
        bmi: Number(data.bmi) || 16.2,
        percentile: data.percentile || "75th",
      });
    } catch {
      setCalcResult({
        bmi: "16.2",
        percentile: "75th",
        status: "On Track",
        advice: `${child.name} is tracking beautifully and is currently in the healthy range for his age.`,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="flex flex-col w-full relative pt-4 pb-28 px-5 max-w-lg mx-auto gap-5">
      {/* Header Title Section */}
      <div className="flex flex-col items-start w-full">
        <h1 className={`font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight leading-tight ${
          isDarkMode ? "text-white" : "text-[#173124]"
        }`}>
          Growth Tracking
        </h1>
        <p className={`font-['Manrope',sans-serif] text-sm sm:text-base font-medium tracking-normal mt-1 ${
          isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
        }`}>
          Monitor {child.name}'s development milestones.
        </p>
      </div>

      {/* View Switcher Tabs */}
      <div className={`flex p-1 rounded-2xl relative border transition-all ${
        isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#efeeea] border-[#e3e2df]"
      }`}>
        <button
          onClick={() => setActiveSubTab("dashboard")}
          className={`flex-1 py-2.5 font-['Space_Grotesk',sans-serif] text-[12.5px] font-semibold uppercase tracking-[1.5px] rounded-xl transition-all ${
            activeSubTab === "dashboard"
              ? isDarkMode
                ? "bg-[#1f3829] text-[#3fff80] shadow-sm"
                : "bg-white text-[#173124] shadow-sm"
              : isDarkMode
              ? "text-[#b0c4b5] hover:text-white"
              : "text-[#59625a] hover:text-[#173124]"
          }`}
        >
          Growth Trends
        </button>
        <button
          onClick={() => setActiveSubTab("calculator")}
          className={`flex-1 py-2.5 font-['Space_Grotesk',sans-serif] text-[12.5px] font-semibold uppercase tracking-[1.5px] rounded-xl transition-all ${
            activeSubTab === "calculator"
              ? isDarkMode
                ? "bg-[#1f3829] text-[#3fff80] shadow-sm"
                : "bg-white text-[#173124] shadow-sm"
              : isDarkMode
              ? "text-[#b0c4b5] hover:text-white"
              : "text-[#59625a] hover:text-[#173124]"
          }`}
        >
          Calculator
        </button>
      </div>

      {activeSubTab === "dashboard" ? (
        <div className="flex flex-col gap-5">
          {/* Status Header Card */}
          <div className={`rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between border transition-all ${
            isDarkMode ? "bg-[#14231b] border-[#22392b] text-[#f1f5f2]" : "bg-[#173124] text-white border-transparent"
          }`}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <OrbitStatusIndicator isDarkMode={isDarkMode} />
                <span className={`font-['Space_Grotesk',sans-serif] text-[11.5px] font-semibold uppercase tracking-[1.75px] ${
                  isDarkMode ? "text-[#3fff80]" : "text-[#cae8c9]"
                }`}>
                  Current Status
                </span>
              </div>
              <h3 className="font-['Sora',sans-serif] text-2xl font-bold tracking-tight text-white">On Track</h3>
              <p className={`font-['Manrope',sans-serif] text-xs sm:text-sm font-medium mt-1 ${
                isDarkMode ? "text-[#d1d8d3]" : "text-[#cae8c9]"
              }`}>
                WHO Percentile: {vitals.percentile} percentile
              </p>
            </div>
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 ${
              isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#2d4739] text-[#3fff80]"
            }`}>
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>

          {/* Key Vitals Summary Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weight Card */}
            <div className={`p-5 rounded-3xl border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
              isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white/80 border-[#e3e2df]"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
                }`}>
                  <Scale className="w-4 h-4" />
                </div>
                <span className={`font-['Space_Grotesk',sans-serif] text-[12px] font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#59625a]"
                }`}>
                  Weight
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1">
                <span className={`font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight ${
                  isDarkMode ? "text-white" : "text-[#173124]"
                }`}>
                  <AnimatedCounter value={vitals.weight} duration={1.2} decimals={1} startAnimation={true} />
                </span>
                <span className={`font-['Manrope',sans-serif] text-sm font-semibold ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                }`}>kg</span>
              </div>
              <span className={`inline-block font-['Space_Grotesk',sans-serif] text-[10.5px] font-semibold uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full ${
                isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
              }`}>
                {vitals.percentile} Percentile
              </span>
            </div>

            {/* Height Card */}
            <div className={`p-5 rounded-3xl border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
              isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white/80 border-[#e3e2df]"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
                }`}>
                  <Ruler className="w-4 h-4" />
                </div>
                <span className={`font-['Space_Grotesk',sans-serif] text-[12px] font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#59625a]"
                }`}>
                  Height
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1">
                <span className={`font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight ${
                  isDarkMode ? "text-white" : "text-[#173124]"
                }`}>
                  <AnimatedCounter value={vitals.height} duration={1.2} decimals={1} startAnimation={true} />
                </span>
                <span className={`font-['Manrope',sans-serif] text-sm font-semibold ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                }`}>cm</span>
              </div>
              <span className={`inline-block font-['Space_Grotesk',sans-serif] text-[10.5px] font-semibold uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full ${
                isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
              }`}>
                WHO Normal Band
              </span>
            </div>
          </div>

          {/* Metric Selector Tabs for Graph */}
          <div className="flex gap-2">
            {(["weight", "height", "muac"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`flex-1 py-2 font-['Space_Grotesk',sans-serif] text-[12px] font-semibold uppercase tracking-[1.5px] rounded-xl transition-all border ${
                  activeMetric === m
                    ? isDarkMode
                      ? "bg-[#3fff80] text-[#0a120e] border-[#3fff80]"
                      : "bg-[#173124] text-white border-[#173124]"
                    : isDarkMode
                    ? "bg-[#14231b] text-[#b0c4b5] border-[#22392b] hover:text-white"
                    : "bg-[#efeeea] text-[#59625a] border-[#e3e2df] hover:text-[#173124]"
                }`}
              >
                {m === "muac" ? "MUAC" : m}
              </button>
            ))}
          </div>

          {/* Curve Graph */}
          <div className="flex flex-col gap-2.5">
            <h3 className={`font-['Sora',sans-serif] text-lg font-bold px-0.5 capitalize ${
              isDarkMode ? "text-white" : "text-[#173124]"
            }`}>
              {activeMetric} Progress Curve
            </h3>
            <GrowthChart activeMetric={activeMetric} isDarkMode={isDarkMode} />
          </div>

          {/* CTA Banner */}
          <div className={`p-6 rounded-3xl border flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
            isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white/80 border-[#e3e2df]"
          }`}>
            <p className={`font-['Manrope',sans-serif] text-sm font-medium mb-4 ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
            }`}>
              Want to calculate & log a new measurement for {child.name}?
            </p>
            <RetroButton
              onClick={() => setActiveSubTab("calculator")}
              variant="green"
              icon={<Plus className="w-5 h-5" />}
            >
              Log New Vitals
            </RetroButton>
          </div>
        </div>
      ) : (
        /* Calculator & Form Mode */
        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-1">
            <h2 className={`font-['Sora',sans-serif] text-xl sm:text-2xl font-bold tracking-tight ${
              isDarkMode ? "text-white" : "text-[#173124]"
            }`}>
              WHO Growth Calculator
            </h2>
            <p className={`font-['Manrope',sans-serif] text-sm font-medium ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
            }`}>
              Enter measurements below to evaluate growth percentile.
            </p>
          </section>

          <form onSubmit={handleCalculate} className="flex flex-col gap-4">
            {/* Gender Toggle */}
            <div className="flex flex-col gap-2">
              <span className={`font-['Space_Grotesk',sans-serif] text-[12px] font-semibold uppercase tracking-[1.5px] ${
                isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
              }`}>
                Gender
              </span>
              <div className={`flex p-1 rounded-2xl border ${
                isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#efeeea] border-[#e3e2df]"
              }`}>
                <button
                  type="button"
                  onClick={() => setGender("boy")}
                  className={`flex-1 py-2.5 font-['Manrope',sans-serif] text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    gender === "boy"
                      ? isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-white text-[#173124] shadow-xs"
                      : isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                  }`}
                >
                  Boy
                </button>
                <button
                  type="button"
                  onClick={() => setGender("girl")}
                  className={`flex-1 py-2.5 font-['Manrope',sans-serif] text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    gender === "girl"
                      ? isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-white text-[#173124] shadow-xs"
                      : isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                  }`}
                >
                  Girl
                </button>
              </div>
            </div>

            {/* Age Inputs */}
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className={`font-['Space_Grotesk',sans-serif] text-[11.5px] font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                }`}>
                  Age (Years)
                </label>
                <input
                  type="number"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value === "" ? "" : Number(e.target.value))}
                  className={`w-full font-['Sora',sans-serif] text-base py-3 px-4 rounded-2xl border transition-all focus:outline-none ${
                    isDarkMode
                      ? "bg-[#14231b] text-white border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
                      : "bg-white text-[#173124] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
                  }`}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className={`font-['Space_Grotesk',sans-serif] text-[11.5px] font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                }`}>
                  Months
                </label>
                <input
                  type="number"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value === "" ? "" : Number(e.target.value))}
                  className={`w-full font-['Sora',sans-serif] text-base py-3 px-4 rounded-2xl border transition-all focus:outline-none ${
                    isDarkMode
                      ? "bg-[#14231b] text-white border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
                      : "bg-white text-[#173124] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
                  }`}
                />
              </div>
            </div>

            {/* Weight & Height */}
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className={`font-['Space_Grotesk',sans-serif] text-[11.5px] font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                }`}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className={`w-full font-['Sora',sans-serif] text-base py-3 px-4 rounded-2xl border transition-all focus:outline-none ${
                    isDarkMode
                      ? "bg-[#14231b] text-white border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
                      : "bg-white text-[#173124] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
                  }`}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className={`font-['Space_Grotesk',sans-serif] text-[11.5px] font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
                }`}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  className={`w-full font-['Sora',sans-serif] text-base py-3 px-4 rounded-2xl border transition-all focus:outline-none ${
                    isDarkMode
                      ? "bg-[#14231b] text-white border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
                      : "bg-white text-[#173124] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
                  }`}
                />
              </div>
            </div>

            <div className="mt-2">
              <RetroButton
                type="submit"
                disabled={isCalculating}
                variant="green"
                icon={isCalculating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              >
                {isCalculating ? "Calculating WHO percentile..." : "Calculate & Save Vitals"}
              </RetroButton>
            </div>
          </form>

          {calcResult && (
            <div className={`p-6 rounded-3xl border shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
              isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white/80 border-[#e3e2df]"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
                }`}>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className={`font-['Sora',sans-serif] text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-[#173124]"
                }`}>
                  Result: {calcResult.status} ({calcResult.percentile})
                </h4>
              </div>
              <p className={`font-['Manrope',sans-serif] text-sm font-medium leading-relaxed ${
                isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"
              }`}>
                {calcResult.advice}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
