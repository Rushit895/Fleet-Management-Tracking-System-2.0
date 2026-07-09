export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <h2 className="text-display text-white">{title}</h2>
        {subtitle && <p className="text-body-lg text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
