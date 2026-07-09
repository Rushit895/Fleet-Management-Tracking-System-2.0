/**
 * Seed a Supabase project with the FleetCommand mock dataset.
 *
 * Usage (after running supabase/schema.sql in the SQL editor):
 *   1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   2. npx tsx supabase/seed.ts
 *
 * Uses the SERVICE ROLE key (bypasses RLS) — never expose it to the browser.
 */
import { createClient } from "@supabase/supabase-js";
import {
  alerts,
  complianceDocs,
  drivers,
  fuelLogs,
  trips,
  users,
  vehicles,
  workOrders,
} from "../src/lib/mock/data";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.");
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const depots = [...new Set(vehicles.map((v) => v.depot))].map((name) => ({
  id: name,
  name,
}));

// snake_case + PostGIS geography for vehicles
const vehicleRows = vehicles.map((v) => ({
  id: v.id,
  name: v.name,
  plate: v.plate,
  type: v.type,
  status: v.status,
  driver_id: v.driverId,
  depot: v.depot,
  odometer: v.odometer,
  speed: v.speed,
  location: `POINT(${v.location.lng} ${v.location.lat})`,
  address: v.address,
  last_seen: v.lastSeen,
  fuel_level: v.fuelLevel,
  make: v.make,
  model: v.model,
  year: v.year,
  cost_per_km: v.costPerKm,
}));

const driverRows = drivers.map((d) => ({
  id: d.id,
  name: d.name,
  phone: d.phone,
  status: d.status,
  depot: d.depot,
  license_no: d.licenseNo,
  license_class: d.licenseClass,
  license_expiry: d.licenseExpiry,
  duty_hours_today: d.dutyHoursToday,
  rating: d.rating,
  safety_score: d.safetyScore,
  overspeed_events: d.overspeedEvents,
  harsh_braking_events: d.harshBrakingEvents,
  on_time_pct: d.onTimePct,
  trips_this_month: d.tripsThisMonth,
  distance_this_month: d.distanceThisMonth,
}));

async function upsert(table: string, rows: unknown[]) {
  const { error } = await db.from(table).upsert(rows as any);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table} (${rows.length})`);
}

(async () => {
  await upsert("depots", depots);
  await upsert("drivers", driverRows);
  await upsert("vehicles", vehicleRows);
  await upsert("trips", trips.map((t) => ({
    id: t.id, origin: t.origin, destination: t.destination, vehicle_id: t.vehicleId,
    driver_id: t.driverId, status: t.status, scheduled_at: t.scheduledAt, eta: t.eta,
    progress: t.progress, distance_km: t.distanceKm, cargo: t.cargo, delayed_min: t.delayedMin ?? null,
  })));
  await upsert("work_orders", workOrders.map((w) => ({
    id: w.id, vehicle_id: w.vehicleId, type: w.type, priority: w.priority, status: w.status,
    scheduled_date: w.scheduledDate, cost: w.cost, mechanic: w.mechanic, description: w.description,
  })));
  await upsert("fuel_logs", fuelLogs.map((f) => ({
    id: f.id, vehicle_id: f.vehicleId, date: f.date, liters: f.liters, cost: f.cost,
    odometer: f.odometer, mileage: f.mileage, anomaly: f.anomaly,
  })));
  await upsert("compliance_docs", complianceDocs.map((c) => ({
    id: c.id, vehicle_id: c.vehicleId, type: c.type, document_no: c.documentNo,
    issue_date: c.issueDate, expiry_date: c.expiryDate, status: c.status,
  })));
  await upsert("alerts", alerts.map((a) => ({
    id: a.id, type: a.type, severity: a.severity, vehicle_id: a.vehicleId,
    driver_id: a.driverId, description: a.description, timestamp: a.timestamp, status: a.status,
  })));
  await upsert("app_users", users.map((u) => ({
    id: u.id, name: u.name, email: u.email, role: u.role, depot: u.depot,
    status: u.status, last_active: u.lastActive,
  })));
  console.log("\nDone — FleetCommand dataset seeded.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
