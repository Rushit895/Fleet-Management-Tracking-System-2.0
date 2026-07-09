"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Vehicle } from "@/lib/types";

const STATUS_COLOR: Record<Vehicle["status"], string> = {
  moving: "#16a34a",
  idle: "#f59e0b",
  stopped: "#dc2626",
  offline: "#94a3b8",
};

// Free CARTO dark basemap — no API key required.
const MAP_STYLE = {
  version: 8 as const,
  sources: {
    carto: {
      type: "raster" as const,
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
    },
  },
  layers: [{ id: "carto", type: "raster" as const, source: "carto" }],
};

export function FleetMap({
  vehicles,
  selectedId,
  onSelect,
}: {
  vehicles: Vehicle[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Init map once
  useEffect(() => {
    let cancelled = false;
    let map: any;
    let resizeObs: ResizeObserver | undefined;

    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !containerRef.current) return;

      map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE as any,
        center: [-87.6298, 41.8781],
        zoom: 9,
        attributionControl: false,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      mapRef.current = map;

      // Markers are DOM overlays — add immediately, no need to wait for "load"
      // (which can stall when the container starts at 0px in a flex layout).
      vehicles.forEach((v) => {
        const el = document.createElement("div");
        el.className = "veh-marker";
        el.dataset.id = v.id;
        el.style.cssText = `width:14px;height:14px;border-radius:9999px;cursor:pointer;background:${STATUS_COLOR[v.status]};box-shadow:0 0 0 4px ${STATUS_COLOR[v.status]}33;border:2px solid #0f172a;transition:transform .15s;`;
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectRef.current(v.id);
        });
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([v.location.lng, v.location.lat])
          .addTo(map);
        markersRef.current[v.id] = marker;
      });

      // Keep the map sized to its container (handles 0px-at-init in flex).
      resizeObs = new ResizeObserver(() => map.resize());
      resizeObs.observe(containerRef.current);
    })();

    return () => {
      cancelled = true;
      if (resizeObs) resizeObs.disconnect();
      if (map) map.remove();
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live position updates — move existing markers, don't recreate them.
  useEffect(() => {
    vehicles.forEach((v) => {
      const marker = markersRef.current[v.id];
      if (!marker) return;
      marker.setLngLat([v.location.lng, v.location.lat]);
      const el = marker.getElement() as HTMLElement;
      const color = STATUS_COLOR[v.status];
      el.style.background = color;
      el.style.boxShadow = `0 0 0 4px ${color}33`;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles]);

  // Highlight + fly to selection
  useEffect(() => {
    const map = mapRef.current;
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement() as HTMLElement;
      const active = id === selectedId;
      el.style.transform = active ? "scale(1.7)" : "scale(1)";
      el.style.zIndex = active ? "10" : "1";
    });
    if (selectedId && map) {
      const v = vehicles.find((x) => x.id === selectedId);
      if (v) map.flyTo({ center: [v.location.lng, v.location.lat], zoom: 12, speed: 1.4 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return <div ref={containerRef} className="h-full w-full" />;
}
