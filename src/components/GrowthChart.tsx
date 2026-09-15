import React from "react";
import { LineChart, Line, Grid, XAxis, ChartTooltip } from "@bklitui/ui/charts";

interface GrowthChartProps {
  activeMetric: "weight" | "height" | "muac";
  isDarkMode?: boolean;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  activeMetric,
  isDarkMode = false,
}) => {
  const unit = activeMetric === "weight" ? "kg" : "cm";

  const chartData = [
    {
      date: new Date("2024-01-01"),
      month: "Birth",
      "Child Growth": activeMetric === "weight" ? 3.3 : activeMetric === "height" ? 50 : 11.2,
      "WHO Standard": activeMetric === "weight" ? 3.2 : activeMetric === "height" ? 49.5 : 11.0,
    },
    {
      date: new Date("2024-07-01"),
      month: "6 M",
      "Child Growth": activeMetric === "weight" ? 7.8 : activeMetric === "height" ? 67 : 13.8,
      "WHO Standard": activeMetric === "weight" ? 7.9 : activeMetric === "height" ? 65.5 : 13.2,
    },
    {
      date: new Date("2025-01-01"),
      month: "12 M",
      "Child Growth": activeMetric === "weight" ? 10.1 : activeMetric === "height" ? 76 : 14.6,
      "WHO Standard": activeMetric === "weight" ? 9.6 : activeMetric === "height" ? 74.0 : 14.0,
    },
    {
      date: new Date("2025-07-01"),
      month: "18 M",
      "Child Growth": activeMetric === "weight" ? 11.5 : activeMetric === "height" ? 82.5 : 15.0,
      "WHO Standard": activeMetric === "weight" ? 11.0 : activeMetric === "height" ? 80.5 : 14.5,
    },
    {
      date: new Date("2026-01-01"),
      month: "24 M",
      "Child Growth": activeMetric === "weight" ? 12.4 : activeMetric === "height" ? 88.5 : 15.2,
      "WHO Standard": activeMetric === "weight" ? 12.2 : activeMetric === "height" ? 86.5 : 14.8,
    },
  ];

  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(23, 49, 36, 0.08)";
  const childLineColor = isDarkMode ? "#3fff80" : "#173124";
  const standardLineColor = isDarkMode ? "#a8b8ac" : "#6e8c75";
  const crosshairColor = isDarkMode ? "#3fff80" : "#173124";
  const tooltipBg = isDarkMode ? "#14231b" : "#ffffff";
  const tooltipBorder = isDarkMode ? "#22392b" : "#e3e2df";
  const tooltipText = isDarkMode ? "#ffffff" : "#173124";

  return (
    <div className={`w-full h-64 p-4 rounded-3xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] border ${
      isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white/80 border-[#e3e2df]"
    }`}>
      <LineChart
        key={activeMetric}
        data={chartData}
        aspectRatio={undefined}
        className="w-full h-full"
        margin={{ top: 20, right: 24, bottom: 28, left: 24 }}
      >
        <Grid horizontal fadeHorizontal={false} stroke={gridColor} />
        <Line
          dataKey="WHO Standard"
          stroke={standardLineColor}
          strokeWidth={2}
          dashFromIndex={0}
          dashArray="4,4"
          fadeEdges={false}
        />
        <Line
          dataKey="Child Growth"
          stroke={childLineColor}
          strokeWidth={3}
          showMarkers
          fadeEdges={false}
          markers={{
            fill: childLineColor,
            stroke: isDarkMode ? "#14231b" : "#ffffff",
            strokeWidth: 2,
          }}
        />
        <XAxis />
        <ChartTooltip
          indicatorColor={crosshairColor}
          backgroundColor={tooltipBg}
          panelStyle={{
            borderColor: tooltipBorder,
            borderWidth: "1px",
            borderRadius: "16px",
            color: tooltipText,
            boxShadow: isDarkMode
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
              : "0 10px 25px -5px rgba(23, 49, 36, 0.12)",
          }}
          rows={(point) => [
            {
              color: standardLineColor,
              label: "WHO Standard",
              value: `${point["WHO Standard"]} ${unit}`,
            },
            {
              color: childLineColor,
              label: "Child Growth",
              value: `${point["Child Growth"]} ${unit}`,
            },
          ]}
        />
      </LineChart>
    </div>
  );
};
