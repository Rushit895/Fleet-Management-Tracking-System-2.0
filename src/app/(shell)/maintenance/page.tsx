import { format } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { vehicleById, workOrders } from "@/lib/mock/data";
import { money } from "@/lib/utils";

const STATUS_TONE = {
  open: "amber",
  "in-progress": "blue",
  done: "green",
} as const;

const PRIORITY_TONE = { high: "red", medium: "amber", low: "slate" } as const;

const TYPE_ICON = { service: "oil_barrel", repair: "build", inspection: "fact_check" } as const;

export default function MaintenancePage() {
  const now = Date.now();
  const dueSoon = workOrders.filter(
    (w) => w.status !== "done" && new Date(w.scheduledDate).getTime() > now
  ).length;
  const overdue = workOrders.filter(
    (w) => w.status !== "done" && new Date(w.scheduledDate).getTime() < now
  ).length;
  const inService = workOrders.filter((w) => w.status === "in-progress").length;
  const completed = workOrders.filter((w) => w.status === "done").length;

  const upcoming = [...workOrders]
    .filter((w) => w.status !== "done")
    .sort((a, b) => +new Date(a.scheduledDate) - +new Date(b.scheduledDate))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title="Maintenance"
        subtitle="Service schedules, work orders and breakdown logs."
        action={
          <button className="flex items-center gap-2 bg-primary-container hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-container/20">
            <Icon name="add" /> Create Work Order
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard label="Due Soon" value={String(dueSoon)} sub="Upcoming services" icon="schedule" accent="amber" />
        <StatCard label="Overdue" value={String(overdue)} sub="Past scheduled date" icon="error" accent="red" />
        <StatCard label="In Service" value={String(inService)} sub="Currently in workshop" icon="build_circle" accent="blue" />
        <StatCard label="Completed" value={String(completed)} sub="This month" icon="task_alt" accent="green" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Work orders */}
        <div className="col-span-12 xl:col-span-8 card overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-headline-md text-white">Work Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-slate-800/40 border-y border-slate-800">
                  <th className="table-head">Order</th>
                  <th className="table-head">Vehicle</th>
                  <th className="table-head">Type</th>
                  <th className="table-head">Priority</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Scheduled</th>
                  <th className="table-head text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {workOrders.slice(0, 14).map((w) => {
                  const v = vehicleById(w.vehicleId);
                  return (
                    <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3">
                        <p className="text-body-md font-bold text-primary-fixed-dim">#{w.id}</p>
                        <p className="text-label-sm text-slate-500 max-w-[160px] truncate">{w.description}</p>
                      </td>
                      <td className="px-6 py-3 text-body-md text-slate-300">{v?.name ?? "—"}</td>
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-1.5 text-body-md text-slate-300 capitalize">
                          <Icon name={TYPE_ICON[w.type]} className="text-[18px] text-slate-500" />
                          {w.type}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <StatusPill tone={PRIORITY_TONE[w.priority]} dot={false}>
                          {w.priority}
                        </StatusPill>
                      </td>
                      <td className="px-6 py-3">
                        <StatusPill tone={STATUS_TONE[w.status]}>{w.status.replace("-", " ")}</StatusPill>
                      </td>
                      <td className="px-6 py-3 text-body-md text-slate-400">
                        {format(new Date(w.scheduledDate), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-3 text-body-md text-slate-200 text-right tabular-nums">
                        {money(w.cost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming schedule */}
        <div className="col-span-12 xl:col-span-4 card p-6 h-fit">
          <h3 className="text-headline-md text-white mb-4">Upcoming Schedule</h3>
          <div className="space-y-3">
            {upcoming.map((w) => {
              const v = vehicleById(w.vehicleId);
              return (
                <div
                  key={w.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400">
                    <Icon name={TYPE_ICON[w.type]} className="text-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-md text-white font-medium truncate">{v?.name}</p>
                    <p className="text-label-sm text-slate-500 truncate">{w.description}</p>
                  </div>
                  <span className="text-label-sm text-slate-400 whitespace-nowrap">
                    {format(new Date(w.scheduledDate), "MMM d")}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-body-md text-slate-400">Est. parts & labor</span>
            <span className="text-body-md font-bold text-white tabular-nums">
              {money(upcoming.reduce((s, w) => s + w.cost, 0))}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
