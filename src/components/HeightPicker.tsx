import React, { useMemo } from "react";

interface HeightPickerProps {
  open: boolean;
  value: number;
  onChange: (value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

export const HeightPicker: React.FC<HeightPickerProps> = ({
  open,
  value,
  onChange,
  onConfirm,
  onCancel,
  isDarkMode = false,
}) => {
  if (!open) return null;

  const values = useMemo(() => Array.from({ length: 161 }, (_, index) => 40 + index), []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0a120e]/55 p-3 sm:items-center">
      <div
        className={`w-full max-w-md rounded-[28px] border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] ${
          isDarkMode ? "border-[#22392b] bg-[#14231b] text-white" : "border-[#e3e2df] bg-white text-[#173124]"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className={`font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? "text-[#b0c4b5]" : "text-[#59625a]"}`}>
              Height
            </p>
            <h3 className="mt-1 font-['Sora',sans-serif] text-xl font-bold">Choose height</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className={`rounded-full px-3 py-1.5 font-['Manrope',sans-serif] text-xs font-bold ${
              isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#efeeea] text-[#173124]"
            }`}
          >
            Close
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-dashed border-[#7aa48a] bg-[#f8fbf9] p-3 text-center">
          <p className="font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-[0.18em] text-[#4c6c55]">
            Selected
          </p>
          <p className="mt-2 font-['Sora',sans-serif] text-3xl font-black text-[#173124]">
            {value} cm
          </p>
        </div>

        <div className="max-h-[280px] overflow-y-auto rounded-2xl bg-[#f7f8f7] p-2">
          <div className="grid grid-cols-4 gap-2">
            {values.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                className={`rounded-xl px-2 py-2 font-['Manrope',sans-serif] text-sm font-bold transition-all ${
                  item === value
                    ? isDarkMode
                      ? "bg-[#3fff80] text-[#0a120e] shadow-sm"
                      : "bg-[#173124] text-white shadow-sm"
                    : isDarkMode
                      ? "bg-[#1a2d26] text-[#dfece4]"
                      : "bg-white text-[#173124]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-4 w-full rounded-2xl bg-[#173124] px-4 py-3 font-['Manrope',sans-serif] text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(23,49,36,0.2)] transition-transform hover:scale-[1.01]"
        >
          Enter
        </button>
      </div>
    </div>
  );
};
