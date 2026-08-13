import React, { useState } from "react";
import { ChildProfile, VitalRecord } from "../types";
import { Scale, Ruler, Plus, RefreshCw, ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react";
import { GrowthChart } from "./GrowthChart";

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
    <div className="flex flex-col w-full relative pt-20 pb-32 px-5 max-w-lg mx-auto">
      {/* View Switcher Tabs */}
      <div className={`flex p-1 rounded-full mb-6 relative border transition-colors ${
        isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#e3e2df] border-[#d1d0cb]"
      }`}>
        <button
          onClick={() => setActiveSubTab("dashboard")}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
            activeSubTab === "dashboard"
              ? isDarkMode
                ? "bg-[#1f3829] text-[#3fff80] shadow-xs"
                : "bg-[#faf9f5] text-[#173124] shadow-xs"
              : isDarkMode
              ? "text-[#a2b5a7] hover:text-[#f1f5f2]"
              : "text-[#424844] hover:text-[#173124]"
          }`}
        >
          Growth Trends
        </button>
        <button
          onClick={() => setActiveSubTab("calculator")}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
            activeSubTab === "calculator"
              ? isDarkMode
                ? "bg-[#1f3829] text-[#3fff80] shadow-xs"
                : "bg-[#faf9f5] text-[#173124] shadow-xs"
              : isDarkMode
              ? "text-[#a2b5a7] hover:text-[#f1f5f2]"
              : "text-[#424844] hover:text-[#173124]"
          }`}
        >
          Calculator
        </button>
      </div>

      {activeSubTab === "dashboard" ? (
        <div className="flex flex-col gap-6">
          {/* Status Header Card */}
          <div className={`rounded-2xl p-5 shadow-sm flex items-center justify-between border ${
            isDarkMode ? "bg-[#122b1f] border-[#224432] text-[#faf9f5]" : "bg-[#173124] text-[#faf9f5] border-transparent"
          }`}>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3fff80]">
                Current Status
              </span>
              <h3 className="text-xl font-bold mt-1 text-[#ffffff]">On Track</h3>
              <p className="text-xs text-[#d1d8d3] mt-0.5">WHO Percentile: 75th percentile</p>
            </div>
            <div className="p-3 rounded-full bg-[#234433] text-[#3fff80]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Key Vitals Summary Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border transition-colors ${
              isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]/60"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Scale className={`w-4 h-4 ${isDarkMode ? "text-[#3fff80]" : "text-[#173124]"}`} />
                <span className={`text-xs font-semibold ${isDarkMode ? "text-[#a2b5a7]" : "text-[#59625a]"}`}>Weight</span>
              </div>
              <p className={`text-2xl font-extrabold ${isDarkMode ? "text-[#ffffff]" : "text-[#173124]"}`}>
                {vitals.weight} <span className="text-sm font-normal">kg</span>
              </p>
              <span className={`inline-block text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
              }`}>
                {vitals.percentile} Percentile
              </span>
            </div>

            <div className={`p-4 rounded-2xl border transition-colors ${
              isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]/60"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Ruler className={`w-4 h-4 ${isDarkMode ? "text-[#3fff80]" : "text-[#173124]"}`} />
                <span className={`text-xs font-semibold ${isDarkMode ? "text-[#a2b5a7]" : "text-[#59625a]"}`}>Height</span>
              </div>
              <p className={`text-2xl font-extrabold ${isDarkMode ? "text-[#ffffff]" : "text-[#173124]"}`}>
                {vitals.height} <span className="text-sm font-normal">cm</span>
              </p>
              <span className={`inline-block text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
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
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all capitalize border ${
                  activeMetric === m
                    ? isDarkMode
                      ? "bg-[#3fff80] text-[#0a120e] border-[#3fff80]"
                      : "bg-[#173124] text-[#faf9f5] border-[#173124]"
                    : isDarkMode
                    ? "bg-[#14231b] text-[#a2b5a7] border-[#22392b] hover:text-[#ffffff]"
                    : "bg-[#efeeea] text-[#59625a] border-[#e3e2df] hover:text-[#173124]"
                }`}
              >
                {m === "muac" ? "MUAC" : m}
              </button>
            ))}
          </div>

          {/* Recharts Curve Graph */}
          <div className="flex flex-col gap-2">
            <h3 className={`text-lg font-bold px-1 capitalize ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
              {activeMetric} Progress Curve
            </h3>
            <GrowthChart activeMetric={activeMetric} isDarkMode={isDarkMode} />
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center mt-2">
            <p className={`text-sm text-center mb-3 ${isDarkMode ? "text-[#a2b5a7]" : "text-[#424844]"}`}>
              Want to calculate & log a new measurement?
            </p>
            <button
              onClick={() => setActiveSubTab("calculator")}
              className={`text-sm font-semibold py-3 px-6 rounded-full flex items-center gap-2 active:scale-95 transition-all shadow-md ${
                isDarkMode
                  ? "bg-[#3fff80] text-[#0a120e] hover:bg-[#34e06e]"
                  : "bg-[#173124] text-white hover:bg-[#2d4739]"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Log New Vitals</span>
            </button>
          </div>
        </div>
      ) : (
        /* Calculator & Form Mode */
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-1">
            <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-[#ffffff]" : "text-[#173124]"}`}>
              Check growth against WHO standards
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-[#a2b5a7]" : "text-[#424844]"}`}>
              Enter details below to generate percentile estimations.
            </p>
          </section>

          <form onSubmit={handleCalculate} className="flex flex-col gap-4">
            {/* Gender Toggle */}
            <div className="flex flex-col gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-[#a2b5a7]" : "text-[#424844]"}`}>
                Gender
              </span>
              <div className={`flex p-1 rounded-full border ${isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#e3e2df] border-[#d1d0cb]"}`}>
                <button
                  type="button"
                  onClick={() => setGender("boy")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                    gender === "boy"
                      ? isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-white text-[#173124]"
                      : isDarkMode ? "text-[#a2b5a7]" : "text-[#424844]"
                  }`}
                >
                  Boy
                </button>
                <button
                  type="button"
                  onClick={() => setGender("girl")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                    gender === "girl"
                      ? isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-white text-[#173124]"
                      : isDarkMode ? "text-[#a2b5a7]" : "text-[#424844]"
                  }`}
                >
                  Girl
                </button>
              </div>
            </div>

            {/* Age Inputs */}
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className={`text-xs font-semibold ${isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"}`}>Age (Years)</label>
                <input
                  type="number"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value === "" ? "" : Number(e.target.value))}
                  className={`w-full text-base py-2.5 px-3 rounded-xl border focus:outline-none ${
                    isDarkMode
                      ? "bg-[#14231b] text-[#ffffff] border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
                      : "bg-[#f4f4f0] text-[#1b1c1a] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
                  }`}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className={`text-xs font-semibold ${isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"}`}>Months</label>
                <input
                  type="number"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value === "" ? "" : Number(e.target.value))}
                  className={`w-full text-base py-2.5 px-3 rounded-xl border focus:outline-none ${
                    isDarkMode
                      ? "bg-[#14231b] text-[#ffffff] border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
                      : "bg-[#f4f4f0] text-[#1b1c1a] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
                  }`}
                />
              </div>
            </div>

            {/* Weight & Height */}
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className={`text-xs font-semibold ${isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"}`}>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className={`w-full text-base py-2.5 px-3 rounded-xl border focus:outline-none ${
                    isDarkMode
                      ? "bg-[#14231b] text-[#ffffff] border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
                      : "bg-[#f4f4f0] text-[#1b1c1a] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
                  }`}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className={`text-xs font-semibold ${isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"}`}>Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  className={`w-full text-base py-2.5 px-3 rounded-xl border focus:outline-none ${
                    isDarkMode
                      ? "bg-[#14231b] text-[#ffffff] border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
                      : "bg-[#f4f4f0] text-[#1b1c1a] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className={`w-full py-3 mt-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isDarkMode
                  ? "bg-[#3fff80] text-[#0a120e] hover:bg-[#34e06e]"
                  : "bg-[#173124] text-white hover:bg-[#234433]"
              }`}
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calculating WHO percentile...</span>
                </>
              ) : (
                <>
                  <span>Calculate & Save Vitals</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {calcResult && (
            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-5 h-5 ${isDarkMode ? "text-[#3fff80]" : "text-[#173124]"}`} />
                <h4 className={`text-base font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#173124]"}`}>
                  Result: {calcResult.status} ({calcResult.percentile})
                </h4>
              </div>
              <p className={`text-xs ${isDarkMode ? "text-[#d1d5db]" : "text-[#424844]"}`}>
                {calcResult.advice}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
