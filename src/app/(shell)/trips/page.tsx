"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { driverById, trips, vehicleById } from "@/lib/mock/data";
import type { TripStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const TABS: { key: TripStatus; label: string }[] = [
  { key: "scheduled", label: "Scheduled" },
  { key: "in-progress", label: "In-Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_TONE = {
  scheduled: "amber",
  "in-progress": "blue",
  completed: "green",
  cancelled: "slate",
} as const;

export default function TripsPage() {
  const [tab, setTab] = useState<TripStatus>("scheduled");
  const filtered = useMemo(() => trips.filter((t) => t.status === tab), [tab]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = filtered.find((t) => t.id === selectedId) ?? filtered[0];

  const counts = useMemo(
    () =>
      TABS.reduce(
        (acc, t) => ({ ...acc, [t.key]: trips.filter((x) => x.status === t.key).length }),
        {} as Record<TripStatus, number>
      ),
    []
  );

  return (
    <>
      <PageHeader
        title="Trips & Dispatch"
        subtitle="Manage real-time logistics and delivery schedules."
        action={
          <button className="flex items-center gap-2 bg-primary-container hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-container/20">
            <Icon name="add" /> New Trip
          </button>
        }
      />

      {/* Segmented tabs */}
      <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl w-fit mb-8 border border-slate-800 shadow-xl">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSelectedId(null);
              }}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all",
                active
                  ? "bg-slate-800 text-primary-fixed-dim font-bold shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <span>{t.label}</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-label-sm",
                  active ? "bg-primary-container/20 text-primary-fixed-dim" : "bg-slate-800 text-slate-400"
                )}
              >
                {counts[t.key]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Trips table */}
        <div className="col-span-12 xl:col-span-8 card flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="bg-slate-800/40 border-b border-slate-800">
                  <th className="table-head">Trip ID</th>
                  <th className="table-head">Route</th>
                  <th className="table-head">Vehicle</th>
                  <th className="table-head">Driver</th>
                  <th className="table-head">Schedule/ETA</th>
                  <th className="table-head">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((t) => {
                  const v = vehicleById(t.vehicleId);
                  const d = driverById(t.driverId);
                  const isSel = selected?.id === t.id;
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedId(t.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSel ? "bg-slate-800/50" : "hover:bg-slate-800/30"
                      )}
                    >
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-body-md font-bold",
                            t.delayedMin ? "text-status-stopped" : "text-primary-fixed-dim"
                          )}
                        >
                          #{t.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-body-md font-semibold text-white leading-tight">
                          {t.origin}
                        </div>
                        <div className="flex items-center gap-1 text-label-sm text-slate-500">
                          <Icon name="south" className="text-[14px]" /> {t.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-body-md text-slate-300">
                          <Icon name="local_shipping" className="text-[18px] text-slate-500" />
                          {v?.name ?? "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md text-slate-300">{d?.name ?? "—"}</td>
                      <td className="px-6 py-4">
                        {t.delayedMin ? (
                          <span className="text-body-md text-status-stopped font-medium">
                            Delayed +{t.delayedMin}m
                          </span>
                        ) : (
                          <span className="text-body-md text-slate-300">
                            {t.status === "scheduled" ? "Dep" : "ETA"}: {t.eta}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill tone={STATUS_TONE[t.status]}>
                          {t.status.replace("-", " ")}
                        </StatusPill>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                      No {tab.replace("-", " ")} trips.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 text-label-sm text-slate-500">
            <span>
              Showing {filtered.length} {tab.replace("-", " ")} trip
              {filtered.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Route preview */}
        <div className="col-span-12 xl:col-span-4 card p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-headline-md text-white">Route Preview</h3>
            {selected && (
              <span className="text-label-sm bg-slate-800 text-slate-300 px-2 py-1 rounded-md">
                #{selected.id}
              </span>
            )}
          </div>

          {selected ? (
            <>
              <div className="relative h-56 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden mb-4">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M15 80 Q 40 20 85 25" stroke="#2563eb" strokeWidth="1" fill="none" strokeDasharray="3 2" />
                </svg>
                <span className="absolute left-[13%] top-[78%] w-3 h-3 rounded-full bg-status-moving ring-4 ring-status-moving/20" />
                <span className="absolute left-[84%] top-[22%] w-3 h-3 rounded-full bg-status-stopped ring-4 ring-status-stopped/20" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-body-md">
                  <span className="text-slate-400">Origin</span>
                  <span className="text-white font-medium">{selected.origin}</span>
                </div>
                <div className="flex items-center justify-between text-body-md">
                  <span className="text-slate-400">Destination</span>
                  <span className="text-white font-medium">{selected.destination}</span>
                </div>
                <div className="flex items-center justify-between text-body-md">
                  <span className="text-slate-400">Distance</span>
                  <span className="text-white font-medium tabular-nums">{selected.distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-body-md">
                  <span className="text-slate-400">Cargo</span>
                  <span className="text-white font-medium">{selected.cargo}</span>
                </div>
                {selected.status === "in-progress" && (
                  <div>
                    <div className="flex items-center justify-between text-label-sm text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{selected.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-primary-container rounded-full"
                        style={{ width: `${selected.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button className="mt-5 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg font-medium transition-colors">
                <Icon name="open_in_new" className="text-[18px]" /> Full Route Analysis
              </button>
            </>
          ) : (
            <p className="text-slate-500 text-body-md py-12 text-center">
              Select a trip to preview its route.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
