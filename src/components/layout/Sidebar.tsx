"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SETTINGS_ITEM, type NavItem } from "./nav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      data-tour={`nav-${item.href}`}
      className={cn(
        "flex items-center gap-3 px-6 py-3 transition-colors duration-200",
        active
          ? "border-l-4 border-primary-container bg-slate-800/50 text-white font-bold"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      )}
    >
      <Icon
        name={item.icon}
        className={active ? "text-primary-container" : ""}
        fill={active}
      />
      <span className="text-body-md">{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      data-tour="sidebar"
      className="w-sidebar_width h-screen fixed left-0 top-0 border-r border-slate-800 bg-slate-900 z-50 flex flex-col py-4"
    >
      <div className="px-6 mb-8">
        <h1 className="text-headline-md font-bold text-primary-fixed-dim">
          FleetCommand
        </h1>
        <p className="text-label-sm text-slate-500">Mission Control</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
          />
        ))}
      </nav>

      <div className="mt-2 border-t border-slate-800 pt-2">
        <NavLink
          item={SETTINGS_ITEM}
          active={isActive(pathname, SETTINGS_ITEM.href)}
        />
      </div>
    </aside>
  );
}
