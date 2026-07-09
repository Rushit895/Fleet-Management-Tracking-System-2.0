import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { driverById, trips, vehicleById } from "@/lib/mock/data";

const STATUS_TONE = {
  "on-trip": "blue",
  "on-duty": "green",
  "off-duty": "slate",
} as const;

export default function DriverDetailPage({ params }: { params: { id: string } }) {
  const d = driverById(params.id);
  if (!d) notFound();
  const v = vehicleById(d.vehicleId);
  const dTrips = trips.filter((t) => t.driverId === d.id).slice(0, 6);
  const licenseExpired = new Date(d.licenseExpiry) < new Date();
  const licenseSoon = new Date(d.licenseExpiry) < new Date(Date.now() + 30 * 86400000);

  return (
    <>
      <Link href="/drivers" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-body-md mb-4">
        <Icon name="arrow_back" className="text-[18px]" /> Back to Drivers
      </Link>

      <div className="card p-6 mb-8 flex flex-wrap items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 text-headline-md font-bold">
          {d.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-3">
            <h2 className="text-headline-lg text-white">{d.name}</h2>
            <StatusPill tone={STATUS_TONE[d.status]}>{d.status.replace("-", " ")}</StatusPill>
          </div>
          <p className="text-body-md text-slate-400">
            {d.depot} · {d.phone}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-status-idle">
          <Icon name="star" fill /> <span className="text-headline-md text-white font-bold">{d.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Performance stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Safety score", value: `${d.safetyScore}`, icon: "health_and_safety" },
              { label: "On-time", value: `${d.onTimePct}%`, icon: "schedule" },
              { label: "Over-speeding", value: `${d.overspeedEvents}`, icon: "speed" },
              { label: "Harsh braking", value: `${d.harshBrakingEvents}`, icon: "warning" },
            ].map((s) => (
              <div key={s.label} className="card p-4">
                <Icon name={s.icon} className="text-slate-500 text-[20px]" />
                <p className="text-xl font-bold text-white mt-2 leading-none">{s.value}</p>
                <p className="text-label-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Duty hours */}
          <div className="card p-6">
            <h3 className="text-headline-md text-white mb-4">Duty Hours (this week)</h3>
            <div className="flex items-end gap-3 h-32">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const h = [8, 9.5, 7, 10, 8.5, d.dutyHoursToday, 0][i];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-md bg-primary-container/70"
                        style={{ height: `${(h / 11) * 100}%` }}
                        title={`${h}h`}
                      />
                    </div>
                    <span className="text-label-sm text-slate-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trip history */}
          <div className="card p-6">
            <h3 className="text-headline-md text-white mb-4">Recent Trips</h3>
            <div className="space-y-2">
              {dTrips.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
                  <span className="text-body-md text-slate-200 truncate">
                    {t.origin} → {t.destination}
                  </span>
                  <span className="text-label-sm text-slate-500 tabular-nums shrink-0 ml-2">
                    {t.distanceKm} km
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="card p-6">
            <h3 className="text-headline-md text-white mb-4">License</h3>
            <dl className="space-y-2.5 text-body-md">
              <div className="flex justify-between">
                <dt className="text-slate-500">Number</dt>
                <dd className="text-slate-200 tabular-nums">{d.licenseNo}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Class</dt>
                <dd className="text-slate-200">{d.licenseClass}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-slate-500">Expiry</dt>
                <dd>
                  <StatusPill tone={licenseExpired ? "red" : licenseSoon ? "amber" : "green"}>
                    {format(new Date(d.licenseExpiry), "MMM yyyy")}
                  </StatusPill>
                </dd>
              </div>
            </dl>
          </div>

          <div className="card p-6">
            <h3 className="text-headline-md text-white mb-4">Assigned Vehicle</h3>
            {v ? (
              <Link href={`/vehicles/${v.id}`} className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center text-primary-fixed-dim">
                  <Icon name="local_shipping" />
                </div>
                <div>
                  <p className="text-body-md font-semibold text-white group-hover:text-primary-fixed-dim">
                    {v.name}
                  </p>
                  <p className="text-label-sm text-slate-500">{v.plate}</p>
                </div>
              </Link>
            ) : (
              <p className="text-slate-500 text-body-md">No vehicle assigned</p>
            )}
          </div>

          <div className="card p-6">
            <h3 className="text-headline-md text-white mb-4">This Month</h3>
            <div className="flex justify-between text-body-md mb-2">
              <span className="text-slate-500">Trips</span>
              <span className="text-white font-bold tabular-nums">{d.tripsThisMonth}</span>
            </div>
            <div className="flex justify-between text-body-md">
              <span className="text-slate-500">Distance</span>
              <span className="text-white font-bold tabular-nums">
                {d.distanceThisMonth.toLocaleString()} km
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
