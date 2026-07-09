import { Icon } from "./Icon";
import { PageHeader } from "@/components/layout/PageHeader";

export function ComingSoon({
  title,
  subtitle,
  icon,
  note,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  note?: string;
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="card p-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-container/15 text-primary-fixed-dim flex items-center justify-center">
          <Icon name={icon} className="text-[32px]" />
        </div>
        <h3 className="text-headline-md text-white">{title} module</h3>
        <p className="text-body-md text-slate-400 max-w-md">
          {note ??
            "This screen is wired into the navigation and design system. Full build is in progress."}
        </p>
      </div>
    </>
  );
}
