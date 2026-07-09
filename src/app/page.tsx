import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata = {
  title: "FleetCommand — Real-time Fleet Management & Tracking",
  description:
    "A modern, real-time fleet management and GPS tracking control system — live tracking, dispatch, maintenance, fuel analytics, compliance and alerts.",
};

const FEATURES = [
  { icon: "location_on", title: "Live GPS Tracking", desc: "Real-time vehicle positions on an interactive map with geofencing, status filters and per-vehicle telemetry drawers." },
  { icon: "route", title: "Trips & Dispatch", desc: "Plan, assign and track trips with ETAs, progress bars and animated route playback of every journey." },
  { icon: "build", title: "Maintenance", desc: "Service schedules, work orders and breakdown logs with overdue tracking and parts/labor cost rollups." },
  { icon: "local_gas_station", title: "Fuel & Cost Analytics", desc: "Cost-per-km trends, mileage efficiency and automatic fuel-anomaly detection across the fleet." },
  { icon: "verified_user", title: "Compliance", desc: "Document expiry tracking for registration, insurance, permits, fitness and pollution — with renewal alerts." },
  { icon: "notifications_active", title: "Smart Alerts", desc: "Over-speeding, geofence breaches, harsh braking and SOS — triaged by severity with acknowledge/resolve." },
  { icon: "assessment", title: "Reports & Exports", desc: "Utilization, cost, driver performance and fuel reports, generated and exported to PDF or CSV." },
  { icon: "groups", title: "Roles & Access", desc: "Role-based access control across Admin, Fleet Manager, Dispatcher, Driver and Viewer, with a permission matrix." },
];

const STACK = [
  { name: "Next.js 14", icon: "bolt" },
  { name: "TypeScript", icon: "code" },
  { name: "Tailwind CSS", icon: "palette" },
  { name: "MapLibre GL", icon: "map" },
  { name: "Supabase + PostGIS", icon: "database" },
  { name: "Recharts", icon: "monitoring" },
];

const SCREENS = [
  "Dashboard", "Live Tracking", "Vehicles", "Vehicle Detail", "Drivers", "Driver Detail",
  "Trips & Dispatch", "Route Playback", "Maintenance", "Fuel & Cost", "Compliance",
  "Reports", "Alerts", "Settings & Roles",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur bg-slate-950/70 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <Icon name="local_shipping" className="text-white text-[20px]" />
            </div>
            <span className="text-headline-md font-bold text-white">FleetCommand</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-body-md text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#tracking" className="hover:text-white transition-colors">Live Tracking</a>
            <a href="#stack" className="hover:text-white transition-colors">Tech Stack</a>
            <a href="#screens" className="hover:text-white transition-colors">Screens</a>
          </nav>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 bg-primary-container hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-body-md transition-all active:scale-95 shadow-lg shadow-primary-container/20"
          >
            Launch App <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-container/20 blur-[120px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-status-moving animate-pulse" />
            <span className="text-label-sm text-slate-300">Real-time fleet operations · Mission Control</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Command your entire fleet from{" "}
            <span className="bg-gradient-to-r from-primary-fixed-dim to-primary-container bg-clip-text text-transparent">
              one screen
            </span>
          </h1>
          <p className="text-body-lg md:text-xl text-slate-400 mt-6 max-w-2xl mx-auto">
            Track vehicles live, dispatch trips, schedule maintenance, control costs and stay
            compliant — a complete Fleet Management &amp; Tracking System built for real-time
            operations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-9">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-primary-container hover:bg-blue-600 text-white px-7 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-primary-container/25"
            >
              <Icon name="dashboard" /> Launch Dashboard
            </Link>
            <Link
              href="/tracking"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white px-7 py-3 rounded-xl font-bold transition-all"
            >
              <Icon name="location_on" /> View Live Tracking
            </Link>
          </div>
          <p className="text-label-sm text-slate-500 mt-4">
            No sign-up · Live demo data · Runs 100% free
          </p>

          {/* Browser mock */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
                <span className="w-3 h-3 rounded-full bg-status-stopped/70" />
                <span className="w-3 h-3 rounded-full bg-status-idle/70" />
                <span className="w-3 h-3 rounded-full bg-status-moving/70" />
                <span className="ml-3 text-label-sm text-slate-500">fleetcommand.app/tracking</span>
              </div>
              <div className="relative h-[300px] md:h-[380px] bg-slate-950">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                {/* fake routes */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
                  <path d="M8 50 Q 30 10 55 30 T 92 14" stroke="#2563eb" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                  <path d="M12 12 Q 40 40 70 22 T 96 45" stroke="#334155" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                </svg>
                {/* pins */}
                {[
                  { top: "30%", left: "20%", c: "bg-status-moving" },
                  { top: "55%", left: "42%", c: "bg-status-moving" },
                  { top: "38%", left: "60%", c: "bg-status-idle" },
                  { top: "68%", left: "72%", c: "bg-status-stopped" },
                  { top: "24%", left: "82%", c: "bg-status-moving" },
                  { top: "60%", left: "16%", c: "bg-slate-500" },
                ].map((p, i) => (
                  <span key={i} className={`absolute w-3.5 h-3.5 rounded-full ring-4 ring-white/5 ${p.c}`} style={{ top: p.top, left: p.left }} />
                ))}
                {/* floating stat card */}
                <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur">
                  <p className="text-label-sm text-slate-500">Active Vehicles</p>
                  <p className="text-2xl font-bold text-white">42<span className="text-body-md text-slate-500">/50</span></p>
                  <div className="flex items-center gap-1 text-status-moving text-label-sm mt-1">
                    <Icon name="trending_up" className="text-[16px]" /> live
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Vehicles tracked live" },
            { value: "14", label: "Full operational screens" },
            { value: "Real-time", label: "GPS position updates" },
            { value: "$0", label: "Cost to deploy & run" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-white">{s.value}</p>
              <p className="text-body-md text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-label-sm text-primary-fixed-dim uppercase tracking-wider mb-3">Everything in one place</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">A complete fleet operations suite</h2>
          <p className="text-body-lg text-slate-400 mt-4 max-w-2xl mx-auto">
            From the moment a vehicle leaves the depot to the cost per kilometre it clocks —
            FleetCommand covers the entire operational lifecycle.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-primary-container/50 hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-container/15 text-primary-fixed-dim flex items-center justify-center mb-4 group-hover:bg-primary-container group-hover:text-white transition-colors">
                <Icon name={f.icon} className="text-[24px]" />
              </div>
              <h3 className="text-headline-md text-white mb-2">{f.title}</h3>
              <p className="text-body-md text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live tracking highlight */}
      <section id="tracking" className="border-y border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-label-sm text-primary-fixed-dim uppercase tracking-wider mb-3">Live tracking</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Watch your fleet move in real time
            </h2>
            <p className="text-body-lg text-slate-400 mt-4">
              A real MapLibre GL map streams live vehicle positions, colour-coded by status.
              Filter by state, click any vehicle for live speed, location and driver, and replay
              the exact path of any completed trip.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Colour-coded status: moving, idle, stopped, offline",
                "Per-vehicle telemetry drawer with live speed",
                "Geofence-ready with PostGIS geospatial queries",
                "Animated route playback for every trip",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-body-md text-slate-300">
                  <Icon name="check_circle" className="text-status-moving text-[20px]" fill /> {t}
                </li>
              ))}
            </ul>
            <Link
              href="/tracking"
              className="inline-flex items-center gap-2 mt-8 bg-primary-container hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
            >
              Open Live Map <Icon name="arrow_forward" />
            </Link>
          </div>
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 h-[340px] overflow-hidden">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            {[
              { top: "20%", left: "30%", c: "bg-status-moving", d: "0s" },
              { top: "45%", left: "55%", c: "bg-status-moving", d: "0.4s" },
              { top: "35%", left: "72%", c: "bg-status-idle", d: "0.8s" },
              { top: "65%", left: "40%", c: "bg-status-stopped", d: "0.2s" },
              { top: "72%", left: "78%", c: "bg-status-moving", d: "0.6s" },
              { top: "55%", left: "18%", c: "bg-slate-500", d: "1s" },
            ].map((p, i) => (
              <span key={i} className="absolute" style={{ top: p.top, left: p.left }}>
                <span className={`block w-3.5 h-3.5 rounded-full ${p.c}`} />
                <span
                  className={`absolute inset-0 w-3.5 h-3.5 rounded-full ${p.c} opacity-40 animate-ping`}
                  style={{ animationDelay: p.d }}
                />
              </span>
            ))}
            <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 backdrop-blur">
              {[["moving", "#16a34a"], ["idle", "#f59e0b"], ["stopped", "#dc2626"]].map(([l, c]) => (
                <span key={l} className="flex items-center gap-1.5 text-label-sm text-slate-300 capitalize">
                  <span className="w-2 h-2 rounded-full" style={{ background: c as string }} /> {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section id="stack" className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-label-sm text-primary-fixed-dim uppercase tracking-wider mb-3">Built with</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">A modern, free-tier stack</h2>
        <p className="text-body-lg text-slate-400 mt-4 max-w-2xl mx-auto">
          Production-grade tools chosen to be fast, type-safe and deployable at zero cost.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {STACK.map((s) => (
            <div key={s.name} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">
              <Icon name={s.icon} className="text-primary-fixed-dim text-[22px]" />
              <span className="text-body-md font-semibold text-white">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Screens */}
      <section id="screens" className="border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <p className="text-label-sm text-primary-fixed-dim uppercase tracking-wider mb-3">Fully built</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">14 operational screens, no dead ends</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {SCREENS.map((s) => (
              <span key={s} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-body-md text-slate-300">
                <Icon name="check" className="text-status-moving text-[16px]" /> {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-container/20 blur-[100px] rounded-full" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Ready to take command?</h2>
            <p className="text-body-lg text-slate-400 mt-4 max-w-xl mx-auto">
              Jump straight into the live dashboard — no account, no setup, real-time demo data.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 mt-8 bg-primary-container hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-body-lg transition-all active:scale-95 shadow-xl shadow-primary-container/25"
            >
              <Icon name="rocket_launch" /> Launch FleetCommand
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center">
              <Icon name="local_shipping" className="text-white text-[18px]" />
            </div>
            <span className="text-body-md font-bold text-white">FleetCommand</span>
          </div>
          <p className="text-label-sm text-slate-500">
            Fleet Management &amp; Tracking System · Built as a portfolio project
          </p>
          <Link href="/dashboard" className="text-body-md text-primary-fixed-dim hover:underline">
            Launch App →
          </Link>
        </div>
      </footer>
    </div>
  );
}
