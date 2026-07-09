"use client";

import { useEffect, useRef, useState } from "react";
import { vehicles as seed } from "@/lib/mock/data";
import type { Vehicle } from "@/lib/types";

/**
 * Client-side GPS simulator.
 *
 * Emits a fresh fleet snapshot on every tick, nudging each "moving" vehicle
 * along a slowly-drifting heading and jittering its speed. This is the same
 * shape of data a real tracker feed would produce — when Supabase Realtime is
 * wired up, this hook is swapped for a realtime subscription and nothing else
 * in the UI changes.
 */
export function useLiveFleet(intervalMs = 2000): Vehicle[] {
  const [fleet, setFleet] = useState<Vehicle[]>(() => seed.map((v) => ({ ...v, location: { ...v.location } })));
  const headings = useRef<Record<string, number>>(
    Object.fromEntries(seed.map((v) => [v.id, Math.random() * Math.PI * 2]))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setFleet((prev) =>
        prev.map((v) => {
          // Occasionally flip idle <-> moving so the board feels alive.
          if (v.status === "idle" && Math.random() < 0.08) {
            return { ...v, status: "moving", speed: 25 + Math.round(Math.random() * 20) };
          }
          if (v.status === "moving" && Math.random() < 0.04) {
            return { ...v, status: "idle", speed: 0, lastSeen: new Date().toISOString() };
          }
          if (v.status !== "moving") return v;

          // Drift heading a little, advance position by speed.
          let h = headings.current[v.id];
          if (Math.random() < 0.25) h += (Math.random() - 0.5) * 0.7;
          headings.current[v.id] = h;

          const speed = Math.max(15, Math.min(110, v.speed + (Math.random() - 0.5) * 14));
          // km travelled this tick -> degrees (~111km per degree).
          // DEMO_SPEEDUP exaggerates motion so markers are visibly moving on a
          // city-scale map (real GPS motion would be sub-pixel per tick).
          const DEMO_SPEEDUP = 40;
          const deg = (((speed / 3600) * (intervalMs / 1000)) / 111) * DEMO_SPEEDUP;
          const lat = v.location.lat + Math.cos(h) * deg;
          const lng = v.location.lng + Math.sin(h) * deg;

          return {
            ...v,
            location: { lat, lng },
            speed: Math.round(speed),
            lastSeen: new Date().toISOString(),
          };
        })
      );
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return fleet;
}
