"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { users } from "@/lib/mock/data";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const SETTINGS_NAV = [
  { key: "users", label: "Users & Roles", icon: "group" },
  { key: "profile", label: "Profile", icon: "person" },
  { key: "depots", label: "Depots", icon: "warehouse" },
  { key: "geofences", label: "Geofences", icon: "fence" },
  { key: "rules", label: "Alert Rules", icon: "notifications" },
  { key: "integrations", label: "Integrations", icon: "extension" },
  { key: "billing", label: "Billing", icon: "credit_card" },
];

const ROLES: Role[] = ["Admin", "Fleet Manager", "Dispatcher", "Driver", "Viewer"];
const MODULES = ["Dashboard", "Live Tracking", "Vehicles", "Drivers", "Trips", "Maintenance", "Compliance", "Reports", "Settings"];

// permission matrix: which role can access which module
const CAN: Record<Role, Set<string>> = {
  Admin: new Set(MODULES),
  "Fleet Manager": new Set(MODULES.filter((m) => m !== "Settings")),
  Dispatcher: new Set(["Dashboard", "Live Tracking", "Vehicles", "Drivers", "Trips", "Reports"]),
  Driver: new Set(["Dashboard", "Live Tracking", "Trips"]),
  Viewer: new Set(["Dashboard", "Live Tracking", "Vehicles", "Reports"]),
};

const ROLE_TONE: Record<Role, "red" | "blue" | "amber" | "green" | "slate"> = {
  Admin: "red",
  "Fleet Manager": "blue",
  Dispatcher: "amber",
  Driver: "green",
  Viewer: "slate",
};

const STATUS_TONE = { active: "green", invited: "amber", suspended: "red" } as const;

export default function SettingsPage() {
  const [tab, setTab] = useState("users");

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage users, roles and system configuration." />

      <div className="grid grid-cols-12 gap-8">
        {/* Settings sub-nav */}
        <aside className="col-span-12 lg:col-span-3 card p-3 h-fit">
          {SETTINGS_NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-body-md transition-colors",
                tab === item.key
                  ? "bg-primary-container/15 text-primary-fixed-dim font-semibold"
                  : "text-slate-400 hover:bg-slate-800"
              )}
            >
              <Icon name={item.icon} className="text-[20px]" />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="col-span-12 lg:col-span-9 space-y-8">
          {tab === "users" ? (
            <>
              {/* Users table */}
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-4">
                  <h3 className="text-headline-md text-white">Users</h3>
                  <button className="flex items-center gap-2 bg-primary-container hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-body-md shadow-lg shadow-primary-container/20">
                    <Icon name="person_add" className="text-[18px]" /> Invite User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr className="bg-slate-800/40 border-y border-slate-800">
                        <th className="table-head">Name</th>
                        <th className="table-head">Role</th>
                        <th className="table-head">Depot</th>
                        <th className="table-head">Status</th>
                        <th className="table-head">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-label-sm">
                                {u.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                              <div>
                                <p className="text-body-md font-semibold text-white">{u.name}</p>
                                <p className="text-label-sm text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <StatusPill tone={ROLE_TONE[u.role]} dot={false}>
                              {u.role}
                            </StatusPill>
                          </td>
                          <td className="px-6 py-3 text-body-md text-slate-400">{u.depot}</td>
                          <td className="px-6 py-3">
                            <StatusPill tone={STATUS_TONE[u.status]}>{u.status}</StatusPill>
                          </td>
                          <td className="px-6 py-3 text-label-sm text-slate-500">
                            {formatDistanceToNow(new Date(u.lastActive), { addSuffix: true })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Permission matrix */}
              <div className="card p-6 overflow-hidden">
                <h3 className="text-headline-md text-white mb-4">Roles & Permissions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="table-head">Module</th>
                        {ROLES.map((r) => (
                          <th key={r} className="table-head text-center">{r}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {MODULES.map((m) => (
                        <tr key={m} className="hover:bg-slate-800/20">
                          <td className="px-6 py-2.5 text-body-md text-slate-200">{m}</td>
                          {ROLES.map((r) => (
                            <td key={r} className="px-6 py-2.5 text-center">
                              {CAN[r].has(m) ? (
                                <Icon name="check_circle" className="text-status-moving text-[18px]" fill />
                              ) : (
                                <Icon name="remove" className="text-slate-700 text-[18px]" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="card p-16 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/15 text-primary-fixed-dim flex items-center justify-center">
                <Icon name={SETTINGS_NAV.find((s) => s.key === tab)?.icon ?? "settings"} className="text-[28px]" />
              </div>
              <h3 className="text-headline-md text-white">
                {SETTINGS_NAV.find((s) => s.key === tab)?.label}
              </h3>
              <p className="text-body-md text-slate-400 max-w-sm">
                This settings section is scaffolded and ready. Configuration UI comes with the
                Supabase integration phase.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
