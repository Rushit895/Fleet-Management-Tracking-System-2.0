import { format, differenceInDays } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { complianceDocs, vehicleById } from "@/lib/mock/data";

const STATUS_TONE = { valid: "green", expiring: "amber", expired: "red" } as const;
const TYPE_LABEL: Record<string, string> = {
  registration: "Registration",
  insurance: "Insurance",
  permit: "Permit",
  fitness: "Fitness",
  pollution: "Pollution",
};

export default function CompliancePage() {
  const valid = complianceDocs.filter((d) => d.status === "valid").length;
  const expiring = complianceDocs.filter((d) => d.status === "expiring").length;
  const expired = complianceDocs.filter((d) => d.status === "expired").length;

  const critical = complianceDocs
    .filter((d) => d.status !== "valid")
    .sort((a, b) => +new Date(a.expiryDate) - +new Date(b.expiryDate))
    .slice(0, 40);

  return (
    <>
      <PageHeader
        title="Compliance"
        subtitle="Document expiry tracking and renewal management."
      />

      {/* Alert banner */}
      {expired + expiring > 0 && (
        <div className="flex items-center gap-3 bg-status-stopped/10 border border-status-stopped/30 text-status-stopped rounded-xl px-5 py-4 mb-6">
          <Icon name="warning" fill />
          <p className="text-body-md">
            <span className="font-bold">{expired} documents expired</span> and{" "}
            <span className="font-bold">{expiring} expiring within 30 days</span>. Renew to
            stay compliant.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Valid" value={String(valid)} sub="Documents in good standing" icon="verified" accent="green" />
        <StatCard label="Expiring Soon" value={String(expiring)} sub="Within 30 days" icon="hourglass_bottom" accent="amber" />
        <StatCard label="Expired" value={String(expired)} sub="Action required" icon="gpp_bad" accent="red" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-headline-md text-white">Documents Needing Attention</h3>
          <span className="text-label-sm text-slate-500">Sorted by expiry</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="bg-slate-800/40 border-y border-slate-800">
                <th className="table-head">Type</th>
                <th className="table-head">Vehicle</th>
                <th className="table-head">Document No.</th>
                <th className="table-head">Issued</th>
                <th className="table-head">Expiry</th>
                <th className="table-head">Status</th>
                <th className="table-head text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {critical.map((d) => {
                const v = vehicleById(d.vehicleId);
                const days = differenceInDays(new Date(d.expiryDate), new Date());
                return (
                  <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-2 text-body-md text-white font-medium">
                        <Icon name="description" className="text-[18px] text-slate-500" />
                        {TYPE_LABEL[d.type]}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-body-md text-slate-300">
                      {v?.name}
                      <span className="text-label-sm text-slate-500 block">{v?.plate}</span>
                    </td>
                    <td className="px-6 py-3 text-body-md text-slate-400 tabular-nums">{d.documentNo}</td>
                    <td className="px-6 py-3 text-body-md text-slate-400">
                      {format(new Date(d.issueDate), "MMM yyyy")}
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-body-md text-slate-200">
                        {format(new Date(d.expiryDate), "MMM d, yyyy")}
                      </span>
                      <span className="text-label-sm text-slate-500 block">
                        {days < 0 ? `${Math.abs(days)}d overdue` : `in ${days}d`}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <StatusPill tone={STATUS_TONE[d.status]}>{d.status}</StatusPill>
                    </td>
                    <td className="px-6 py-3 text-right pr-6">
                      <button className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-primary-container text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-label-sm font-semibold transition-colors">
                        <Icon name="upload" className="text-[16px]" /> Renew
                      </button>
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
