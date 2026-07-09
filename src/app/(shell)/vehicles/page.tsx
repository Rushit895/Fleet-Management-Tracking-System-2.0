import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { complianceDocs, driverById, vehicles } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const STATUS_TONE = {
  moving: "moving",
  idle: "idle",
  stopped: "stopped",
  offline: "offline",
} as const;

const TYPE_ICON = {
  truck: "local_shipping",
  van: "airport_shuttle",
  car: "directions_car",
  bus: "directions_bus",
} as const;

function complianceDot(vehicleId: string) {
  const docs = complianceDocs.filter((d) => d.vehicleId === vehicleId);
  if (docs.some((d) => d.status === "expired")) return "bg-status-stopped";
  if (docs.some((d) => d.status === "expiring")) return "bg-status-idle";
  return "bg-status-moving";
}

export default function VehiclesPage() {
  const counts = {
    moving: vehicles.filter((v) => v.status === "moving").length,
    idle: vehicles.filter((v) => v.status === "idle").length,
    stopped: vehicles.filter((v) => v.status === "stopped").length,
    offline: vehicles.filter((v) => v.status === "offline").length,
  };

  return (
    <>
      <PageHeader
        title="Vehicles"
        subtitle="Your complete fleet registry and asset status."
        action={
          <button className="flex items-center gap-2 bg-primary-container hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-container/20">
            <Icon name="add" /> Add Vehicle
          </button>
        }
      />

      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {(["moving", "idle", "stopped", "offline"] as const).map((s) => (
          <div key={s} className="card px-4 py-3 flex items-center gap-3">
            <StatusPill tone={STATUS_TONE[s]}>{s}</StatusPill>
            <span className="text-headline-md text-white font-bold tabular-nums">
              {counts[s]}
            </span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Icon name="search" className="text-slate-400 mr-2" />
          <input
            className="bg-transparent outline-none text-body-md w-full text-slate-200 placeholder:text-slate-500"
            placeholder="Search by name, plate, or driver…"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-body-md hover:bg-slate-700">
          <Icon name="filter_list" className="text-[18px]" /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-800/40 border-b border-slate-800">
                <th className="table-head">Vehicle</th>
                <th className="table-head">Type</th>
                <th className="table-head">Status</th>
                <th className="table-head">Driver</th>
                <th className="table-head">Depot</th>
                <th className="table-head text-right">Odometer</th>
                <th className="table-head text-center">Docs</th>
                <th className="table-head">Last Seen</th>
                <th className="table-head" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vehicles.map((v) => {
                const d = driverById(v.driverId);
                return (
                  <tr key={v.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-3">
                      <Link href={`/vehicles/${v.id}`} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary-fixed-dim">
                          <Icon name={TYPE_ICON[v.type]} className="text-[20px]" />
                        </div>
                        <div>
                          <p className="text-body-md font-semibold text-white group-hover:text-primary-fixed-dim">
                            {v.name}
                          </p>
                          <p className="text-label-sm text-slate-500 font-medium">{v.plate}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-body-md text-slate-300 capitalize">{v.type}</td>
                    <td className="px-6 py-3">
                      <StatusPill tone={STATUS_TONE[v.status]}>{v.status}</StatusPill>
                    </td>
                    <td className="px-6 py-3 text-body-md text-slate-300">{d?.name ?? "—"}</td>
                    <td className="px-6 py-3 text-body-md text-slate-400">{v.depot}</td>
                    <td className="px-6 py-3 text-body-md text-slate-300 text-right tabular-nums">
                      {v.odometer.toLocaleString()} km
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center">
                        <span
                          className={cn("w-2.5 h-2.5 rounded-full", complianceDot(v.id))}
                          title="Document compliance"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3 text-label-sm text-slate-500">
                      {formatDistanceToNow(new Date(v.lastSeen), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-3">
                      <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition">
                        <Icon name="more_vert" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 text-label-sm text-slate-500">
          <span>Showing {vehicles.length} of {vehicles.length} vehicles</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700">
              <Icon name="chevron_left" className="text-[18px]" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700">
              <Icon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
