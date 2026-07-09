import { Icon } from "@/components/ui/Icon";

export function Topbar() {
  return (
    <header className="h-header_height flex items-center justify-between px-gutter border-b border-slate-800 bg-slate-900 z-40 shrink-0">
      <div className="flex items-center bg-slate-800 rounded-lg px-3 py-1.5 w-96 max-w-[40vw]">
        <Icon name="search" className="text-slate-400 mr-2" />
        <input
          className="bg-transparent border-none outline-none focus:ring-0 text-body-md w-full text-slate-200 placeholder:text-slate-500"
          placeholder="Search vehicles, trips, drivers…"
          type="text"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-primary-container transition-colors">
          <Icon name="calendar_today" />
        </button>
        <button className="relative text-slate-400 hover:text-primary-container transition-colors">
          <Icon name="notifications" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-container rounded-full" />
        </button>
        <div className="h-8 w-px bg-slate-700" />
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right leading-tight">
            <p className="text-body-md font-bold group-hover:text-primary-container transition-colors">
              Alex Thorne
            </p>
            <p className="text-label-sm text-slate-500">Fleet Manager</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-slate-700 group-hover:border-primary-container transition-all bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
            AT
          </div>
        </div>
      </div>
    </header>
  );
}
