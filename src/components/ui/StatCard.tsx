import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

type Accent = "blue" | "green" | "amber" | "red";

const ACCENT: Record<Accent, { icon: string; ring: string }> = {
  blue: { icon: "text-primary-fixed-dim bg-primary-container/15", ring: "" },
  green: { icon: "text-status-moving bg-status-moving/15", ring: "" },
  amber: { icon: "text-status-idle bg-status-idle/15", ring: "" },
  red: { icon: "text-status-stopped bg-status-stopped/15", ring: "" },
};

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "blue",
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  accent?: Accent;
  trend?: { dir: "up" | "down"; value: string };
}) {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            ACCENT[accent].icon
          )}
        >
          <Icon name={icon} />
        </div>
        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-label-sm font-semibold",
              trend.dir === "up" ? "text-status-moving" : "text-status-stopped"
            )}
          >
            <Icon
              name={trend.dir === "up" ? "trending_up" : "trending_down"}
              className="text-[16px]"
            />
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-body-md">{label}</p>
        <p className="text-3xl font-bold text-white mt-1 leading-none">{value}</p>
        {sub && <p className="text-label-sm text-slate-500 mt-2">{sub}</p>}
      </div>
    </div>
  );
}
