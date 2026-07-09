/**
 * Data repository — the single seam between the UI and its data source.
 *
 * Today every function returns the deterministic mock dataset, so the app runs
 * with zero backend. When Supabase is configured (env vars present), swap the
 * bodies here to `supabase.from(...).select()` calls — the return shapes match
 * `src/lib/types.ts`, so no screen needs to change.
 *
 * This is the file to edit in the Supabase phase; nothing else in the UI.
 */
import { isSupabaseConfigured } from "@/lib/supabase/client";
import * as mock from "@/lib/mock/data";
import type {
  Alert,
  ComplianceDoc,
  Driver,
  FuelLog,
  Trip,
  User,
  Vehicle,
  WorkOrder,
} from "@/lib/types";

export const dataSource = isSupabaseConfigured ? "supabase" : "mock";

// NOTE: signatures are async on purpose so the Supabase swap is a drop-in
// (`await supabase.from('vehicles').select()`), even though mock is sync today.
export async function getVehicles(): Promise<Vehicle[]> {
  return mock.vehicles;
}
export async function getVehicle(id: string): Promise<Vehicle | undefined> {
  return mock.vehicleById(id);
}
export async function getDrivers(): Promise<Driver[]> {
  return mock.drivers;
}
export async function getDriver(id: string): Promise<Driver | undefined> {
  return mock.driverById(id);
}
export async function getTrips(): Promise<Trip[]> {
  return mock.trips;
}
export async function getWorkOrders(): Promise<WorkOrder[]> {
  return mock.workOrders;
}
export async function getFuelLogs(): Promise<FuelLog[]> {
  return mock.fuelLogs;
}
export async function getComplianceDocs(): Promise<ComplianceDoc[]> {
  return mock.complianceDocs;
}
export async function getAlerts(): Promise<Alert[]> {
  return mock.alerts;
}
export async function getUsers(): Promise<User[]> {
  return mock.users;
}
