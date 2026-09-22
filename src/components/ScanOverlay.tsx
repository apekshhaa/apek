import React from "react";

interface ScanOverlayProps {
  active?: boolean;
  isDarkMode?: boolean;
}

export const ScanOverlay: React.FC<ScanOverlayProps> = ({ active = false, isDarkMode = false }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div
        className={`absolute inset-0 ${isDarkMode ? "bg-[#0a120e]/40" : "bg-[#faf9f5]/25"}`}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M160 40C123 40 96 71 96 108V134C96 147 90 158 80 166L60 182C47 191 40 208 46 223L63 267C73 292 88 307 112 316L136 324C149 328 163 328 176 324L200 316C224 307 239 292 249 267L266 223C272 208 265 191 252 182L232 166C222 158 216 147 216 134V108C216 71 189 40 160 40Z"
          stroke={isDarkMode ? "#3fff80" : "#173124"}
          strokeWidth="3"
          strokeDasharray="10 10"
          opacity={active ? 1 : 0.7}
        />

        <path
          d="M160 132V205"
          stroke={isDarkMode ? "#3fff80" : "#173124"}
          strokeWidth="3"
          strokeDasharray="10 10"
          opacity={active ? 1 : 0.7}
        />

        <path
          d="M160 150C187 160 204 181 204 214C204 233 195 249 181 261L171 270C165 275 160 282 160 291V310"
          stroke={isDarkMode ? "#3fff80" : "#173124"}
          strokeWidth="3"
          strokeDasharray="10 10"
          opacity={active ? 1 : 0.7}
        />

        <path
          d="M160 150C133 160 116 181 116 214C116 233 125 249 139 261L149 270C155 275 160 282 160 291V310"
          stroke={isDarkMode ? "#3fff80" : "#173124"}
          strokeWidth="3"
          strokeDasharray="10 10"
          opacity={active ? 1 : 0.7}
        />

        <path
          d="M160 205L160 311"
          stroke={isDarkMode ? "#3fff80" : "#173124"}
          strokeWidth="3"
          strokeDasharray="10 10"
          opacity={active ? 1 : 0.7}
        />
      </svg>

      <div
        className={`absolute left-1/2 h-[55%] w-[72%] -translate-x-1/2 rounded-[26px] border border-[#3fff80]/70 bg-[#3fff80]/5 shadow-[0_0_18px_rgba(63,255,128,0.6)] ${
          active ? "scan-sweep" : "opacity-60"
        }`}
        style={{
          top: "16%",
          boxShadow: active ? "0 0 30px rgba(63,255,128,0.45)" : "0 0 18px rgba(63,255,128,0.2)",
        }}
      />

      <div className="absolute left-4 top-4 h-8 w-8 rounded-tl-2xl border-l-4 border-t-4 border-[#3fff80]" />
      <div className="absolute right-4 top-4 h-8 w-8 rounded-tr-2xl border-r-4 border-t-4 border-[#3fff80]" />
      <div className="absolute bottom-4 left-4 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-[#3fff80]" />
      <div className="absolute bottom-4 right-4 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 border-[#3fff80]" />
    </div>
  );
};
