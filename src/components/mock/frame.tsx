"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Renders children at a fixed design size (e.g. 1200×750) and scales the whole
 * thing to the available width — keeps product UIs pixel-faithful at 375 → 1920
 * while staying fully interactive.
 */
export function ScaledFrame({
  width,
  height,
  children,
  className = "",
  maxScale = 1,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
  className?: string;
  maxScale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(e.contentRect.width / width, maxScale)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, maxScale]);
  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ height: height * scale }}>
      <div
        className="absolute top-0 left-1/2 origin-top"
        style={{ width, height, transform: `translateX(-50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

export function TrafficLights() {
  return (
    <div className="flex gap-[7px]">
      <span className="size-3 rounded-full bg-[#ED6A5E]" />
      <span className="size-3 rounded-full bg-[#F5BF4F]" />
      <span className="size-3 rounded-full bg-[#61C554]" />
    </div>
  );
}

export function WindowChrome({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex size-full flex-col overflow-hidden bg-main text-fg ${className}`}>
      <div className="relative flex h-[35px] shrink-0 items-center border-b border-line bg-sidebar px-3.5">
        <TrafficLights />
        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] text-muted">{title}</span>
      </div>
      {children}
    </div>
  );
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Runs `script` once the element scrolls into view, unless the visitor already took over. */
export function useAutoplay(script: (alive: () => boolean) => Promise<void> | void, enabled = true) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const taken = useRef(false);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || !enabled || started.current) return;
    started.current = true;
    let alive = true;
    const t = setTimeout(() => script(() => alive && !taken.current), 500);
    return () => {
      alive = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, enabled]);
  return { ref, takeOver: () => (taken.current = true) };
}

/** Streams a string out char by char. */
export async function typeInto(text: string, set: (s: string) => void, alive: () => boolean, speed = 28) {
  for (let i = 1; i <= text.length; i++) {
    if (!alive()) return false;
    set(text.slice(0, i));
    await sleep(speed + Math.random() * speed * 0.6);
  }
  return true;
}
