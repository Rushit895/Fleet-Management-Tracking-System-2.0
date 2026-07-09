// ---------------------------------------------------------------------------
// FleetCommand domain model
// ---------------------------------------------------------------------------

export type VehicleStatus = "moving" | "idle" | "stopped" | "offline";
export type VehicleType = "truck" | "van" | "car" | "bus";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  type: VehicleType;
  status: VehicleStatus;
  driverId: string | null;
  depot: string;
  odometer: number; // km
  speed: number; // km/h (live)
  location: GeoPoint;
  address: string;
  lastSeen: string; // ISO
  fuelLevel: number; // 0-100
  make: string;
  model: string;
  year: number;
  costPerKm: number;
}

export type DriverStatus = "on-trip" | "on-duty" | "off-duty";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  status: DriverStatus;
  vehicleId: string | null;
  depot: string;
  licenseNo: string;
  licenseClass: string;
  licenseExpiry: string; // ISO
  dutyHoursToday: number;
  rating: number; // 0-5
  safetyScore: number; // 0-100
  overspeedEvents: number;
  harshBrakingEvents: number;
  onTimePct: number;
  tripsThisMonth: number;
  distanceThisMonth: number;
}

export type TripStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  status: TripStatus;
  scheduledAt: string; // ISO
  eta: string;
  progress: number; // 0-100
  distanceKm: number;
  cargo: string;
  delayedMin?: number;
}

export type WorkOrderType = "service" | "repair" | "inspection";
export type WorkOrderStatus = "open" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface WorkOrder {
  id: string;
  vehicleId: string;
  type: WorkOrderType;
  priority: Priority;
  status: WorkOrderStatus;
  scheduledDate: string;
  cost: number;
  mechanic: string;
  description: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  liters: number;
  cost: number;
  odometer: number;
  mileage: number; // km/l
  anomaly: boolean;
}

export type DocumentType =
  | "registration"
  | "insurance"
  | "permit"
  | "fitness"
  | "pollution";
export type ComplianceStatus = "valid" | "expiring" | "expired";

export interface ComplianceDoc {
  id: string;
  vehicleId: string;
  type: DocumentType;
  documentNo: string;
  issueDate: string;
  expiryDate: string;
  status: ComplianceStatus;
}

export type AlertType =
  | "overspeed"
  | "geofence"
  | "harsh-braking"
  | "sos"
  | "idle"
  | "document-expiry"
  | "maintenance-due";
export type Severity = "critical" | "warning" | "info";
export type AlertStatus = "new" | "acknowledged" | "resolved";

export interface Alert {
  id: string;
  type: AlertType;
  severity: Severity;
  vehicleId: string;
  driverId: string | null;
  description: string;
  timestamp: string;
  status: AlertStatus;
}

export type Role = "Admin" | "Fleet Manager" | "Dispatcher" | "Driver" | "Viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  depot: string;
  status: "active" | "invited" | "suspended";
  lastActive: string;
}
