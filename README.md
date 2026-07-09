# 🚚 FleetCommand — Fleet Management & Tracking System

A modern, real-time fleet management dashboard: live GPS tracking, dispatch,
maintenance, fuel & cost analytics, compliance and alerting — built as a
production-quality portfolio piece that deploys **100% free**.

> Dark "mission control" UI designed in Google Stitch, rebuilt as a fully
> responsive Next.js app.

## ✨ Features

- **Dashboard** — fleet KPIs, utilization chart, live map, recent alerts
- **Live Tracking** — real MapLibre GL map with **live-moving** vehicle markers,
  status filters, per-vehicle detail drawer, geofence-ready
- **Vehicles & Drivers** — full registries + rich detail pages
- **Trips & Dispatch** — interactive board + animated **route playback**
- **Maintenance** — work orders, service schedules, cost rollups
- **Fuel & Cost** — cost trends, cost-per-km, anomaly detection (Recharts)
- **Compliance** — document expiry tracking & renewal
- **Reports · Alerts · Settings** — exports, triage, users & role matrix (RBAC)

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (design tokens ported from the Stitch design system) |
| Maps | MapLibre GL + free CARTO dark tiles (no API key) |
| Charts | Recharts |
| Backend (optional) | Supabase — Postgres + PostGIS + Auth + Realtime |
| Data today | Deterministic mock layer + client-side GPS simulator |

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

The app runs immediately on **mock data** — no database or keys required.

## 🗄️ Enabling the Supabase backend (optional)

The app is Supabase-ready but ships on mock data so it never breaks on free-tier
limits. To switch to a real backend, see **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)**.

Data flows through a single seam — `src/lib/data/repository.ts` — so enabling
Supabase does not require changing any screen.

## ☁️ Deployment (free on Vercel)

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**. Push to GitHub → import in
Vercel → deploy. Zero config; works with or without Supabase env vars.

## 📁 Project structure

```
src/
  app/(shell)/        # every screen, under the sidebar+topbar shell
  components/         # layout shell + reusable UI (Icon, StatusPill, StatCard…)
  features/           # feature widgets (dashboard charts, tracking map, fuel charts)
  lib/
    types.ts          # domain model
    mock/data.ts      # deterministic seeded dataset
    sim/              # client-side GPS simulator
    data/repository.ts# the data seam (mock today, Supabase-ready)
    supabase/         # guarded Supabase client
supabase/
  schema.sql          # Postgres + PostGIS schema
  seed.ts             # push the mock dataset into Supabase
```
