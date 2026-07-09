export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Live Tracking", href: "/tracking", icon: "location_on" },
  { label: "Vehicles", href: "/vehicles", icon: "local_shipping" },
  { label: "Drivers", href: "/drivers", icon: "person" },
  { label: "Trips & Dispatch", href: "/trips", icon: "route" },
  { label: "Maintenance", href: "/maintenance", icon: "build" },
  { label: "Fuel & Cost", href: "/fuel", icon: "local_gas_station" },
  { label: "Compliance", href: "/compliance", icon: "verified_user" },
  { label: "Reports", href: "/reports", icon: "assessment" },
  { label: "Alerts", href: "/alerts", icon: "notifications_active" },
];

export const SETTINGS_ITEM: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: "settings",
};
