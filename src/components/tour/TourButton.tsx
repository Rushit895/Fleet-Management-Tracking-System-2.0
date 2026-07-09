"use client";

import { Icon } from "@/components/ui/Icon";
import { useTour } from "./store";

export function TourButton() {
  const start = useTour((s) => s.start);
  return (
    <button
      onClick={start}
      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-body-md font-medium transition-colors"
      title="Take a guided tour"
    >
      <Icon name="explore" className="text-[18px] text-primary-fixed-dim" />
      <span className="hidden sm:inline">Tour</span>
    </button>
  );
}
