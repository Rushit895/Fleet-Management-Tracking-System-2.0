export type TourStep = {
  title: string;
  body: string;
  /** CSS selector to spotlight. Omit for a centered, full-screen step. */
  selector?: string;
  /** Route to navigate to before showing this step. */
  route?: string;
};

export const STEPS: TourStep[] = [
  {
    title: "Welcome to FleetCommand",
    body: "A real-time console for managing and tracking your entire fleet. Here's a quick tour of everything it does — you can skip anytime.",
    route: "/dashboard",
  },
  {
    title: "The live dashboard",
    body: "Your command center: fleet-wide KPIs, utilisation trends, a live map and recent alerts — all at a glance.",
    selector: '[data-tour="kpis"]',
    route: "/dashboard",
  },
  {
    title: "Main navigation",
    body: "Every module lives in this sidebar. We'll walk through each one now.",
    selector: '[data-tour="sidebar"]',
  },
  {
    title: "Live Tracking",
    body: "A real-time map of your fleet. Vehicles move live and are colour-coded by status — click any of them to see its telemetry.",
    selector: '[data-tour="nav-/tracking"]',
    route: "/tracking",
  },
  {
    title: "Vehicles",
    body: "Your complete vehicle registry with status, driver, odometer and document compliance. Open any vehicle for its full profile.",
    selector: '[data-tour="nav-/vehicles"]',
    route: "/vehicles",
  },
  {
    title: "Drivers",
    body: "The driver roster — licences, duty hours, safety scores and performance ratings.",
    selector: '[data-tour="nav-/drivers"]',
    route: "/drivers",
  },
  {
    title: "Trips & Dispatch",
    body: "Plan and assign trips, track them live, and replay the exact route of any completed journey.",
    selector: '[data-tour="nav-/trips"]',
    route: "/trips",
  },
  {
    title: "Maintenance",
    body: "Work orders, service schedules and repair costs, with overdue tracking so nothing slips.",
    selector: '[data-tour="nav-/maintenance"]',
    route: "/maintenance",
  },
  {
    title: "Fuel & Cost",
    body: "Cost-per-kilometre analysis, mileage trends and automatic fuel-anomaly detection.",
    selector: '[data-tour="nav-/fuel"]',
    route: "/fuel",
  },
  {
    title: "Compliance",
    body: "Track document expiries — registration, insurance, permits and more — before they lapse.",
    selector: '[data-tour="nav-/compliance"]',
    route: "/compliance",
  },
  {
    title: "Reports",
    body: "Generate operational reports and export them to PDF or CSV.",
    selector: '[data-tour="nav-/reports"]',
    route: "/reports",
  },
  {
    title: "Alerts",
    body: "Every fleet event — over-speeding, geofence breaches, SOS — triaged by severity.",
    selector: '[data-tour="nav-/alerts"]',
    route: "/alerts",
  },
  {
    title: "Settings",
    body: "Manage users, roles and access permissions across your organisation.",
    selector: '[data-tour="nav-/settings"]',
    route: "/settings",
  },
  {
    title: "Search & notifications",
    body: "Global search and your notifications are always within reach up here.",
    selector: '[data-tour="topbar"]',
  },
  {
    title: "You're all set",
    body: "That's the whole platform. Explore freely — you can replay this tour anytime from the Tour button in the top bar.",
  },
];
