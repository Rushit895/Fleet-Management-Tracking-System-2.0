"use client";

import { create } from "zustand";

type TourState = {
  open: boolean;
  index: number;
  start: () => void;
  stop: () => void;
  setIndex: (i: number) => void;
};

/** Global control for the guided product tour (triggered from the top bar). */
export const useTour = create<TourState>((set) => ({
  open: false,
  index: 0,
  start: () => set({ open: true, index: 0 }),
  stop: () => set({ open: false }),
  setIndex: (i) => set({ index: i }),
}));
