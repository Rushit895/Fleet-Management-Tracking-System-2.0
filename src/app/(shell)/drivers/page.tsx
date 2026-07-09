import Link from "next/link";
import { format } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { drivers, vehicleById } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const STATUS_TONE = {
  "on-trip": "blue",
  "on-duty": "green",
  "off-duty": "slate",
} as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-status-idle">
      <Icon name="star" fill className="text-[16px]" />
      <span className="text-body-md text-slate-200 tabular-nums">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function DriversPage() {
  const summary = {
    total: drivers.length,
    onDuty: drivers.filter((d) => d.status === "on-duty").length,
    onTrip: drivers.filter((d) => d.status === "on-trip").length,
    available: drivers.filter((d) => d.status !== "on-trip").length,
  };

  return (
    <>
      <PageHeader
        title="Drivers"
        subtitle="Manage your driver roster, licenses and performance."
        action={
          <button className="flex items-center gap-2 bg-primary-container hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-container/20">
            <Icon name="add" /> Add Driver
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Drivers", value: summary.total, icon: "groups", tone: "text-primary-fixed-dim" },
          { label: "On Duty", value: summary.onDuty, icon: "badge", tone: "text-status-moving" },
          { label: "On Trip", value: summary.onTrip, icon: "route", tone: "text-primary-fixed-dim" },
          { label: "Available", value: summary.available, icon: "check_circle", tone: "text-status-moving" },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <Icon name={s.icon} className={cn("text-[28px]", s.tone)} />
            <div>
              <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
              <p className="text-label-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-800/40 border-b border-slate-800">
                <th className="table-head">Driver</th>
                <th className="table-head">License</th>
                <th className="table-head">Phone</th>
                <th className="table-head">Vehicle</th>
                <th className="table-head">Status</th>
                <th className="table-head text-right">Duty (h)</th>
                <th className="table-head">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {drivers.map((d) => {
                const v = vehicleById(d.vehicleId);
                const expSoon = new Date(d.licenseExpiry) < new Date(Date.now() + 30 * 86400000);
                const expired = new Date(d.licenseExpiry) < new Date();
                return (
                  <tr key={d.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-3">
                      <Link href={`/drivers/${d.id}`} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-label-sm">
                          {d.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-body-md font-semibold text-white group-hover:text-primary-fixed-dim">
                            {d.name}
                          </p>
                          <p className="text-label-sm text-slate-500">{d.depot}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            expired ? "bg-status-stopped" : expSoon ? "bg-status-idle" : "bg-status-moving"
                          )}
                        />
                        <span className="text-body-md text-slate-300">{d.licenseClass}</span>
                      </div>
                      <p className="text-label-sm text-slate-500">
                        exp {format(new Date(d.licenseExpiry), "MMM yyyy")}
                      </p>
                    </td>
                    <td className="px-6 py-3 text-body-md text-slate-400 tabular-nums">{d.phone}</td>
                    <td className="px-6 py-3 text-body-md text-slate-300">{v?.name ?? "—"}</td>
                    <td className="px-6 py-3">
                      <StatusPill tone={STATUS_TONE[d.status]}>{d.status.replace("-", " ")}</StatusPill>
                    </td>
                    <td className="px-6 py-3 text-body-md text-slate-300 text-right tabular-nums">
                      {d.dutyHoursToday.toFixed(1)}
                    </td>
                    <td className="px-6 py-3">
                      <Stars rating={d.rating} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
