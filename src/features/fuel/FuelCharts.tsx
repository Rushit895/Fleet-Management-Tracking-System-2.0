"use client";

import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 12,
  color: "#f1f5f9",
} as const;

export function FuelCostLine({ data }: { data: { date: string; cost: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}`, "Fuel cost"]} />
        <Line type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CostPerKmBar({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-25} textAnchor="end" height={50} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1e293b55" }} formatter={(v) => [`$${v}/km`, "Cost"]} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={i < 3 ? "#dc2626" : i >= data.length - 3 ? "#16a34a" : "#2563eb"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CostBreakdownDonut({
  fuel,
  maintenance,
  other,
}: {
  fuel: number;
  maintenance: number;
  other: number;
}) {
  const data = [
    { name: "Fuel", value: fuel, color: "#2563eb" },
    { name: "Maintenance", value: maintenance, color: "#f59e0b" },
    { name: "Other", value: other, color: "#64748b" },
  ];
  return (
    <div className="flex items-center gap-6">
      <div className="w-[132px] h-[132px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={44} outerRadius={64} paddingAngle={3} stroke="none">
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-body-md text-slate-300">{d.name}</span>
            <span className="text-body-md font-bold text-white ml-auto tabular-nums">
              ${(d.value / 1000).toFixed(1)}k
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
