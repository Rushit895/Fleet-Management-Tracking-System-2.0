"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { formatDistanceToNow } from "date-fns";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { driverById } from "@/lib/mock/data";
import { useLiveFleet } from "@/lib/sim/useLiveFleet";
import type { VehicleStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const FleetMap = dynamic(
  () => import("@/features/tracking/FleetMap").then((m) => m.FleetMap),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-slate-950 animate-pulse" /> }
);

const STATUS_TONE = {
  moving: "moving",
  idle: "idle",
  stopped: "stopped",
  offline: "offline",
} as const;

const FILTERS: (VehicleStatus | "all")[] = ["all", "moving", "idle", "stopped", "offline"];

export default function TrackingPage() {
  const vehicles = useLiveFleet();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");
  const [query, setQuery] = useState("");

  const list = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (filter === "all" || v.status === filter) &&
          (query === "" ||
            v.name.toLowerCase().includes(query.toLowerCase()) ||
            v.plate.toLowerCase().includes(query.toLowerCase()))
      ),
    [vehicles, filter, query]
  );

  const selected = vehicles.find((v) => v.id === selectedId) ?? null;
  const selDriver = driverById(selected?.driverId ?? null);

  return (
    <div className="-m-8 h-[calc(100vh-64px)] flex">
      {/* Vehicle list panel */}
      <div className="w-80 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-headline-md text-white mb-3">Live Fleet</h2>
          <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2">
            <Icon name="search" className="text-slate-400 mr-2 text-[18px]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-body-md w-full text-slate-200 placeholder:text-slate-500"
              placeholder="Search vehicle or plate…"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-label-sm capitalize transition-colors",
                  filter === f
                    ? "bg-primary-container text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {list.map((v) => {
            const d = driverById(v.driverId);
            return (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-slate-800/60 transition-colors",
                  selectedId === v.id ? "bg-slate-800" : "hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-body-md font-semibold text-white">{v.name}</span>
                  <StatusPill tone={STATUS_TONE[v.status]}>{v.status}</StatusPill>
                </div>
                <div className="flex items-center justify-between text-label-sm text-slate-500">
                  <span>{v.plate} · {d?.name ?? "Unassigned"}</span>
                  <span className="tabular-nums">{v.speed} km/h</span>
                </div>
              </button>
            );
          })}
          {list.length === 0 && (
            <p className="p-6 text-center text-slate-500 text-body-md">No vehicles match.</p>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1 h-full min-w-0">
        <FleetMap vehicles={vehicles} selectedId={selectedId} onSelect={setSelectedId} />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 card px-4 py-3 flex items-center gap-4 z-10">
          {(["moving", "idle", "stopped", "offline"] as const).map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-label-sm text-slate-300 capitalize">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: { moving: "#16a34a", idle: "#f59e0b", stopped: "#dc2626", offline: "#94a3b8" }[s],
                }}
              />
              {s}
            </span>
          ))}
        </div>

        {/* Detail drawer */}
        {selected && (
          <div className="absolute top-4 right-4 w-80 card p-5 z-10 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-headline-md text-white">{selected.name}</h3>
                <p className="text-label-sm text-slate-500">{selected.plate}</p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-slate-500 hover:text-white"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-label-sm text-slate-500">Current speed</p>
                <p className="text-3xl font-bold text-white tabular-nums leading-none mt-1">
                  {selected.speed}
                  <span className="text-body-md text-slate-500 ml-1">km/h</span>
                </p>
              </div>
              <StatusPill tone={STATUS_TONE[selected.status]}>{selected.status}</StatusPill>
            </div>

            <dl className="space-y-2.5 text-body-md">
              <Row label="Driver" value={selDriver?.name ?? "Unassigned"} />
              <Row label="Location" value={selected.address} />
              <Row label="Depot" value={selected.depot} />
              <Row label="Fuel" value={`${selected.fuelLevel}%`} />
              <Row
                label="Last update"
                value={formatDistanceToNow(new Date(selected.lastSeen), { addSuffix: true })}
              />
            </dl>

            <div className="flex gap-2 mt-5">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-primary-container hover:bg-blue-600 text-white py-2 rounded-lg text-body-md font-semibold">
                <Icon name="my_location" className="text-[18px]" /> Center
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg text-body-md font-semibold">
                <Icon name="call" className="text-[18px]" /> Driver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-slate-500 shrink-0">{label}</dt>
      <dd className="text-slate-200 text-right">{value}</dd>
    </div>
  );
}
