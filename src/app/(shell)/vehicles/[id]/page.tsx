import Link from "next/link";
import { notFound } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import {
  complianceDocs,
  driverById,
  fuelLogs,
  trips,
  vehicleById,
  workOrders,
} from "@/lib/mock/data";
import { money } from "@/lib/utils";

const STATUS_TONE = {
  moving: "moving",
  idle: "idle",
  stopped: "stopped",
  offline: "offline",
} as const;

const DOC_TONE = { valid: "green", expiring: "amber", expired: "red" } as const;
const WO_TONE = { open: "amber", "in-progress": "blue", done: "green" } as const;

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const v = vehicleById(params.id);
  if (!v) notFound();
  const driver = driverById(v.driverId);
  const docs = complianceDocs.filter((d) => d.vehicleId === v.id);
  const wos = workOrders.filter((w) => w.vehicleId === v.id);
  const fuels = fuelLogs.filter((f) => f.vehicleId === v.id).slice(0, 5);
  const vTrips = trips.filter((t) => t.vehicleId === v.id).slice(0, 5);

  return (
    <>
      <Link href="/vehicles" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-body-md mb-4">
        <Icon name="arrow_back" className="text-[18px]" /> Back to Vehicles
      </Link>

      {/* Header */}
      <div className="card p-6 mb-8 flex flex-wrap items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-primary-fixed-dim">
          <Icon name="local_shipping" className="text-[32px]" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-3">
            <h2 className="text-headline-lg text-white">{v.name}</h2>
            <StatusPill tone={STATUS_TONE[v.status]}>{v.status}</StatusPill>
          </div>
          <p className="text-body-md text-slate-400">
            {v.plate} · {v.year} {v.make} {v.model} · {v.depot}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-body-md">
            <Icon name="person" className="text-[18px]" /> Assign
          </button>
          <button className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-body-md">
            <Icon name="build" className="text-[18px]" /> Service
          </button>
          <Link href="/tracking" className="flex items-center gap-1.5 bg-primary-container hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-body-md font-semibold">
            <Icon name="my_location" className="text-[18px]" /> Track
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Overview stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Odometer", value: `${(v.odometer / 1000).toFixed(0)}k km`, icon: "speed" },
              { label: "Fuel level", value: `${v.fuelLevel}%`, icon: "local_gas_station" },
              { label: "Cost / km", value: `$${v.costPerKm.toFixed(2)}`, icon: "payments" },
              { label: "Current speed", value: `${v.speed} km/h`, icon: "bolt" },
            ].map((s) => (
              <div key={s.label} className="card p-4">
                <Icon name={s.icon} className="text-slate-500 text-[20px]" />
                <p className="text-xl font-bold text-white mt-2 leading-none">{s.value}</p>
                <p className="text-label-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Documents */}
          <Section title="Documents">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
                  <div>
                    <p className="text-body-md text-white capitalize">{d.type}</p>
                    <p className="text-label-sm text-slate-500">
                      exp {format(new Date(d.expiryDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <StatusPill tone={DOC_TONE[d.status]}>{d.status}</StatusPill>
                </div>
              ))}
            </div>
          </Section>

          {/* Maintenance history */}
          <Section title="Maintenance History">
            {wos.length ? (
              <div className="space-y-2">
                {wos.map((w) => (
                  <div key={w.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40">
                    <Icon name="build" className="text-slate-500 text-[18px]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md text-white truncate">{w.description}</p>
                      <p className="text-label-sm text-slate-500">
                        {format(new Date(w.scheduledDate), "MMM d, yyyy")} · {money(w.cost)}
                      </p>
                    </div>
                    <StatusPill tone={WO_TONE[w.status]}>{w.status.replace("-", " ")}</StatusPill>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-body-md">No maintenance records.</p>
            )}
          </Section>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <Section title="Current Driver">
            {driver ? (
              <Link href={`/drivers/${driver.id}`} className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                  {driver.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-body-md font-semibold text-white group-hover:text-primary-fixed-dim">
                    {driver.name}
                  </p>
                  <p className="text-label-sm text-slate-500">{driver.phone}</p>
                </div>
              </Link>
            ) : (
              <p className="text-slate-500 text-body-md">Unassigned</p>
            )}
          </Section>

          <Section title="Location">
            <p className="text-body-md text-slate-300">{v.address}</p>
            <p className="text-label-sm text-slate-500 mt-1">
              Updated {formatDistanceToNow(new Date(v.lastSeen), { addSuffix: true })}
            </p>
          </Section>

          <Section title="Recent Trips">
            <div className="space-y-2">
              {vTrips.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-body-md">
                  <span className="text-slate-300 truncate">
                    {t.origin} → {t.destination}
                  </span>
                  <span className="text-slate-500 tabular-nums shrink-0 ml-2">{t.distanceKm}km</span>
                </div>
              ))}
              {vTrips.length === 0 && <p className="text-slate-500 text-body-md">No trips.</p>}
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="text-headline-md text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
