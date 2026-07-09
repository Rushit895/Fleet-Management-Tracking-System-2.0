import { cn } from "@/lib/utils";

type Tone = "moving" | "idle" | "stopped" | "offline" | "blue" | "green" | "amber" | "red" | "slate";

const TONE: Record<Tone, string> = {
  moving: "bg-status-moving/15 text-status-moving",
  green: "bg-status-moving/15 text-status-moving",
  idle: "bg-status-idle/15 text-status-idle",
  amber: "bg-status-idle/15 text-status-idle",
  stopped: "bg-status-stopped/15 text-status-stopped",
  red: "bg-status-stopped/15 text-status-stopped",
  offline: "bg-slate-500/15 text-slate-400",
  slate: "bg-slate-500/15 text-slate-400",
  blue: "bg-primary-container/15 text-primary-fixed-dim",
};

const DOT: Record<Tone, string> = {
  moving: "bg-status-moving",
  green: "bg-status-moving",
  idle: "bg-status-idle",
  amber: "bg-status-idle",
  stopped: "bg-status-stopped",
  red: "bg-status-stopped",
  offline: "bg-slate-400",
  slate: "bg-slate-400",
  blue: "bg-primary-container",
};

export function StatusPill({
  tone,
  children,
  dot = true,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("status-pill capitalize", TONE[tone], className)}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", DOT[tone])} />}
      {children}
    </span>
  );
}
