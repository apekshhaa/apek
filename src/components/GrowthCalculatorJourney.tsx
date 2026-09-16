import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Baby, Check, ChevronDown, Flower2, Info } from "lucide-react";
import { ChildProfile, VitalRecord } from "../types";

type CalcResult = { bmi: string; percentile: string; status: string; advice: string } | null;
type Values = { gender: "boy" | "girl"; ageYears: number | ""; ageMonths: number | ""; weight: string; height: string };

interface Props {
  child: ChildProfile;
  vitals: VitalRecord;
  isDarkMode: boolean;
  isCalculating: boolean;
  calcResult: CalcResult;
  onCalculate: (values: Values) => Promise<void>;
  onSaved: () => void;
}

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, index) => start + index);
const LIMITS = { ageYears: 18, ageMonths: 11, weight: 80, height: 190 };

export const GrowthCalculatorJourney: React.FC<Props> = ({ child, vitals, isDarkMode, isCalculating, calcResult, onCalculate, onSaved }) => {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<"boy" | "girl">(child.gender);
  const [ageYears, setAgeYears] = useState<number>(child.ageYears);
  const [ageMonths, setAgeMonths] = useState<number>(child.ageMonths);
  const [weight, setWeight] = useState(Number(vitals.weight.toFixed(1)));
  const [height, setHeight] = useState(Number(vitals.height.toFixed(1)));
  const [validationMessage, setValidationMessage] = useState("");
  const [direction, setDirection] = useState(1);

  const ink = isDarkMode ? "text-white" : "text-[#173124]";
  const muted = isDarkMode ? "text-[#b0c4b5]" : "text-[#59625a]";
  const surface = isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]";
  const soft = isDarkMode ? "bg-[#1f3829]" : "bg-[#eef5e9]";
  const green = isDarkMode ? "#3fff80" : "#173124";

  const move = (next: number) => {
    if (next === step || next < 1 || next > 5) return;
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const continueJourney = async () => {
    setValidationMessage("");
    if (step < 4) {
      if (step === 2 && (ageYears < 0 || ageYears > LIMITS.ageYears || ageMonths < 0 || ageMonths > LIMITS.ageMonths)) {
        setValidationMessage("Invalid age. Enter 0–18 years and 0–11 months.");
        return;
      }
      if (step === 3 && (weight < 2 || weight > LIMITS.weight || !Number.isFinite(weight))) {
        setValidationMessage("Invalid weight. Enter a value from 2 to 80 kg.");
        return;
      }
      move(step + 1);
      return;
    }
    if (step === 4) {
      if (height < 45 || height > LIMITS.height || !Number.isFinite(height)) {
        setValidationMessage("Invalid height. Enter a value from 45 to 190 cm.");
        return;
      }
      const safeAgeYears = Math.max(0, Math.min(LIMITS.ageYears, Number(ageYears) || 0));
      const safeAgeMonths = Math.max(0, Math.min(LIMITS.ageMonths, Number(ageMonths) || 0));
      const safeWeight = Math.max(2, Math.min(LIMITS.weight, Number(weight) || 2));
      const safeHeight = Math.max(45, Math.min(LIMITS.height, Number(height) || 45));
      setAgeYears(safeAgeYears);
      setAgeMonths(safeAgeMonths);
      setWeight(safeWeight);
      setHeight(safeHeight);
      await onCalculate({ gender, ageYears: safeAgeYears, ageMonths: safeAgeMonths, weight: safeWeight.toFixed(1), height: safeHeight.toFixed(1) });
      move(5);
      return;
    }
    setStep(1);
    onSaved();
  };

  return (
    <div className="relative min-h-[calc(100vh-12rem)] flex flex-col overflow-hidden pb-28">
      <JourneyHeader step={step} onBack={() => move(step - 1)} muted={muted} ink={ink} />
      <div key={step} className="flex-1 flex flex-col animate-[journey-in_420ms_cubic-bezier(.22,1,.36,1)]" style={{ transform: `translateX(${direction * 0}px)` }}>
        <div className="pt-4 pb-3">
          <p className={`font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-[1.8px] ${muted}`}>WHO growth standards</p>
          <h1 className={`font-['Sora',sans-serif] text-[clamp(2rem,9vw,3.25rem)] leading-[0.95] tracking-[-0.055em] font-bold mt-2 ${ink}`}>
            {step === 1 ? "Select gender" : step === 2 ? "Enter age" : step === 3 ? "Enter weight" : step === 4 ? "Enter height" : "Growth report"}
          </h1>
          <p className={`font-['Manrope',sans-serif] text-sm leading-relaxed mt-3 max-w-[31rem] ${muted}`}>
            {step === 1 ? "Gender helps us compare measurements with the right WHO growth standard." : step === 2 ? "Choose the child's age in years and months." : step === 3 ? "Move the dial to set the latest measured weight." : step === 4 ? "Move the ruler to set the latest measured height." : `${child.name}'s measurements compared with WHO growth standards.`}
          </p>
          {validationMessage && <p role="alert" className="mt-2 font-['Manrope',sans-serif] text-xs font-bold text-[#b94e42]">{validationMessage}</p>}
        </div>

        <div className="flex-1 flex items-start justify-center pt-0 pb-12">
          {step === 1 && <GenderStep gender={gender} setGender={setGender} surface={surface} soft={soft} ink={ink} muted={muted} green={green} />}
          {step === 2 && <AgeStep ageYears={ageYears} ageMonths={ageMonths} setAgeYears={setAgeYears} setAgeMonths={setAgeMonths} ink={ink} muted={muted} soft={soft} />}
          {step === 3 && <WeightStep value={weight} setValue={setWeight} ink={ink} muted={muted} soft={soft} isDarkMode={isDarkMode} />}
          {step === 4 && <HeightStep value={height} setValue={setHeight} ink={ink} muted={muted} soft={soft} isDarkMode={isDarkMode} />}
          {step === 5 && calcResult && <ReportStep result={calcResult} value={weight} height={height} ink={ink} muted={muted} soft={soft} isDarkMode={isDarkMode} />}
        </div>
      </div>

      <div className={`pointer-events-auto fixed bottom-6 sm:bottom-[104px] left-1/2 z-[100] w-full max-w-lg -translate-x-1/2 px-5 pt-2 pb-1 backdrop-blur-md ${isDarkMode ? "bg-[#0a120e]/95" : "bg-[#faf9f5]/95"}`}>
        <div className={`flex items-center justify-center gap-2 font-['Manrope',sans-serif] text-[11px] ${muted}`}><Info className="w-3.5 h-3.5" />This will be saved to your profile</div>
        <button type="button" onClick={continueJourney} disabled={isCalculating} className={`pointer-events-auto mt-2 w-full rounded-2xl px-5 py-3.5 flex items-center justify-center gap-2 font-['Manrope',sans-serif] text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60 ${isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#173124] text-[#faf9f5] hover:bg-[#2d4739]"}`}>
          {isCalculating ? "Calculating WHO percentile..." : step === 5 ? "Save to Profile" : step === 4 ? "View Growth Report" : "Continue"}
          {!isCalculating && (step === 5 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
        </button>
      </div>
    </div>
  );
};

const JourneyHeader: React.FC<{ step: number; onBack: () => void; muted: string; ink: string }> = ({ step, onBack, muted, ink }) => (
  <div className="flex items-center gap-3 pt-1">
    <button onClick={onBack} disabled={step === 1} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-0 ${ink}`} aria-label="Go back"><ArrowLeft className="w-5 h-5" /></button>
    <div className="flex-1"><div className="h-1 rounded-full bg-[#dbe6d7] overflow-hidden"><div className="h-full rounded-full bg-[#86bf15] transition-all duration-500" style={{ width: `${step * 20}%` }} /></div></div>
    <span className={`font-['Space_Grotesk',sans-serif] text-xs font-semibold ${muted}`}>{step}/5</span>
  </div>
);

const GenderStep: React.FC<{ gender: "boy" | "girl"; setGender: (value: "boy" | "girl") => void; surface: string; soft: string; ink: string; muted: string; green: string }> = ({ gender, setGender, surface, soft, ink, muted, green }) => (
  <div className="grid grid-cols-2 gap-3 w-full">
    {(["boy", "girl"] as const).map((option) => {
      const selected = gender === option;
      const Icon = option === "boy" ? Baby : Flower2;
      return <button key={option} onClick={() => setGender(option)} className={`group min-h-[160px] rounded-3xl border p-4 flex flex-col items-center justify-center gap-4 transition-all duration-300 active:scale-[0.97] ${selected ? `${soft} ${option === "boy" ? "border-[#173124]" : "border-[#86bf15]"} shadow-[0_0_0_4px_rgba(134,191,21,0.14)] -translate-y-1` : `${surface} hover:-translate-y-1`}`}>
        <span className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 ${selected ? "bg-[#86bf15] text-[#173124] scale-110" : "bg-[#cae8c9] text-[#173124] group-hover:scale-105"}`}><Icon className="w-8 h-8" strokeWidth={1.8} /></span>
        <span className={`font-['Sora',sans-serif] text-lg font-semibold capitalize ${ink}`}>{option}</span>
        {selected && <span className="sr-only" style={{ color: green }}>Selected</span>}
      </button>;
    })}
  </div>
);

const AgeStep: React.FC<{ ageYears: number; ageMonths: number; setAgeYears: (value: number) => void; setAgeMonths: (value: number) => void; ink: string; muted: string; soft: string }> = ({ ageYears, ageMonths, setAgeYears, setAgeMonths, ink, muted, soft }) => {
  const dragRef = useRef({ last: null as number | null, remainder: 0 });
  const wheelRef = useRef(0);
  const ageRef = useRef(ageYears);
  const [ageInput, setAgeInput] = useState(`${ageYears}`);
  const ageInputFocused = useRef(false);
  ageRef.current = ageYears;
  const invalidAge = ageYears < 0 || ageYears > LIMITS.ageYears || ageMonths < 0 || ageMonths > LIMITS.ageMonths;
  useEffect(() => {
    if (!ageInputFocused.current) setAgeInput(`${ageYears}`);
  }, [ageYears]);
  const updateFromDrag = (clientY: number) => {
    if (dragRef.current.last === null) dragRef.current.last = clientY;
    dragRef.current.remainder += dragRef.current.last - clientY;
    dragRef.current.last = clientY;
    const steps = Math.trunc(dragRef.current.remainder / 30);
    if (!steps) return;
    dragRef.current.remainder -= steps * 30;
    const nextAge = Math.max(0, Math.min(18, ageRef.current + steps));
    ageRef.current = nextAge;
    setAgeYears(nextAge);
  };
  const stopDrag = () => { dragRef.current.last = null; dragRef.current.remainder = 0; };
  const updateFromWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    wheelRef.current += event.deltaY;
    const steps = Math.trunc(wheelRef.current / 45);
    if (!steps) return;
    wheelRef.current -= steps * 45;
    const nextAge = Math.max(0, Math.min(18, ageRef.current + steps));
    ageRef.current = nextAge;
    setAgeYears(nextAge);
  };
  return <div className="w-full" onWheel={updateFromWheel}>
    <div className="relative h-[218px] overflow-hidden flex flex-col items-center justify-center">
      <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[74px] rounded-2xl ${soft}`} />
      <div className="relative z-10 flex flex-col items-center gap-1 select-none touch-none cursor-ns-resize" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); dragRef.current.last = event.clientY; }} onPointerMove={(event) => event.buttons === 1 && updateFromDrag(event.clientY)} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
        {[-2, -1, 0, 1, 2].map((offset) => {
          const age = ageYears + offset;
          const isVisible = age >= 0 && age <= 18;
          return offset === 0 ? <input key={offset} type="number" min="0" max="18" value={ageInput} onFocus={() => { ageInputFocused.current = true; setAgeInput(`${ageYears}`); }} onChange={(event) => { const raw = event.target.value; setAgeInput(raw); if (raw !== "" && Number.isFinite(Number(raw))) setAgeYears(Number(raw)); }} onBlur={() => { ageInputFocused.current = false; const nextAge = Math.max(0, Math.min(18, Number(ageInput) || 0)); setAgeInput(`${nextAge}`); setAgeYears(nextAge); }} className={`h-[40px] w-[180px] bg-transparent text-center font-['Sora',sans-serif] text-4xl font-bold outline-none ${invalidAge ? "text-[#b94e42]" : ink}`} aria-label="Age in years" /> : <button key={offset} onClick={() => isVisible && setAgeYears(age)} disabled={!isVisible} className={`h-[40px] w-full px-8 font-['Sora',sans-serif] text-xl ${muted} opacity-40 ${!isVisible ? "invisible" : ""}`}>{age}</button>;
        })}
      </div>
    </div>
    <div className={`mt-4 border-t border-b py-4 flex items-center justify-between ${invalidAge ? "border-[#b94e42]" : ""} ${muted}`}>
      <span className="font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-[1.5px]">Months</span>
      <div className="flex items-center gap-3"><button onClick={() => setAgeMonths(Math.max(0, ageMonths - 1))} className="w-8 h-8 rounded-full bg-[#cae8c9] text-[#173124]">−</button><strong className={`font-['Sora',sans-serif] text-lg ${ink}`}>{ageMonths}</strong><button onClick={() => setAgeMonths(Math.min(11, ageMonths + 1))} className="w-8 h-8 rounded-full bg-[#cae8c9] text-[#173124]">+</button></div>
    </div>
  </div>;
};

const WeightStep: React.FC<{ value: number; setValue: (value: number) => void; ink: string; muted: string; soft: string; isDarkMode: boolean }> = ({ value, setValue, ink, muted, soft, isDarkMode }) => {
  const dragRef = useRef({ last: null as number | null, remainder: 0 });
  const valueRef = useRef(value);
  const [inputValue, setInputValue] = useState(value.toFixed(1));
  const inputFocused = useRef(false);
  valueRef.current = value;
  const invalidWeight = value < 2 || value > LIMITS.weight || !Number.isFinite(value);
  useEffect(() => {
    if (!inputFocused.current) setInputValue(value.toFixed(1));
  }, [value]);
  const update = (clientX: number) => {
    if (dragRef.current.last === null) dragRef.current.last = clientX;
    dragRef.current.remainder += clientX - dragRef.current.last;
    dragRef.current.last = clientX;
    const steps = Math.trunc(dragRef.current.remainder / 12);
    if (!steps) return;
    dragRef.current.remainder -= steps * 12;
    const nextValue = Math.max(2, Math.min(80, Number((valueRef.current + steps * 0.1).toFixed(1))));
    valueRef.current = nextValue;
    setValue(nextValue);
  };
  const stopDrag = () => { dragRef.current.last = null; dragRef.current.remainder = 0; };
  return <div className="w-full flex flex-col items-center">
    <div className="relative w-full max-w-[330px] aspect-square flex items-center justify-center touch-none select-none cursor-ew-resize" onPointerDown={(event) => { dragRef.current.last = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => event.buttons === 1 && update(event.clientX)} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
      <svg viewBox="0 0 320 210" className="absolute w-full bottom-6 overflow-visible"><path d="M 40 185 A 122 122 0 0 1 280 185" fill="none" stroke={isDarkMode ? "#31553d" : "#dbe6d7"} strokeWidth="24" strokeLinecap="round" />{range(0, 12).map((tick) => { const angle = 200 + tick * 14; const x = 160 + 120 * Math.cos((angle * Math.PI) / 180); const y = 178 + 120 * Math.sin((angle * Math.PI) / 180); return <line key={tick} x1={x} y1={y} x2={160 + 108 * Math.cos((angle * Math.PI) / 180)} y2={178 + 108 * Math.sin((angle * Math.PI) / 180)} stroke={isDarkMode ? "#b0c4b5" : "#59625a"} strokeWidth="2" />; })}<path d="M 160 178 L 160 67" stroke="#86bf15" strokeWidth="4" strokeLinecap="round" /><circle cx="160" cy="178" r="10" fill="#173124" /></svg>
      <div className="relative z-10 text-center pt-20"><input type="number" min="2" max="80" step="0.1" value={inputValue} onFocus={() => { inputFocused.current = true; setInputValue(value.toFixed(1)); }} onChange={(event) => { const raw = event.target.value; setInputValue(raw); if (raw !== "" && Number.isFinite(Number(raw))) setValue(Number(raw)); }} onBlur={() => { inputFocused.current = false; const nextValue = Math.max(2, Math.min(80, Number(inputValue) || 2)); setInputValue(nextValue.toFixed(1)); setValue(nextValue); }} className={`w-[150px] bg-transparent text-center font-['Sora',sans-serif] text-5xl font-bold tracking-[-0.07em] outline-none ${invalidWeight ? "text-[#b94e42]" : ink}`} aria-label="Weight in kilograms" /><span className={`block font-['Manrope',sans-serif] text-sm mt-1 ${muted}`}>kg</span></div>
    </div>
    <div className={`mt-3 flex w-full max-w-[300px] justify-between font-['Space_Grotesk',sans-serif] text-[10px] uppercase tracking-[1.3px] ${muted}`}><span>2 kg min</span><span>80 kg max</span></div>
    <p className={`font-['Manrope',sans-serif] text-xs text-center mt-2 ${muted}`}>Drag the dial left or right to adjust</p>
  </div>;
};

const HeightStep: React.FC<{ value: number; setValue: (value: number) => void; ink: string; muted: string; soft: string; isDarkMode: boolean }> = ({ value, setValue, ink, muted, soft, isDarkMode }) => {
  const dragRef = useRef({ last: null as number | null, remainder: 0 });
  const valueRef = useRef(value);
  const [inputValue, setInputValue] = useState(value.toFixed(1));
  const inputFocused = useRef(false);
  valueRef.current = value;
  const invalidHeight = value < 45 || value > LIMITS.height || !Number.isFinite(value);
  useEffect(() => {
    if (!inputFocused.current) setInputValue(value.toFixed(1));
  }, [value]);
  const update = (clientY: number) => {
    if (dragRef.current.last === null) dragRef.current.last = clientY;
    dragRef.current.remainder += dragRef.current.last - clientY;
    dragRef.current.last = clientY;
    const steps = Math.trunc(dragRef.current.remainder / 8);
    if (!steps) return;
    dragRef.current.remainder -= steps * 8;
    const nextValue = Math.max(45, Math.min(190, Number((valueRef.current + steps * 0.1).toFixed(1))));
    valueRef.current = nextValue;
    setValue(nextValue);
  };
  const stopDrag = () => { dragRef.current.last = null; dragRef.current.remainder = 0; };
  return <div className="w-full flex flex-col items-center"><div className={`relative w-[190px] h-[260px] overflow-hidden rounded-3xl border touch-none select-none cursor-ns-resize ${soft} ${isDarkMode ? "border-[#31553d]" : "border-[#cae8c9]"}`} onPointerDown={(event) => { dragRef.current.last = event.clientY; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => event.buttons === 1 && update(event.clientY)} onPointerUp={stopDrag} onPointerCancel={stopDrag}><div className="absolute inset-y-0 left-1/2 border-l-2 border-[#86bf15]" />{range(Math.floor(value) - 4, Math.floor(value) + 4).map((mark, index) => <div key={mark} className="absolute left-0 right-0 flex items-center gap-3" style={{ top: `${index * 30 + 5}px` }}><span className={`w-1/2 text-right font-['Space_Grotesk',sans-serif] text-xs ${mark === Math.round(value) ? ink : muted}`}>{mark}</span><span className={`w-7 border-t ${mark === Math.round(value) ? "border-[#86bf15] border-2" : isDarkMode ? "border-[#66816e]" : "border-[#a8b8ac]"}`} /></div>)}<div className="absolute left-0 right-0 top-1/2 flex items-center justify-end"><span className="w-1/2 border-t-2 border-[#86bf15]" /><span className="w-2 h-2 rounded-full bg-[#86bf15] mr-[77px]" /></div></div><div className="mt-4 text-center"><input type="number" min="45" max="190" step="0.1" value={inputValue} onFocus={() => { inputFocused.current = true; setInputValue(value.toFixed(1)); }} onChange={(event) => { const raw = event.target.value; setInputValue(raw); if (raw !== "" && Number.isFinite(Number(raw))) setValue(Number(raw)); }} onBlur={() => { inputFocused.current = false; const nextValue = Math.max(45, Math.min(190, Number(inputValue) || 45)); setInputValue(nextValue.toFixed(1)); setValue(nextValue); }} className={`w-[160px] bg-transparent text-center font-['Sora',sans-serif] text-5xl font-bold tracking-[-0.07em] outline-none ${invalidHeight ? "text-[#b94e42]" : ink}`} aria-label="Height in centimeters" /><span className={`block font-['Manrope',sans-serif] text-sm mt-1 ${muted}`}>cm</span></div><div className={`mt-2 flex w-[190px] justify-between font-['Space_Grotesk',sans-serif] text-[10px] uppercase tracking-[1.3px] ${muted}`}><span>45 min</span><span>190 max</span></div><p className={`font-['Manrope',sans-serif] text-xs mt-2 ${muted}`}>Drag the ruler up or down to adjust</p></div>;
};

const ReportStep: React.FC<{ result: Exclude<CalcResult, null>; value: number; height: number; ink: string; muted: string; soft: string; isDarkMode: boolean }> = ({ result, value, height, ink, muted, soft, isDarkMode }) => {
  const position = Math.min(86, Math.max(14, Number(result.percentile.replace(/[^0-9]/g, "")) || 50));
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="text-center">
        <h2 className={`font-['Sora',sans-serif] text-4xl font-bold mt-4 ${ink}`}>{result.status}</h2>
        <p className={`font-['Manrope',sans-serif] text-sm mt-2 ${muted}`}>{result.advice}</p>
      </div>
      <div className={`rounded-3xl border p-5 ${isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]"}`}>
        <div className={`flex justify-between font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-[1.4px] ${muted}`}><span>Below</span><span>Healthy range</span><span>Above</span></div>
        <div className="relative mt-4 h-5 rounded-full overflow-hidden bg-gradient-to-r from-[#6fa4b5] via-[#cae8c9] to-[#df6b78]"><div className="absolute top-1/2 w-1 h-8 rounded-full bg-[#173124] shadow-md transition-all duration-700" style={{ left: `${position}%`, transform: "translate(-50%, -50%)" }} /></div>
        <div className="flex justify-between mt-5 font-['Manrope',sans-serif] text-sm"><span>{value.toFixed(1)} kg</span><span>{height.toFixed(1)} cm</span><strong className={ink}>{result.percentile} percentile</strong></div>
      </div>
      <button className={`w-full border ${isDarkMode ? "border-[#31553d]" : "border-[#d8ddd5]"} rounded-2xl px-4 py-4 flex items-center justify-between font-['Manrope',sans-serif] text-sm font-bold ${ink}`}><span>View Detailed Report</span><ChevronDown className="w-4 h-4 -rotate-90" /></button>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; isDarkMode: boolean; type?: string }> = ({ label, value, onChange, isDarkMode, type = "text" }) => (
  <label className={`font-['Manrope',sans-serif] text-sm font-semibold ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`mt-1.5 w-full border px-3.5 py-2.5 outline-none font-normal ${isDarkMode ? "bg-[#0d1712] border-[#31553d] text-white focus:border-[#3fff80]" : "bg-[#faf9f5] border-[#e3e2df] text-[#173124] focus:border-[#86bf15]"}`} /></label>
);
