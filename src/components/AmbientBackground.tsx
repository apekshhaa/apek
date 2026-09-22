import React from "react";

export const AmbientBackground: React.FC = () => {
  return (
    <div className="poshan-ambient-bg" aria-hidden="true">
      <svg
        className="poshan-line-art"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 3–4 thin concentric circles inspired by tree growth rings near upper-right */}
        <g transform="translate(860, 110)">
          <circle r="45" strokeWidth="1.2" strokeDasharray="6 3" />
          <circle r="80" strokeWidth="1.2" />
          <circle r="120" strokeWidth="1.0" strokeDasharray="10 4" />
          <circle r="165" strokeWidth="1.2" />
        </g>

        {/* 1–2 tiny abstract leaf / sprout shapes near lower-left */}
        <g transform="translate(75, 780)">
          <path
            d="M 20 100 C 25 70 40 45 65 30 C 50 55 45 80 40 100"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 33 65 C 10 50 -5 65 15 78 C 30 72 32 67 33 65 Z"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 45 48 C 65 30 80 45 60 60 C 48 55 46 50 45 48 Z"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 2 very subtle flowing/wavy horizontal lines near bottom */}
        <path
          d="M -50 880 Q 250 840 500 890 T 1050 850"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M -50 920 Q 300 960 600 900 T 1050 940"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
