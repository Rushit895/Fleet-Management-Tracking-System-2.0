"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", utilization: 72 },
  { day: "Tue", utilization: 78 },
  { day: "Wed", utilization: 74 },
  { day: "Thu", utilization: 83 },
  { day: "Fri", utilization: 88 },
  { day: "Sat", utilization: 69 },
  { day: "Sun", utilization: 64 },
];

export function UtilizationChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="util" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[40, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 12,
            color: "#f1f5f9",
          }}
          formatter={(v) => [`${v}%`, "Utilization"]}
        />
        <Area
          type="monotone"
          dataKey="utilization"
          stroke="#2563eb"
          strokeWidth={2.5}
          fill="url(#util)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
