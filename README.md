# FleetCommand — Fleet Management & Tracking System

A real-time fleet management and GPS tracking platform for medium-scale operations
(50–500 vehicles). FleetCommand unifies live tracking, dispatch, maintenance, fuel
and cost analytics, compliance, and alerting into a single operations console.

Built with Next.js and TypeScript, the application ships with a live GPS simulator
and a Supabase-ready data layer, and deploys to a fully free hosting tier.

---

## Overview

FleetCommand covers the operational lifecycle of a vehicle fleet — from the moment
an asset leaves the depot to its cost per kilometre. The interface follows a dense,
"mission control" layout optimised for operators who monitor many vehicles at once,
with consistent status signalling (moving, idle, stopped, offline) throughout.

The application is fully functional on deterministic demo data out of the box; no
database or API keys are required to run or deploy it.

## Features

| Module | Description |
| --- | --- |
| Dashboard | Fleet KPIs, utilisation trends, live map summary, and recent alerts |
| Live Tracking | Interactive MapLibre GL map with live-updating vehicle positions, status filters, and a per-vehicle telemetry drawer |
| Vehicles | Fleet registry with detailed vehicle profiles (specs, documents, maintenance, fuel, and trip history) |
| Drivers | Driver roster with licences, duty hours, and performance metrics |
| Trips & Dispatch | Trip planning and assignment with ETAs, progress tracking, and animated route playback |
| Maintenance | Work orders, service schedules, and cost tracking |
| Fuel & Cost | Cost-per-kilometre analysis, mileage trends, and fuel anomaly detection |
| Compliance | Document expiry tracking and renewal management |
| Reports | Configurable operational reports with PDF and CSV export |
| Alerts | Severity-based alert triage with acknowledge and resolve workflows |
| Settings | User management and a role-based access-control matrix |

## Technology

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS with a custom design-token system
- **Mapping:** MapLibre GL (open-source, no API key required)
- **Charts:** Recharts
- **Backend (optional):** Supabase — PostgreSQL, PostGIS, Auth, and Realtime
- **State:** Zustand

## Getting Started

Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

The application runs at `http://localhost:3000` on built-in demo data. No
environment variables are required.

### Available scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
  app/                 Routes (App Router)
    (shell)/           Application screens under the sidebar + top-bar shell
    page.tsx           Marketing landing page
  components/          Layout shell and reusable UI primitives
  features/            Feature modules (dashboard charts, tracking map, fuel charts)
  lib/
    types.ts           Domain model
    mock/              Deterministic demo dataset
    sim/               Client-side GPS simulator
    data/repository.ts Data-access seam (mock today, Supabase-ready)
    supabase/          Guarded Supabase client
supabase/
  schema.sql           PostgreSQL + PostGIS schema
  seed.ts              Dataset seeding script
```

## Data Layer

All screens read through a single data-access seam,
[`src/lib/data/repository.ts`](src/lib/data/repository.ts). The application uses a
deterministic in-memory dataset by default and falls back to it automatically when
Supabase is not configured, so the deployed application never depends on external
availability.

To connect a live PostgreSQL/PostGIS backend, see
[`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md).

## Deployment

The project deploys to Vercel with no additional configuration. Import the
repository, keep the default Next.js build settings, and deploy. Full instructions,
including optional Supabase environment variables, are in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## License

Released under the MIT License.
