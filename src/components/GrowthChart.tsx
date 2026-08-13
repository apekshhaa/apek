import React from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceArea as RechartsReferenceArea,
  CartesianGrid,
} from "recharts";
import { curveNatural } from "@visx/curve";

const ReferenceArea = RechartsReferenceArea as any;

interface GrowthChartProps {
  activeMetric: "weight" | "height" | "muac";
  isDarkMode?: boolean;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  activeMetric,
  isDarkMode = false,
}) => {
  const chartData = [
    { month: "Birth", desktop: activeMetric === "weight" ? 3.3 : activeMetric === "height" ? 50 : 11.2, mobile: 3.2 },
    { month: "6 M", desktop: activeMetric === "weight" ? 7.8 : activeMetric === "height" ? 67 : 13.8, mobile: 7.9 },
    { month: "12 M", desktop: activeMetric === "weight" ? 10.1 : activeMetric === "height" ? 76 : 14.6, mobile: 9.6 },
    { month: "18 M", desktop: activeMetric === "weight" ? 11.5 : activeMetric === "height" ? 82.5 : 15.0, mobile: 11.0 },
    { month: "24 M", desktop: activeMetric === "weight" ? 12.4 : activeMetric === "height" ? 88.5 : 15.2, mobile: 12.2 },
  ];

  const y1 = activeMetric === "weight" ? 9.5 : activeMetric === "height" ? 80 : 13.5;
  const y2 = activeMetric === "weight" ? 14.0 : activeMetric === "height" ? 92 : 16.0;

  const textColor = isDarkMode ? "#ffffff" : "#173124";
  const axisColor = isDarkMode ? "#b0c4b5" : "#59625a";
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
  const desktopLineColor = isDarkMode ? "#3fff80" : "#173124";
  const mobileLineColor = isDarkMode ? "#60a5fa" : "#88a38a";

  return (
    <div className={`w-full h-60 p-3 rounded-2xl transition-colors border ${
      isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#faf9f5] border-[#e3e2df]"
    }`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <ReferenceArea
            y1={y1}
            y2={y2}
            fill={isDarkMode ? "rgba(63, 255, 128, 0.12)" : "rgba(202, 232, 201, 0.35)"}
            stroke={isDarkMode ? "rgba(63, 255, 128, 0.3)" : "#a8d8a5"}
            strokeDasharray="4 4"
          />
          <RechartsXAxis
            dataKey="month"
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 11, fontWeight: 700 }}
            tickLine={false}
          />
          <YAxis
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 11, fontWeight: 700 }}
            tickLine={false}
          />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#122018" : "#faf9f5",
              borderColor: isDarkMode ? "#22392b" : "#e3e2df",
              borderRadius: "12px",
              color: textColor,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              fontSize: "12px",
              fontWeight: "600",
            }}
          />
          <RechartsLine
            name="WHO Standard"
            dataKey="mobile"
            stroke={mobileLineColor}
            strokeWidth={2}
            strokeDasharray="4 4"
            curve={curveNatural}
            dot={false}
          />
          <RechartsLine
            name="Child Growth"
            dataKey="desktop"
            stroke={desktopLineColor}
            strokeWidth={3}
            curve={curveNatural}
            dot={{ r: 5, fill: desktopLineColor, strokeWidth: 2, stroke: isDarkMode ? "#14231b" : "#faf9f5" }}
            activeDot={{ r: 7 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
