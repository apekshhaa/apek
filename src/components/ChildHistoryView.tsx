import React, { useEffect, useState } from "react";
import { ArrowUpRight, ClipboardList, FileText, Ruler, Scale, Stethoscope } from "lucide-react";
import { jsPDF } from "jspdf";
import { ChildProfile, HistoryRecord, VitalRecord } from "../types";

interface ChildHistoryViewProps {
  child: ChildProfile;
  vitals: VitalRecord;
  history: HistoryRecord[];
  isDarkMode?: boolean;
}

export const ChildHistoryView: React.FC<ChildHistoryViewProps> = ({ child, vitals, history, isDarkMode = false }) => {
  const ink = isDarkMode ? "text-white" : "text-[#173124]";
  const muted = isDarkMode ? "text-[#a8b9ad]" : "text-[#59625a]";
  const rule = isDarkMode ? "border-[#31553d]" : "border-[#d8ddd5]";
  const panel = isDarkMode ? "bg-[#14231b]" : "bg-[#f4f5ef]";
  const records = history.length ? history : [{
    id: "latest",
    ...vitals,
    recordedAt: vitals.date,
    ageYears: child.ageYears,
    ageMonths: child.ageMonths,
    healthStatus: child.status,
    source: "Growth tracking" as const,
  }];
  const latestRecord = records[0];
  const latestBmi = latestRecord.bmi;
  const bmiHealthStatus = latestBmi === undefined
    ? "Needs review"
    : latestBmi >= 14 && latestBmi <= 18
      ? "Healthy"
      : latestBmi < 14
        ? "Needs attention"
        : "Needs review";
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    { icon: Ruler, label: "Height", value: `${latestRecord.height.toFixed(1)} cm` },
    { icon: Scale, label: "Weight", value: `${latestRecord.weight.toFixed(1)} kg` },
    { icon: ClipboardList, label: "Age", value: `${latestRecord.ageYears}y ${latestRecord.ageMonths}m` },
    { icon: ArrowUpRight, label: "Health status", value: latestRecord.healthStatus },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => setActiveMetric((current) => (current + 1) % metrics.length), 5000);
    return () => window.clearInterval(timer);
  }, [metrics.length]);

  const exportReport = () => {
    const reportDate = new Date();
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const green = "#173124";
    const lime = "#86bf15";
    const ink = "#1b1c1a";
    const mutedInk = "#59625a";
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(green);
    pdf.rect(0, 0, pageWidth, 36, "F");
    pdf.setTextColor("#ffffff");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("POSHANEYE  |  CHILD HEALTH RECORD", 18, 14);
    pdf.setFontSize(22);
    pdf.text("Growth & Wellness Report", 18, 27);
    pdf.setDrawColor(lime);
    pdf.setLineWidth(1.2);
    pdf.line(18, 42, pageWidth - 18, 42);

    pdf.setTextColor(ink);
    pdf.setFontSize(16);
    pdf.text(child.name, 18, 55);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(mutedInk);
    pdf.text(`Report date: ${reportDate.toLocaleDateString()}`, pageWidth - 18, 55, { align: "right" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(mutedInk);
    pdf.text("PATIENT DETAILS", 18, 68);
    pdf.setDrawColor("#d8ddd5");
    pdf.line(18, 71, pageWidth - 18, 71);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(ink);
    pdf.setFontSize(11);
    pdf.text(`Parent / guardian: ${child.parentNames}`, 18, 81);
    pdf.text(`Age: ${latestRecord.ageYears} years, ${latestRecord.ageMonths} months`, 18, 89);
    pdf.text(`Attending doctor: Dr. Meera Nair`, pageWidth - 18, 81, { align: "right" });
    pdf.text(`Health status: ${latestRecord.healthStatus}`, pageWidth - 18, 89, { align: "right" });

    pdf.setFillColor("#f1f5ed");
    pdf.roundedRect(18, 101, pageWidth - 36, 39, 3, 3, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(mutedInk);
    pdf.text("LATEST MEASUREMENTS", 25, 112);
    pdf.setTextColor(ink);
    pdf.setFontSize(16);
    pdf.text(`${latestRecord.height.toFixed(1)} cm`, 25, 127);
    pdf.text(`${latestRecord.weight.toFixed(1)} kg`, 82, 127);
    pdf.text(latestRecord.bmi ? latestRecord.bmi.toFixed(1) : "--", 139, 127);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(mutedInk);
    pdf.text("Height", 25, 134);
    pdf.text("Weight", 82, 134);
    pdf.text("BMI", 139, 134);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(mutedInk);
    pdf.text("CLINICAL RECORD", 18, 158);
    pdf.line(18, 161, pageWidth - 18, 161);
    let y = 172;
    records.slice(0, 6).forEach((record, index) => {
      pdf.setTextColor(ink);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(`${index + 1}. ${record.healthStatus}`, 18, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(mutedInk);
      pdf.text(`${record.recordedAt}  |  ${record.height.toFixed(1)} cm  |  ${record.weight.toFixed(1)} kg  |  Age ${record.ageYears}y ${record.ageMonths}m`, 18, y + 6);
      y += 18;
    });

    pdf.setDrawColor(lime);
    pdf.setLineWidth(0.7);
    pdf.line(18, 268, pageWidth - 18, 268);
    pdf.setTextColor(ink);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Doctor's prescription", 18, 280);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(mutedInk);
    pdf.text("Continue regular meals, hydration, and outdoor play.", 18, 288);
    pdf.text("Bring this report to the next pediatric review.", 18, 295);
    pdf.setFontSize(8);
    pdf.text("Generated by PoshanEye  |  This report is for clinical discussion and record keeping.", 18, 312);
    pdf.save(`${child.name.replace(/\s+/g, "-").toLowerCase()}-health-report-${reportDate.toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className={`min-h-[calc(100vh-5rem)] w-full max-w-lg mx-auto px-5 pb-32 pt-3 font-['Geist',sans-serif] ${ink}`}>
      <header className="border-b border-current/15 pb-7 text-center">
        <p className={`font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-[0.24em] ${muted}`}>Child history</p>
        <h1 className="mt-3 break-words font-['Sora',sans-serif] text-[clamp(2.6rem,13vw,5.2rem)] font-extrabold leading-[0.86] tracking-[-0.075em]">{child.name}</h1>
        <button type="button" aria-label={`Health status based on latest BMI: ${bmiHealthStatus}`} className={`mx-auto mt-5 flex min-h-12 max-w-[18rem] items-center justify-center rounded-full border px-5 py-3 text-center font-['Manrope',sans-serif] text-sm font-bold ${isDarkMode ? "border-[#3fff80]/40 bg-[#173124] text-[#b7f7bf]" : "border-[#a9c98f] bg-[#e6f3dc] text-[#173124]"}`}>
          Health status : {bmiHealthStatus}
        </button>
        <p className={`mt-4 font-['Manrope',sans-serif] text-sm ${muted}`}>A clear record of growth, scans, and clinical notes.</p>
      </header>

      <section className="border-b border-current/15 py-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className={`font-['Space_Grotesk',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Current details</h2>
          <span className={`text-[11px] ${muted}`}>01 / 03</span>
        </div>
        <div className={`relative overflow-hidden border ${rule} ${panel}`}>
          <div key={metrics[activeMetric].label} className="animate-[journey-in_420ms_cubic-bezier(.22,1,.36,1)]">
            <HistoryMetric icon={metrics[activeMetric].icon} label={metrics[activeMetric].label} value={metrics[activeMetric].value} panel={panel} muted={muted} />
          </div>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {metrics.map((metric, index) => <span key={metric.label} className={`h-1.5 rounded-full transition-all ${index === activeMetric ? "w-5 bg-[#86bf15]" : "w-1.5 bg-current/20"}`} />)}
          </div>
        </div>
      </section>

      <section className="border-b border-current/15 py-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className={`font-['Space_Grotesk',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Previous scans & records</h2>
          <span className={`text-[11px] ${muted}`}>{String(records.length).padStart(2, "0")} entries</span>
        </div>
        <div className="space-y-3">
          {records.map((record) => (
            <article key={record.id} className={`border ${rule} p-4 ${panel}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-[0.16em] ${muted}`}>{record.source}</p>
                  <h3 className="mt-2 font-['Sora',sans-serif] text-lg font-bold tracking-[-0.04em]">{record.healthStatus}</h3>
                </div>
                <span className={`text-right font-['Manrope',sans-serif] text-xs font-semibold ${muted}`}>{record.recordedAt}</span>
              </div>
              <div className={`mt-4 grid grid-cols-3 gap-3 border-t ${rule} pt-3 font-['Manrope',sans-serif] text-xs`}>
                <HistoryValue label="Height" value={`${record.height.toFixed(1)} cm`} muted={muted} />
                <HistoryValue label="Weight" value={`${record.weight.toFixed(1)} kg`} muted={muted} />
                <HistoryValue label="BMI" value={record.bmi ? record.bmi.toFixed(1) : "--"} muted={muted} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className={`font-['Space_Grotesk',sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Doctor's prescription</h2>
          <span className={`text-[11px] ${muted}`}>03 / 03</span>
        </div>
        <div className={`border ${rule} p-5 ${panel}`}>
          <div className="flex gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center ${isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"}`}><Stethoscope className="h-5 w-5" /></div>
            <div>
              <h3 className="font-['Sora',sans-serif] text-lg font-bold tracking-[-0.04em]">Continue the current care plan</h3>
              <p className={`mt-2 font-['Manrope',sans-serif] text-sm leading-relaxed ${muted}`}>Keep regular meals, hydration, and outdoor play consistent. Bring this record to the next pediatric review.</p>
              <div className={`mt-4 flex items-center gap-2 border-t ${rule} pt-3 font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-[0.16em] ${muted}`}><FileText className="h-3.5 w-3.5" /> Review at next visit</div>
            </div>
          </div>
        </div>
        <button type="button" onClick={exportReport} className={`mt-4 flex w-full items-center justify-center gap-2 bg-[#173124] px-4 py-3 font-['Manrope',sans-serif] text-sm font-bold text-[#faf9f5] transition-colors hover:bg-[#2d4739] ${isDarkMode ? "bg-[#3fff80] text-[#0a120e] hover:bg-[#86bf15]" : ""}`}>
          <FileText className="h-4 w-4" /> Export PDF report
        </button>
      </section>
    </div>
  );
};

const HistoryMetric: React.FC<{ icon: React.ComponentType<{ className?: string }>; label: string; value: string; panel: string; muted: string }> = ({ icon: Icon, label, value, panel, muted }) => (
  <div className={`min-w-0 p-4 ${panel}`}><Icon className={`h-4 w-4 ${muted}`} /><p className={`mt-5 font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-[0.14em] ${muted}`}>{label}</p><p className="mt-1 break-words font-['Sora',sans-serif] text-lg font-bold tracking-[-0.04em]">{value}</p></div>
);

const HistoryValue: React.FC<{ label: string; value: string; muted: string }> = ({ label, value, muted }) => (
  <div><p className={`text-[10px] uppercase tracking-[0.1em] ${muted}`}>{label}</p><p className="mt-1 font-bold">{value}</p></div>
);
