"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Report = {
  key: string;
  title: string;
  desc: string;
  icon: string;
  spark: number[];
};

const REPORTS: Report[] = [
  { key: "utilization", title: "Fleet Utilization", desc: "Active vs idle time across the fleet", icon: "donut_large", spark: [40, 55, 48, 62, 70, 66, 74] },
  { key: "cost", title: "Cost Analysis", desc: "Total operating cost by category", icon: "payments", spark: [30, 42, 38, 50, 47, 60, 68] },
  { key: "driver", title: "Driver Performance", desc: "Safety, on-time and efficiency scores", icon: "workspace_premium", spark: [60, 58, 65, 63, 70, 72, 78] },
  { key: "fuel", title: "Fuel Efficiency", desc: "Mileage and consumption trends", icon: "local_gas_station", spark: [70, 66, 68, 60, 63, 58, 55] },
  { key: "trip", title: "Trip Summary", desc: "Completed trips, distance and ETAs", icon: "route", spark: [20, 35, 45, 40, 55, 62, 60] },
  { key: "maintenance", title: "Maintenance Log", desc: "Work orders, downtime and parts cost", icon: "build", spark: [45, 40, 50, 48, 44, 52, 49] },
];

function Sparkline({ data, active }: { data: number[]; active: boolean }) {
  const w = 220;
  const h = 56;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14" preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={active ? "#93b4ff" : "#2563eb"}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ReportsPage() {
  const [selected, setSelected] = useState<Report | null>(null);

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Generate, preview and export operational reports."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {REPORTS.map((r) => {
          const active = selected?.key === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setSelected(active ? null : r)}
              className={cn(
                "card p-6 text-left transition-all group",
                active ? "ring-2 ring-primary-container" : "hover:bg-slate-800/50"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary-container/15 text-primary-fixed-dim flex items-center justify-center">
                  <Icon name={r.icon} />
                </div>
                <Icon
                  name="chevron_right"
                  className="text-slate-600 group-hover:text-slate-300 transition-colors"
                />
              </div>
              <h3 className="text-headline-md text-white">{r.title}</h3>
              <p className="text-body-md text-slate-400 mt-1 mb-4">{r.desc}</p>
              <Sparkline data={r.spark} active={active} />
            </button>
          );
        })}
      </div>

      {/* Config / preview panel */}
      {selected && (
        <div className="card mt-8 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-headline-lg text-white">{selected.title}</h3>
              <p className="text-body-md text-slate-400">{selected.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-body-md">
                <Icon name="picture_as_pdf" className="text-[18px]" /> PDF
              </button>
              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-body-md">
                <Icon name="csv" className="text-[18px]" /> CSV
              </button>
              <button className="flex items-center gap-2 bg-primary-container hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-primary-container/20">
                <Icon name="play_arrow" /> Generate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Config */}
            <div className="space-y-4">
              <Field label="Date range">
                <select className="report-input">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This quarter</option>
                  <option>Year to date</option>
                </select>
              </Field>
              <Field label="Depot">
                <select className="report-input">
                  <option>All depots</option>
                  <option>Chicago Hub</option>
                  <option>Detroit DC</option>
                  <option>Dallas North</option>
                </select>
              </Field>
              <Field label="Vehicle type">
                <select className="report-input">
                  <option>All types</option>
                  <option>Truck</option>
                  <option>Van</option>
                  <option>Car</option>
                </select>
              </Field>
            </div>

            {/* Preview */}
            <div className="lg:col-span-3 rounded-xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[260px]">
              <Sparkline data={selected.spark} active />
              <p className="text-body-md text-slate-500 mt-4">
                Preview of <span className="text-slate-300">{selected.title}</span> — press
                Generate to build the full report with charts and data tables.
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .report-input {
          width: 100%;
          background: #1e293b;
          border: 1px solid #334155;
          color: #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          outline: none;
        }
        .report-input:focus {
          border-color: #2563eb;
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-label-sm text-slate-400 uppercase tracking-wider block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
