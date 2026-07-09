import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <Sidebar />
      <main className="ml-sidebar_width h-screen flex flex-col bg-slate-950">
        <Topbar />
        <div className="p-8 flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
