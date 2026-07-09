import { format } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Icon } from "@/components/ui/Icon";
import { fuelLogs, vehicleById, vehicles } from "@/lib/mock/data";
import { money } from "@/lib/utils";
import {
  CostBreakdownDonut,
  CostPerKmBar,
  FuelCostLine,
} from "@/features/fuel/FuelCharts";

export default function FuelPage() {
  const totalCost = fuelLogs.reduce((s, l) => s + l.cost, 0);
  const totalKm = vehicles.reduce((s, v) => s + v.odometer, 0);
  const avgCostPerKm =
    vehicles.reduce((s, v) => s + v.costPerKm, 0) / vehicles.length;
  const avgMileage = fuelLogs.reduce((s, l) => s + l.mileage, 0) / fuelLogs.length;
  const anomalies = fuelLogs.filter((l) => l.anomaly).length;

  // Cost over time (group by day, last 14 buckets)
  const byDate = new Map<string, number>();
  fuelLogs.forEach((l) => {
    const k = format(new Date(l.date), "MMM d");
    byDate.set(k, (byDate.get(k) ?? 0) + l.cost);
  });
  const lineData = Array.from(byDate.entries())
    .map(([date, cost]) => ({ date, cost: Math.round(cost), _d: new Date(date + ", 2026").getTime() }))
    .sort((a, b) => a._d - b._d)
    .slice(-14)
    .map(({ date, cost }) => ({ date, cost }));

  // Cost per km by vehicle (top & bottom performers)
  const perKm = [...vehicles]
    .sort((a, b) => b.costPerKm - a.costPerKm)
    .filter((_, i, arr) => i < 3 || i >= arr.length - 3)
    .map((v) => ({ name: v.id.replace("VEH-", "#"), value: v.costPerKm }));

  const recentLogs = [...fuelLogs]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 12);

  return (
    <>
      <PageHeader
        title="Fuel & Cost"
        subtitle="Fuel consumption, mileage and cost-per-km analytics."
        action={
          <div className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-body-md">
            <Icon name="calendar_today" className="text-[18px]" /> Last 30 days
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Fuel Cost" value={money(totalCost)} sub="This period" icon="payments" accent="blue" trend={{ dir: "up", value: "6.1%" }} />
        <StatCard label="Avg Cost / km" value={`$${avgCostPerKm.toFixed(2)}`} sub="Fleet average" icon="speed" accent="green" trend={{ dir: "down", value: "2.3%" }} />
        <StatCard label="Avg Mileage" value={`${avgMileage.toFixed(1)} km/l`} sub="Fleet efficiency" icon="eco" accent="green" />
        <StatCard label="Fuel Anomalies" value={String(anomalies)} sub="Possible theft / leaks" icon="warning" accent="red" />
      </div>

      <div className="grid grid-cols-12 gap-8 mb-8">
        <div className="col-span-12 xl:col-span-8 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-headline-md text-white">Fuel Cost Over Time</h3>
            <span className="text-label-sm text-slate-500">Daily total</span>
          </div>
          <FuelCostLine data={lineData} />
        </div>
        <div className="col-span-12 xl:col-span-4 card p-6">
          <h3 className="text-headline-md text-white mb-4">Cost Breakdown</h3>
          <CostBreakdownDonut
            fuel={totalCost}
            maintenance={Math.round(totalCost * 0.42)}
            other={Math.round(totalCost * 0.15)}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-5 card p-6">
          <h3 className="text-headline-md text-white mb-1">Cost per km by Vehicle</h3>
          <p className="text-label-sm text-slate-500 mb-4">
            <span className="text-status-stopped">■</span> highest ·{" "}
            <span className="text-status-moving">■</span> lowest
          </p>
          <CostPerKmBar data={perKm} />
        </div>

        <div className="col-span-12 xl:col-span-7 card overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-headline-md text-white">Recent Fuel Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="bg-slate-800/40 border-y border-slate-800">
                  <th className="table-head">Date</th>
                  <th className="table-head">Vehicle</th>
                  <th className="table-head text-right">Liters</th>
                  <th className="table-head text-right">Cost</th>
                  <th className="table-head text-right">Mileage</th>
                  <th className="table-head text-center">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentLogs.map((l) => {
                  const v = vehicleById(l.vehicleId);
                  return (
                    <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3 text-body-md text-slate-400">
                        {format(new Date(l.date), "MMM d")}
                      </td>
                      <td className="px-6 py-3 text-body-md text-slate-300">{v?.name ?? "—"}</td>
                      <td className="px-6 py-3 text-body-md text-slate-300 text-right tabular-nums">{l.liters}</td>
                      <td className="px-6 py-3 text-body-md text-slate-200 text-right tabular-nums">{money(l.cost)}</td>
                      <td className="px-6 py-3 text-body-md text-slate-300 text-right tabular-nums">{l.mileage} km/l</td>
                      <td className="px-6 py-3 text-center">
                        {l.anomaly ? (
                          <Icon name="flag" className="text-status-stopped text-[18px]" fill />
                        ) : (
                          <Icon name="check" className="text-slate-600 text-[18px]" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
