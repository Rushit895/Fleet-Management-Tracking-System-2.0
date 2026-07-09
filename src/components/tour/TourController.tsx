"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useTour } from "./store";
import { STEPS } from "./steps";

const SEEN_KEY = "fc_tour_v1";
const POPOVER_W = 340;
const POPOVER_H = 208;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function TourController() {
  const { open, index, start, stop, setIndex } = useTour();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  // Always points at the current step's selector, so the persistent realign
  // listener below never captures a stale selector from a previous step.
  const selectorRef = useRef(step.selector);
  selectorRef.current = step.selector;

  // Auto-start: ?tour=1 always, otherwise once per browser.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("tour") === "1") {
      params.delete("tour");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? `?${qs}` : ""));
      start();
    } else if (!localStorage.getItem(SEEN_KEY)) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = useCallback(() => {
    localStorage.setItem(SEEN_KEY, "1");
    stop();
  }, [stop]);

  // ONE persistent listener for the whole tour. It reads the current target
  // from selectorRef, so it can never overwrite the spotlight with a stale
  // selector from a previous step (the bug that caused the spotlight to stick).
  useEffect(() => {
    if (!open) return;
    const realign = () => {
      const sel = selectorRef.current;
      if (!sel) return;
      const el = document.querySelector(sel);
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener("resize", realign);
    window.addEventListener("scroll", realign, true);
    return () => {
      window.removeEventListener("resize", realign);
      window.removeEventListener("scroll", realign, true);
    };
  }, [open]);

  // On each step: navigate if needed, then measure the target with a few
  // retries to catch post-navigation layout settling. Timers are cleared on
  // step change, so no stale measurement from a previous step survives.
  useEffect(() => {
    if (!open) return;
    if (step.route && pathnameRef.current !== step.route) {
      router.push(step.route);
    }
    if (!step.selector) {
      setRect(null);
      return;
    }
    let cancelled = false;
    let scrolled = false;
    const attempt = () => {
      if (cancelled) return;
      const el = document.querySelector(step.selector!);
      if (!el) return;
      if (!scrolled) {
        scrolled = true;
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      setRect(el.getBoundingClientRect());
    };
    const timers = [0, 100, 250, 450, 750, 1200].map((d) => window.setTimeout(attempt, d));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, pathname]);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight") setIndex(Math.min(index + 1, STEPS.length - 1));
      if (e.key === "ArrowLeft") setIndex(Math.max(index - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, finish, setIndex]);

  if (!open) return null;

  // Popover position
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  let pos: { left: number; top: number; centered: boolean };
  if (!rect) {
    pos = { left: (vw - POPOVER_W) / 2, top: (vh - POPOVER_H) / 2, centered: true };
  } else if (rect.left < vw * 0.34 && rect.right + 16 + POPOVER_W < vw) {
    pos = { left: rect.right + 16, top: clamp(rect.top, 16, vh - POPOVER_H - 16), centered: false };
  } else if (rect.bottom + 16 + POPOVER_H < vh) {
    pos = { left: clamp(rect.left, 16, vw - POPOVER_W - 16), top: rect.bottom + 16, centered: false };
  } else {
    pos = { left: clamp(rect.left, 16, vw - POPOVER_W - 16), top: Math.max(16, rect.top - POPOVER_H - 16), centered: false };
  }

  return (
    <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
      {/* Dim + spotlight */}
      {rect ? (
        <div
          className="fixed rounded-xl ring-2 ring-primary-container transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: rect.left - 6,
            top: rect.top - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: "0 0 0 9999px rgba(2,6,23,0.74)",
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-slate-950/75 pointer-events-none" />
      )}

      {/* Popover */}
      <div
        className="fixed w-[340px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 transition-all duration-300"
        style={{ left: pos.left, top: pos.top }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-sm text-primary-fixed-dim uppercase tracking-wider">
            Step {index + 1} of {STEPS.length}
          </span>
          <button onClick={finish} className="text-slate-500 hover:text-white" aria-label="Close tour">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>

        <h3 className="text-headline-md text-white mb-1.5">{step.title}</h3>
        <p className="text-body-md text-slate-400">{step.body}</p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mt-4 mb-4">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-5 bg-primary-container" : "w-1.5 bg-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={finish} className="text-body-md text-slate-500 hover:text-slate-300">
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                onClick={() => setIndex(index - 1)}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-body-md font-semibold"
              >
                Back
              </button>
            )}
            <button
              onClick={() => (isLast ? finish() : setIndex(index + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container hover:bg-blue-600 text-white text-body-md font-bold"
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <Icon name="arrow_forward" className="text-[18px]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
