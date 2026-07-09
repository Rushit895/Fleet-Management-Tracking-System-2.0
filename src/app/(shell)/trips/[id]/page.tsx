"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { driverById, tripById, vehicleById } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const STATUS_TONE = {
  scheduled: "amber",
  "in-progress": "blue",
  completed: "green",
  cancelled: "slate",
} as const;

// A smooth curved path across the SVG viewbox (0..100).
const PATH = "M 10 82 C 30 40, 45 78, 62 40 S 82 22, 92 20";

function pointAt(pct: number) {
  // approximate the cubic path with sampled points
  const path =
    typeof document !== "undefined"
      ? Object.assign(document.createElementNS("http://www.w3.org/2000/svg", "path"), {})
      : null;
  if (!path) return { x: 10, y: 82 };
  (path as SVGPathElement).setAttribute("d", PATH);
  const len = (path as SVGPathElement).getTotalLength();
  const p = (path as SVGPathElement).getPointAtLength((pct / 100) * len);
  return { x: p.x, y: p.y };
}

const EVENTS = [
  { at: 0, label: "Departed origin", icon: "flag", tone: "green" },
  { at: 22, label: "Highway on-ramp", icon: "merge", tone: "blue" },
  { at: 41, label: "Over-speed: 112 km/h", icon: "speed", tone: "red" },
  { at: 63, label: "Rest stop — 18 min", icon: "local_cafe", tone: "amber" },
  { at: 84, label: "Geofence: city zone", icon: "fence", tone: "amber" },
  { at: 100, label: "Arrived destination", icon: "check_circle", tone: "green" },
] as const;

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const trip = tripById(params.id);
  const [pct, setPct] = useState(trip?.status === "completed" ? 100 : trip?.progress ?? 0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number>();

  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      setPct((p) => {
        if (p >= 100) {
          setPlaying(false);
          return 100;
        }
        return p + 0.4;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [playing]);

  const pos = useMemo(() => pointAt(pct), [pct]);

  if (!trip) {
    return (
      <div className="card p-16 text-center text-slate-400">
        Trip not found.{" "}
        <Link href="/trips" className="text-primary-fixed-dim hover:underline">
          Back to Trips
        </Link>
      </div>
    );
  }

  const v = vehicleById(trip.vehicleId);
  const d = driverById(trip.driverId);
  const passedEvents = EVENTS.filter((e) => e.at <= pct);

  return (
    <>
      <Link href="/trips" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-body-md mb-4">
        <Icon name="arrow_back" className="text-[18px]" /> Back to Trips
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-headline-lg text-white">#{trip.id}</h2>
            <StatusPill tone={STATUS_TONE[trip.status]}>{trip.status.replace("-", " ")}</StatusPill>
          </div>
          <p className="text-body-md text-slate-400">
            {trip.origin} → {trip.destination} · {trip.cargo}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Map + playback */}
        <div className="col-span-12 lg:col-span-8 card overflow-hidden">
          <div className="relative h-[420px] bg-slate-950">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d={PATH} stroke="#334155" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path
                d={PATH}
                stroke="#2563eb"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={100 - pct}
              />
              <circle cx="10" cy="82" r="1.8" fill="#16a34a" />
              <circle cx="92" cy="20" r="1.8" fill="#dc2626" />
              <circle cx={pos.x} cy={pos.y} r="2.4" fill="#93b4ff" stroke="#fff" strokeWidth="0.6" />
            </svg>
          </div>

          {/* Playback controls */}
          <div className="p-5 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (pct >= 100) setPct(0);
                  setPlaying((p) => !p);
                }}
                className="w-11 h-11 rounded-full bg-primary-container hover:bg-blue-600 text-white flex items-center justify-center shrink-0"
              >
                <Icon name={playing ? "pause" : "play_arrow"} fill />
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={pct}
                onChange={(e) => {
                  setPlaying(false);
                  setPct(Number(e.target.value));
                }}
                className="flex-1 accent-primary-container"
              />
              <span className="text-body-md text-slate-300 tabular-nums w-12 text-right">
                {Math.round(pct)}%
              </span>
            </div>
          </div>
        </div>

        {/* Summary + events */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="card p-6">
            <h3 className="text-headline-md text-white mb-4">Trip Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Distance", value: `${trip.distanceKm} km` },
                { label: "Avg speed", value: "68 km/h" },
                { label: "Max speed", value: "112 km/h" },
                { label: "Idle time", value: "24 min" },
                { label: "Fuel used", value: "38.5 L" },
                { label: "Est. cost", value: `$${(trip.distanceKm * (v?.costPerKm ?? 1)).toFixed(0)}` },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-label-sm text-slate-500">{s.label}</p>
                  <p className="text-body-lg font-bold text-white tabular-nums">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-body-md">
              <span className="text-slate-400">{v?.name}</span>
              <span className="text-slate-300">{d?.name}</span>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-headline-md text-white mb-4">Event Log</h3>
            <div className="space-y-3">
              {EVENTS.map((e) => {
                const passed = passedEvents.includes(e);
                return (
                  <div
                    key={e.label}
                    className={cn(
                      "flex items-center gap-3 transition-opacity",
                      passed ? "opacity-100" : "opacity-35"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        e.tone === "red"
                          ? "bg-status-stopped/15 text-status-stopped"
                          : e.tone === "amber"
                          ? "bg-status-idle/15 text-status-idle"
                          : e.tone === "green"
                          ? "bg-status-moving/15 text-status-moving"
                          : "bg-primary-container/15 text-primary-fixed-dim"
                      )}
                    >
                      <Icon name={e.icon} className="text-[18px]" />
                    </div>
                    <span className="text-body-md text-slate-200">{e.label}</span>
                    <span className="text-label-sm text-slate-500 ml-auto tabular-nums">{e.at}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
