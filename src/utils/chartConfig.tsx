import React from 'react';
import { formatCurrency } from "@/lib/print";

// Chart color constants
export const CHART_COLORS = {
  primary: {
    main: "#4f46e5", // indigo-600
    light: "#818cf8", // indigo-400
    lighter: "#c7d2fe", // indigo-200
  },
  secondary: {
    main: "#0891b2", // cyan-600
    light: "#22d3ee", // cyan-400
  },
  success: {
    main: "#10b981", // emerald-500
    light: "#34d399", // emerald-400
  },
  warning: {
    main: "#f59e0b", // amber-500
    light: "#fbbf24", // amber-400
  },
  danger: {
    main: "#ef4444", // red-500
    light: "#f87171", // red-400
  },
  neutral: {
    main: "#6b7280", // gray-500
    light: "#9ca3af", // gray-400
  }
};

// Status-specific colors
export const STATUS_COLORS = {
  Paid: CHART_COLORS.success.main,
  Pending: CHART_COLORS.warning.main,
  Draft: CHART_COLORS.primary.main,
  Overdue: CHART_COLORS.danger.main,
  Cancelled: CHART_COLORS.neutral.main,
};

// Pie chart color palette
export const PIE_COLORS = [
  CHART_COLORS.primary.main,
  CHART_COLORS.success.main,
  CHART_COLORS.warning.main,
  CHART_COLORS.danger.main,
  CHART_COLORS.secondary.main,
  CHART_COLORS.neutral.main,
];

// Custom tooltip styles
export const CustomTooltipStyle = {
  backgroundColor: "rgba(23, 23, 23, 0.85)",
  border: "none",
  borderRadius: "4px",
  padding: "8px 12px",
  color: "#fff",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

// Custom tooltip component
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border-0 rounded-md p-3 shadow-lg text-white">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center text-sm">
            <span
              className="inline-block w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="mr-2">{item.name}:</span>
            <span className="font-semibold">
              {item.name.toLowerCase().includes('revenue') ||
                item.name.toLowerCase().includes('amount') ||
                item.name.toLowerCase().includes('balance')
                ? formatCurrency(item.value)
                : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Chart common props
export const chartCommonProps = {
  lineChart: {
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  },
  areaChart: {
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  },
  barChart: {
    margin: { top: 20, right: 30, left: 20, bottom: 5 },
  },
  xAxis: {
    stroke: "#9CA3AF",
    tickLine: false,
    axisLine: { stroke: "#E5E7EB" },
    dy: 10,
  },
  yAxis: {
    stroke: "#9CA3AF",
    tickLine: false,
    axisLine: false,
    dx: -10,
    tickFormatter: (value: number) => formatCurrency(value).split(".")[0],
  },
  cartesianGrid: {
    strokeDasharray: "3 3",
    stroke: "#374151",
    opacity: 0.1,
  },
  legend: {
    iconType: "circle",
    iconSize: 10,
    wrapperStyle: { paddingTop: "20px" },
  },
};
