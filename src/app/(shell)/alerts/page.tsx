"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { alerts, driverById, vehicleById } from "@/lib/mock/data";
import type { Severity, AlertStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEVERITY_TONE = { critical: "red", warning: "amber", info: "blue" } as const;

const TYPE_ICON: Record<string, string> = {
  sos: "sos",
  overspeed: "speed",
  geofence: "fence",
  "harsh-braking": "warning",
  idle: "hourglass_empty",
  "document-expiry": "description",
  "maintenance-due": "build",
};

const SEVERITIES: Severity[] = ["critical", "warning", "info"];
const STATUSES: AlertStatus[] = ["new", "acknowledged", "resolved"];

export default function AlertsPage() {
  const [sev, setSev] = useState<Severity | "all">("all");
  const [status, setStatus] = useState<AlertStatus | "all">("all");

  const sorted = useMemo(() => {
    const sevRank = { critical: 0, warning: 1, info: 2 };
    return [...alerts].sort((a, b) => {
      if (a.severity !== b.severity) return sevRank[a.severity] - sevRank[b.severity];
      return +new Date(b.timestamp) - +new Date(a.timestamp);
    });
  }, []);

  const filtered = sorted.filter(
    (a) => (sev === "all" || a.severity === sev) && (status === "all" || a.status === status)
  );

  const counts = {
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    info: alerts.filter((a) => a.severity === "info").length,
  };

  return (
    <>
      <PageHeader title="Alerts Center" subtitle="Fleet-wide alerts, triage and resolution." />

      <div className="grid grid-cols-3 gap-4 mb-8">
        {SEVERITIES.map((s) => (
          <button
            key={s}
            onClick={() => setSev(sev === s ? "all" : s)}
            className={cn(
              "card p-5 flex items-center gap-4 text-left transition-all",
              sev === s ? "ring-2 ring-primary-container" : "hover:bg-slate-800/60"
            )}
          >
            <StatusPill tone={SEVERITY_TONE[s]}>{s}</StatusPill>
            <span className="text-3xl font-bold text-white ml-auto tabular-nums">{counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Filter rail */}
        <aside className="col-span-12 lg:col-span-3 card p-5 h-fit">
          <h4 className="text-label-sm text-slate-400 uppercase tracking-wider mb-3">Status</h4>
          <div className="space-y-1 mb-6">
            <FilterRow label="All statuses" active={status === "all"} onClick={() => setStatus("all")} />
            {STATUSES.map((s) => (
              <FilterRow
                key={s}
                label={s}
                active={status === s}
                onClick={() => setStatus(s)}
                count={alerts.filter((a) => a.status === s).length}
              />
            ))}
          </div>
          <h4 className="text-label-sm text-slate-400 uppercase tracking-wider mb-3">Severity</h4>
          <div className="space-y-1">
            <FilterRow label="All severities" active={sev === "all"} onClick={() => setSev("all")} />
            {SEVERITIES.map((s) => (
              <FilterRow key={s} label={s} active={sev === s} onClick={() => setSev(s)} count={counts[s]} />
            ))}
          </div>
        </aside>

        {/* Alert list */}
        <div className="col-span-12 lg:col-span-9 space-y-3">
          {filtered.map((a) => {
            const v = vehicleById(a.vehicleId);
            const d = driverById(a.driverId);
            return (
              <div
                key={a.id}
                className={cn(
                  "card p-4 flex items-center gap-4 transition-colors hover:bg-slate-800/40",
                  a.severity === "critical" && a.status === "new" && "ring-1 ring-status-stopped/40"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    a.severity === "critical"
                      ? "bg-status-stopped/15 text-status-stopped"
                      : a.severity === "warning"
                      ? "bg-status-idle/15 text-status-idle"
                      : "bg-primary-container/15 text-primary-fixed-dim"
                  )}
                >
                  <Icon name={TYPE_ICON[a.type] ?? "notifications"} fill />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusPill tone={SEVERITY_TONE[a.severity]} dot={false}>
                      {a.severity}
                    </StatusPill>
                    <p className="text-body-md text-white font-medium truncate">{a.description}</p>
                  </div>
                  <p className="text-label-sm text-slate-500 mt-1">
                    {v?.name} · {v?.plate}
                    {d ? ` · ${d.name}` : ""} ·{" "}
                    {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {a.status === "resolved" ? (
                    <StatusPill tone="green">resolved</StatusPill>
                  ) : (
                    <>
                      {a.status === "acknowledged" && <StatusPill tone="amber">ack</StatusPill>}
                      <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-label-sm font-semibold">
                        Acknowledge
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-primary-container hover:bg-blue-600 text-white text-label-sm font-semibold">
                        Resolve
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="card p-16 text-center text-slate-500">No alerts match these filters.</div>
          )}
        </div>
      </div>
    </>
  );
}

function FilterRow({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-body-md capitalize transition-colors",
        active ? "bg-primary-container/15 text-primary-fixed-dim font-semibold" : "text-slate-400 hover:bg-slate-800"
      )}
    >
      <span>{label}</span>
      {count !== undefined && <span className="text-label-sm tabular-nums">{count}</span>}
    </button>
  );
}
