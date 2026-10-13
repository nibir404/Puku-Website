"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { Children, useEffect, useRef, useState } from "react";

/** Strong ease-out: fast start, long gentle settle. Use for anything entering or responding. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Shared timings (seconds). Entrances stay under ~0.7s so the page never feels like it's waiting. */
export const DUR = { fast: 0.2, base: 0.35, reveal: 0.6, hero: 0.8 } as const;

/** Critically damped springs: settle quickly with no visible bounce. */
export const SPRING = { type: "spring", stiffness: 500, damping: 40, mass: 1 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 260, damping: 30, mass: 1 } as const;

/** Fade + rise on enter. */
export function Reveal({
  children,
  delay = 0,
  y = 12,
  className = "",
  as = "div",
  amount = 0.2,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
  amount?: number;
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      // Opacity + transform only: both run on the compositor. (Animating blur repaints every frame.)
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DUR.reveal, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
const item = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE } },
});

/** Staggers direct children (cards rise 16–24px, 80–90ms stagger per Paper notes). */
export function Stagger({
  children,
  className = "",
  stagger = 0.06,
  delay = 0,
  y = 14,
  amount = 0.15,
  immediate = false,
  itemClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
  stagger?: number;
  delay?: number;
  y?: number;
  amount?: number;
  immediate?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount } })}
    >
      {Children.map(children, (c) => (c == null || c === false ? c : <motion.div variants={item(y)} className={itemClassName}>{c}</motion.div>))}
    </motion.div>
  );
}

/** Headline: each word rises out of a mask. */
export function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.035,
  immediate = false,
  as = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const M = motion[as];
  const lines = text.split("\n");
  let idx = 0;
  return (
    <M
      className={className}
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.5 } })}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(" ").map((w, wi, arr) => {
            const i = idx++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "105%", rotate: 4 },
                    show: { y: "0%", rotate: 0, transition: { duration: DUR.hero, ease: EASE, delay: delay + i * stagger } },
                  }}
                >
                  {w}
                  {wi < arr.length - 1 ? " " : ""}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </M>
  );
}

/** Counts a number up when it scrolls into view. */
export function CountUp({ to, duration = 1.6, suffix = "", className = "" }: { to: number; duration?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={className}>
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}

/** 3D tilt-on-hover with a spotlight that follows the cursor. */
export function TiltCard({ children, className = "", max = 4 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 220, damping: 26 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 220, damping: 26 });
  const bg = useTransform(
    [mx, my] as never,
    ([x, y]: number[]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, color-mix(in oklab, var(--accent) 9%, transparent), transparent 60%)`,
  );
  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className={`group/tilt relative ${className}`}
    >
      <motion.div aria-hidden style={{ background: bg }} className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100" />
      {children}
    </motion.div>
  );
}
