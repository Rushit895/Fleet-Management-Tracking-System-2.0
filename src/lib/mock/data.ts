import type {
  Alert,
  ComplianceDoc,
  Driver,
  DriverStatus,
  FuelLog,
  Trip,
  TripStatus,
  User,
  Vehicle,
  VehicleStatus,
  VehicleType,
  WorkOrder,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Deterministic seeded PRNG (mulberry32) — same output on server & client so
// there are no hydration mismatches. Swap this whole module for Supabase later.
// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260709);
const rand = (min: number, max: number) => min + rng() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
const pick = <T>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];

const daysFromNow = (d: number) =>
  new Date(Date.now() + d * 86_400_000).toISOString();
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

// ---------------------------------------------------------------------------
// Reference pools
// ---------------------------------------------------------------------------
const DEPOTS = ["Chicago Hub", "Detroit DC", "Dallas North", "Phoenix Storage"];
const FIRST = ["Marcus", "Sarah", "Roberto", "Elena", "James", "Priya", "David", "Aisha", "Chen", "Diego", "Fatima", "Liam", "Noah", "Olivia", "Emma", "Lucas"];
const LAST = ["Johnson", "Chen", "Fernandez", "Volkov", "Smith", "Patel", "Okafor", "Kim", "Rossi", "Novak", "Hassan", "Brown", "Garcia", "Miller", "Davis"];
const CITIES = ["Chicago Hub", "Detroit DC", "Philadelphia Hub", "Austin South", "Phoenix Storage", "New York Terminal", "Dallas North", "Denver West", "Atlanta East"];
const MAKES: Record<VehicleType, [string, string][]> = {
  truck: [["Freightliner", "M2"], ["Volvo", "VNL 860"], ["Kenworth", "T680"], ["Peterbilt", "579"]],
  van: [["Ford", "Transit"], ["Mercedes", "Sprinter"], ["RAM", "ProMaster"]],
  car: [["Toyota", "Camry"], ["Honda", "Accord"], ["Tesla", "Model 3"]],
  bus: [["Blue Bird", "Vision"], ["Thomas", "C2"]],
};
const STATUSES: VehicleStatus[] = ["moving", "moving", "moving", "idle", "stopped", "offline"];
const TYPES: VehicleType[] = ["truck", "truck", "truck", "van", "van", "car", "bus"];

// Chicago-centred coordinate cloud for the map
const CENTER = { lat: 41.8781, lng: -87.6298 };

// ---------------------------------------------------------------------------
// Drivers
// ---------------------------------------------------------------------------
const DRIVER_COUNT = 42;
export const drivers: Driver[] = Array.from({ length: DRIVER_COUNT }, (_, i) => {
  const status = pick<DriverStatus>(["on-trip", "on-trip", "on-duty", "off-duty"]);
  return {
    id: `DRV-${String(i + 1).padStart(3, "0")}`,
    name: `${pick(FIRST)} ${pick(LAST)}`,
    phone: `+1 (${randInt(200, 989)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`,
    status,
    vehicleId: null, // linked below
    depot: pick(DEPOTS),
    licenseNo: `DL${randInt(10000000, 99999999)}`,
    licenseClass: pick(["Class A", "Class B", "Class C"]),
    licenseExpiry: daysFromNow(randInt(-20, 400)),
    dutyHoursToday: Math.round(rand(0, 11) * 10) / 10,
    rating: Math.round(rand(3.4, 5) * 10) / 10,
    safetyScore: randInt(62, 99),
    overspeedEvents: randInt(0, 12),
    harshBrakingEvents: randInt(0, 9),
    onTimePct: randInt(78, 99),
    tripsThisMonth: randInt(8, 46),
    distanceThisMonth: randInt(1200, 9800),
  };
});

// ---------------------------------------------------------------------------
// Vehicles
// ---------------------------------------------------------------------------
const VEHICLE_COUNT = 50;
export const vehicles: Vehicle[] = Array.from({ length: VEHICLE_COUNT }, (_, i) => {
  const type = pick(TYPES);
  const [make, model] = pick(MAKES[type]);
  const status = pick(STATUSES);
  const driver = drivers[i % drivers.length];
  return {
    id: `VEH-${String(i + 1).padStart(3, "0")}`,
    name: `${make} ${model}`,
    plate: `${pick(["IL", "MI", "TX", "AZ"])}-${randInt(1000, 9999)}${pick(["AB", "XY", "GH", "TR"])}`,
    type,
    status,
    driverId: status === "offline" ? null : driver.id,
    depot: pick(DEPOTS),
    odometer: randInt(15_000, 320_000),
    speed: status === "moving" ? randInt(20, 105) : 0,
    location: {
      lat: CENTER.lat + rand(-0.6, 0.6),
      lng: CENTER.lng + rand(-0.7, 0.7),
    },
    address: `${randInt(100, 9999)} ${pick(["Main St", "Oak Ave", "Industrial Pkwy", "Lake Shore Dr", "Route 66"])}, ${pick(CITIES)}`,
    lastSeen: status === "offline" ? minsAgo(randInt(60, 2880)) : minsAgo(randInt(0, 5)),
    fuelLevel: randInt(8, 100),
    make,
    model,
    year: randInt(2016, 2024),
    costPerKm: Math.round(rand(0.35, 1.4) * 100) / 100,
  };
});

// Link drivers <-> vehicles
vehicles.forEach((v) => {
  if (v.driverId) {
    const d = drivers.find((x) => x.id === v.driverId);
    if (d && !d.vehicleId) d.vehicleId = v.id;
  }
});

// ---------------------------------------------------------------------------
// Trips
// ---------------------------------------------------------------------------
const TRIP_STATUSES: TripStatus[] = ["scheduled", "in-progress", "completed", "cancelled"];
export const trips: Trip[] = Array.from({ length: 60 }, (_, i) => {
  const status = i < 24 ? "scheduled" : i < 36 ? "in-progress" : i < 57 ? "completed" : "cancelled";
  const v = pick(vehicles);
  const origin = pick(CITIES);
  let destination = pick(CITIES);
  while (destination === origin) destination = pick(CITIES);
  const delayed = status === "in-progress" && rng() > 0.7;
  return {
    id: `TRP-${4800 + i}`,
    origin,
    destination,
    vehicleId: v.id,
    driverId: v.driverId ?? pick(drivers).id,
    status: status as TripStatus,
    scheduledAt: daysFromNow(status === "completed" ? -randInt(1, 20) : randInt(0, 6)),
    eta: `${randInt(1, 23)}:${String(randInt(0, 59)).padStart(2, "0")}`,
    progress: status === "in-progress" ? randInt(10, 92) : status === "completed" ? 100 : 0,
    distanceKm: randInt(80, 620),
    cargo: pick(["Electronics", "Perishables", "Machinery", "Retail Goods", "Automotive Parts", "Furniture"]),
    delayedMin: delayed ? randInt(15, 90) : undefined,
  };
});

// ---------------------------------------------------------------------------
// Maintenance work orders
// ---------------------------------------------------------------------------
export const workOrders: WorkOrder[] = Array.from({ length: 28 }, (_, i) => ({
  id: `WO-${2100 + i}`,
  vehicleId: pick(vehicles).id,
  type: pick(["service", "repair", "inspection"]),
  priority: pick(["low", "medium", "high"]),
  status: pick(["open", "open", "in-progress", "done"]),
  scheduledDate: daysFromNow(randInt(-10, 30)),
  cost: randInt(120, 4200),
  mechanic: `${pick(FIRST)} ${pick(LAST)}`,
  description: pick([
    "Scheduled oil & filter change",
    "Brake pad replacement",
    "Annual DOT inspection",
    "Tire rotation & alignment",
    "Transmission fluid service",
    "Coolant system flush",
    "Engine diagnostics — check-engine light",
  ]),
}));

// ---------------------------------------------------------------------------
// Fuel logs
// ---------------------------------------------------------------------------
export const fuelLogs: FuelLog[] = Array.from({ length: 80 }, (_, i) => {
  const liters = randInt(40, 260);
  const anomaly = rng() > 0.9;
  return {
    id: `FL-${5000 + i}`,
    vehicleId: pick(vehicles).id,
    date: daysFromNow(-randInt(0, 30)),
    liters,
    cost: Math.round(liters * rand(1.3, 1.7)),
    odometer: randInt(20_000, 300_000),
    mileage: Math.round(rand(3.5, 9.5) * 10) / 10,
    anomaly,
  };
});

// ---------------------------------------------------------------------------
// Compliance documents
// ---------------------------------------------------------------------------
const DOC_TYPES = ["registration", "insurance", "permit", "fitness", "pollution"] as const;
export const complianceDocs: ComplianceDoc[] = vehicles.flatMap((v) =>
  DOC_TYPES.map((type, j) => {
    const days = randInt(-15, 300);
    const status = days < 0 ? "expired" : days < 30 ? "expiring" : "valid";
    return {
      id: `${v.id}-${type}`,
      vehicleId: v.id,
      type,
      documentNo: `${type.slice(0, 3).toUpperCase()}-${randInt(100000, 999999)}`,
      issueDate: daysFromNow(-randInt(200, 700)),
      expiryDate: daysFromNow(days),
      status: status as ComplianceDoc["status"],
    };
  })
);

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------
const ALERT_DEFS = [
  { type: "sos", severity: "critical", desc: "SOS / panic button triggered" },
  { type: "overspeed", severity: "warning", desc: "Over-speeding — 112 km/h in 80 zone" },
  { type: "geofence", severity: "warning", desc: "Exited authorized geofence zone" },
  { type: "harsh-braking", severity: "warning", desc: "Harsh braking event detected" },
  { type: "idle", severity: "info", desc: "Idle for over 30 minutes" },
  { type: "document-expiry", severity: "warning", desc: "Insurance expires in 5 days" },
  { type: "maintenance-due", severity: "info", desc: "Service due — 500 km remaining" },
] as const;

export const alerts: Alert[] = Array.from({ length: 34 }, (_, i) => {
  const def = pick(ALERT_DEFS);
  const v = pick(vehicles);
  return {
    id: `ALT-${9000 + i}`,
    type: def.type,
    severity: def.severity,
    vehicleId: v.id,
    driverId: v.driverId,
    description: def.desc,
    timestamp: minsAgo(randInt(1, 1440)),
    status: pick(["new", "new", "acknowledged", "resolved"]),
  };
});

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const users: User[] = [
  { id: "USR-001", name: "Alex Thorne", email: "alex.thorne@fleetcommand.io", role: "Fleet Manager", depot: "Chicago Hub", status: "active", lastActive: minsAgo(2) },
  { id: "USR-002", name: "Dana Reyes", email: "dana.reyes@fleetcommand.io", role: "Admin", depot: "HQ", status: "active", lastActive: minsAgo(41) },
  { id: "USR-003", name: "Sam Whitfield", email: "sam.w@fleetcommand.io", role: "Dispatcher", depot: "Detroit DC", status: "active", lastActive: minsAgo(9) },
  { id: "USR-004", name: "Priya Nair", email: "priya.nair@fleetcommand.io", role: "Dispatcher", depot: "Dallas North", status: "active", lastActive: minsAgo(120) },
  { id: "USR-005", name: "Marcus Johnson", email: "marcus.j@fleetcommand.io", role: "Driver", depot: "Chicago Hub", status: "active", lastActive: minsAgo(15) },
  { id: "USR-006", name: "Elena Volkov", email: "elena.v@fleetcommand.io", role: "Viewer", depot: "Phoenix Storage", status: "invited", lastActive: minsAgo(6000) },
];

// ---------------------------------------------------------------------------
// Lookups & aggregate helpers
// ---------------------------------------------------------------------------
export const vehicleById = (id: string | null) =>
  id ? vehicles.find((v) => v.id === id) : undefined;
export const driverById = (id: string | null) =>
  id ? drivers.find((d) => d.id === id) : undefined;
export const tripById = (id: string) => trips.find((t) => t.id === id);

export const fleetStats = () => {
  const active = vehicles.filter((v) => v.status !== "offline").length;
  const onTrip = trips.filter((t) => t.status === "in-progress").length;
  const openAlerts = alerts.filter((a) => a.status !== "resolved").length;
  const maintenanceDue = workOrders.filter((w) => w.status !== "done").length;
  return { active, total: vehicles.length, onTrip, openAlerts, maintenanceDue };
};
