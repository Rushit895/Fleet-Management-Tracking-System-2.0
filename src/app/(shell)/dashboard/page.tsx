import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { UtilizationChart } from "@/features/dashboard/UtilizationChart";
import { TripsDonut } from "@/features/dashboard/TripsDonut";
import {
  alerts,
  driverById,
  fleetStats,
  trips,
  vehicleById,
  vehicles,
} from "@/lib/mock/data";

const SEVERITY_TONE = { critical: "red", warning: "amber", info: "blue" } as const;
const STATUS_TONE = {
  moving: "moving",
  idle: "idle",
  stopped: "stopped",
  offline: "offline",
} as const;

export default function DashboardPage() {
  const stats = fleetStats();
  const recentAlerts = [...alerts]
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
    .slice(0, 5);
  const attention = vehicles
    .filter((v) => v.status === "stopped" || v.fuelLevel < 20)
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of your fleet operations."
        action={
          <div className="flex items-center gap-2 text-slate-400 text-body-md">
            <span className="w-2 h-2 rounded-full bg-status-moving animate-pulse" />
            Live · updated just now
          </div>
        }
      />

      {/* KPI row */}
      <div data-tour="kpis" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Active Vehicles"
          value={`${stats.active}/${stats.total}`}
          sub="Currently reporting"
          icon="local_shipping"
          accent="green"
          trend={{ dir: "up", value: "4.2%" }}
        />
        <StatCard
          label="On-Trip Now"
          value={String(stats.onTrip)}
          sub="Trips in progress"
          icon="route"
          accent="blue"
          trend={{ dir: "up", value: "8%" }}
        />
        <StatCard
          label="Open Alerts"
          value={String(stats.openAlerts)}
          sub="Requiring attention"
          icon="warning"
          accent="red"
          trend={{ dir: "down", value: "12%" }}
        />
        <StatCard
          label="Maintenance Due"
          value={String(stats.maintenanceDue)}
          sub="Work orders pending"
          icon="build"
          accent="amber"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Mini map card */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="text-headline-md text-white">Fleet Map</h3>
              <Link
                href="/tracking"
                className="text-primary-fixed-dim text-body-md hover:underline flex items-center gap-1"
              >
                View live tracking <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>
            <div className="relative h-64 bg-slate-950 mx-6 mb-6 rounded-xl border border-slate-800 overflow-hidden">
              <MapPlaceholder />
            </div>
          </div>

          {/* Utilization chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-headline-md text-white">Fleet Utilization</h3>
              <span className="text-label-sm text-slate-500">Last 7 days</span>
            </div>
            <UtilizationChart />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Recent alerts */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-headline-md text-white">Recent Alerts</h3>
              <Link href="/alerts" className="text-primary-fixed-dim text-body-md hover:underline">
                All
              </Link>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((a) => {
                const v = vehicleById(a.vehicleId);
                return (
                  <div key={a.id} className="flex items-start gap-3">
                    <StatusPill tone={SEVERITY_TONE[a.severity]} dot>
                      {a.severity}
                    </StatusPill>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-md text-slate-200 truncate">{a.description}</p>
                      <p className="text-label-sm text-slate-500">
                        {v?.name} · {v?.plate} ·{" "}
                        {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trips today donut */}
          <div className="card p-6">
            <h3 className="text-headline-md text-white mb-4">Trips Today</h3>
            <TripsDonut
              completed={trips.filter((t) => t.status === "completed").length}
              inProgress={trips.filter((t) => t.status === "in-progress").length}
              scheduled={trips.filter((t) => t.status === "scheduled").length}
            />
          </div>
        </div>
      </div>

      {/* Vehicles needing attention */}
      <div className="card mt-8 overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="text-headline-md text-white">Vehicles Needing Attention</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/40 border-y border-slate-800">
              <th className="table-head">Vehicle</th>
              <th className="table-head">Status</th>
              <th className="table-head">Driver</th>
              <th className="table-head">Issue</th>
              <th className="table-head text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {attention.map((v) => {
              const d = driverById(v.driverId);
              const issue =
                v.fuelLevel < 20 ? `Low fuel (${v.fuelLevel}%)` : "Unexpected stop";
              return (
                <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-body-md font-semibold text-white">{v.name}</p>
                    <p className="text-label-sm text-slate-500 font-medium">{v.plate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill tone={STATUS_TONE[v.status]}>{v.status}</StatusPill>
                  </td>
                  <td className="px-6 py-4 text-body-md text-slate-300">
                    {d?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-body-md text-status-idle">{issue}</td>
                  <td className="px-6 py-4 text-right pr-6">
                    <Link
                      href={`/vehicles/${v.id}`}
                      className="text-primary-fixed-dim text-body-md hover:underline"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/** Lightweight animated map stand-in for the dashboard card. */
function MapPlaceholder() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {[
        { top: "30%", left: "25%", c: "bg-status-moving" },
        { top: "55%", left: "45%", c: "bg-status-moving" },
        { top: "40%", left: "65%", c: "bg-status-idle" },
        { top: "70%", left: "72%", c: "bg-status-stopped" },
        { top: "22%", left: "80%", c: "bg-status-moving" },
        { top: "62%", left: "18%", c: "bg-slate-500" },
      ].map((p, i) => (
        <span
          key={i}
          className={`absolute w-3 h-3 rounded-full ring-4 ring-white/5 ${p.c}`}
          style={{ top: p.top, left: p.left }}
        />
      ))}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-label-sm text-slate-500">
        <Icon name="map" className="text-[16px]" /> Chicago region
      </div>
    </div>
  );
}
