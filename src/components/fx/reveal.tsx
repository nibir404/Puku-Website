"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { Children, useEffect, useRef, useState } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Fade + rise on enter. */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className = "",
  as = "div",
  amount = 0.25,
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
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay, ease: EASE }}
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
  hidden: { opacity: 0, y, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: EASE } },
});

/** Staggers direct children (cards rise 16–24px, 80–90ms stagger per Paper notes). */
export function Stagger({
  children,
  className = "",
  stagger = 0.08,
  delay = 0,
  y = 16,
  amount = 0.2,
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
  stagger = 0.045,
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
                  className="inline-block will-change-transform"
                  variants={{
                    hidden: { y: "105%", rotate: 4 },
                    show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE, delay: delay + i * stagger } },
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
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
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
