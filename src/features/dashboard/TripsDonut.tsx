"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export function TripsDonut({
  completed,
  inProgress,
  scheduled,
}: {
  completed: number;
  inProgress: number;
  scheduled: number;
}) {
  const data = [
    { name: "Completed", value: completed, color: "#16a34a" },
    { name: "In-Progress", value: inProgress, color: "#2563eb" },
    { name: "Scheduled", value: scheduled, color: "#f59e0b" },
  ];
  const total = completed + inProgress + scheduled;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-[132px] h-[132px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={46}
              outerRadius={64}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white leading-none">{total}</span>
          <span className="text-label-sm text-slate-500">trips</span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: d.color }}
            />
            <span className="text-body-md text-slate-300">{d.name}</span>
            <span className="text-body-md font-bold text-white ml-auto tabular-nums">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
