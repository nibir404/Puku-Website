"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * Renders Paper-exported pixel / dot art (converted to compact JSON) on a canvas
 * and brings it to life:
 *  - "assemble": pixels rise into place bottom → top, then lit windows twinkle (footer skyline)
 *  - "field":    dots bloom from the center, a brightness wave drifts upward, cursor lens magnifies (hero)
 *  - "gather":   pixels fly in from scatter and settle, then breathe (CTA "P")
 *  - "wave":     dot grid with radius driven by a drifting sine field (story backdrops)
 */

type Data = { w: number; h: number; s?: number; pal: string[]; d: number[]; k: "r" | "c" };
type Mode = "assemble" | "field" | "gather" | "wave";

const cache = new Map<string, Promise<Data>>();
const load = (url: string) => {
  if (!cache.has(url)) cache.set(url, fetch(url).then((r) => r.json()));
  return cache.get(url)!;
};

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

export function PixelCanvas({
  name,
  mode,
  fit = "cover",
  className = "",
  opacity,
  align = "bottom",
}: {
  /** base name in /public/data — `${name}-light.json` / `${name}-dark.json` */
  name: string;
  mode: Mode;
  fit?: "cover" | "contain";
  className?: string;
  opacity?: number;
  align?: "bottom" | "center" | "top";
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let disposed = false;
    let visible = false;
    let startedAt = -1;
    let lastDraw = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const par = { x: 0, y: 0, tx: 0, ty: 0 };

    let data: Data | null = null;
    let rgb: number[][] = [];
    let n = 0;
    // per-point randoms
    let rnd: Float32Array;
    let cache: HTMLCanvasElement | null = null; // settled rect art
    let cacheKey = "";
    let scale = 1,
      ox = 0,
      oy = 0,
      W = 0,
      H = 0;

    const resize = () => {
      if (!data) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cache = null;
      const sx = W / data.w,
        sy = H / data.h;
      scale = fit === "cover" ? Math.max(sx, sy) : Math.min(sx, sy);
      ox = (W - data.w * scale) / 2;
      oy = align === "bottom" ? H - data.h * scale : align === "top" ? 0 : (H - data.h * scale) / 2;
    };

    const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!data || !visible || document.hidden) return;
      if (mode === "wave" && now - lastDraw < 33) return; // ambient backdrop: 30fps is plenty
      lastDraw = now;
      if (startedAt < 0) startedAt = now;
      const t = reduce ? 1e6 : (now - startedAt) / 1000;
      ctx.clearRect(0, 0, W, H);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      par.x += (par.tx - par.x) * 0.06;
      par.y += (par.ty - par.y) * 0.06;
      const d = data.d;

      if (data.k === "r") {
        const s = (data.s ?? 3) * scale;
        const settleAt = mode === "assemble" ? 1.8 : 1.7;
        if (t > settleAt) {
          // Settled: paint static pixels once to an offscreen layer, then only animate the few live ones.
          const key = `${W}x${H}`;
          if (!cache || cacheKey !== key) {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            cache = document.createElement("canvas");
            cache.width = Math.round(W * dpr);
            cache.height = Math.round(H * dpr);
            const cx = cache.getContext("2d")!;
            cx.setTransform(dpr, 0, 0, dpr, 0, 0);
            for (let i = 0; i < n; i++) {
              if (mode === "assemble" && rnd[i] > 0.93) continue;
              const o = i * 4;
              const c = rgb[d[o + 2]];
              cx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${d[o + 3] / 100})`;
              cx.fillRect(ox + d[o] * scale, oy + d[o + 1] * scale, s, s);
            }
            cacheKey = key;
          }
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.globalAlpha = mode === "gather" ? 0.86 + 0.14 * Math.sin(t * ((Math.PI * 2) / 8)) : 1;
          ctx.drawImage(cache, 0, 0);
          ctx.restore();
          if (mode === "assemble") {
            for (let i = 0; i < n; i++) {
              if (rnd[i] <= 0.93) continue;
              const o = i * 4;
              const c = rgb[d[o + 2]];
              const a = (d[o + 3] / 100) * (0.65 + 0.35 * Math.sin(t * (1.2 + rnd[i] * 2) + i));
              ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
              ctx.fillRect(ox + d[o] * scale, oy + d[o + 1] * scale, s, s);
            }
          }
          return;
        }
        for (let i = 0; i < n; i++) {
          const o = i * 4;
          const x = d[o],
            y = d[o + 1];
          const c = rgb[d[o + 2]];
          let a = d[o + 3] / 100;
          let px = ox + x * scale,
            py = oy + y * scale;

          if (mode === "assemble") {
            // bottom rows first, 900ms sweep + jitter
            const delay = (1 - y / data.h) * 0.9 + rnd[i] * 0.25;
            const p = ease((t - delay) / 0.6);
            if (p <= 0) continue;
            py += (1 - p) * 18 * scale;
            a *= p;
            // twinkle: brightest (window) pixels flicker gently
            if (p >= 1 && rnd[i] > 0.93) a *= 0.65 + 0.35 * Math.sin(t * (1.2 + rnd[i] * 2) + i);
          } else if (mode === "gather") {
            const delay = rnd[i] * 0.5;
            const p = ease((t - delay) / 1.1);
            const ang = rnd[i] * Math.PI * 2 * 7;
            const dist = (1 - p) * 220 * scale;
            px += Math.cos(ang) * dist;
            py += Math.sin(ang) * dist;
            a *= p * (0.82 + 0.18 * Math.sin(t * 0.8 + y * 0.03 + x * 0.01)); // breathe 8s-ish
          }
          if (a <= 0.01) continue;
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
          ctx.fillRect(px, py, s, s);
        }
      } else {
        for (let i = 0; i < n; i++) {
          const o = i * 5;
          const x = d[o],
            y = d[o + 1];
          const c = rgb[d[o + 2]];
          let a = d[o + 3] / 100;
          let r = (d[o + 4] / 100) * scale;
          let px = ox + x * scale,
            py = oy + y * scale;

          if (mode === "field") {
            const cx = data.w / 2,
              cy = data.h * 0.42;
            const dist = Math.hypot(x - cx, y - cy) / data.w;
            const p = ease((t - dist * 1.6) / 0.7);
            if (p <= 0) continue;
            r *= p;
            // brightness wave drifting upward, 10s loop
            const wave = 0.5 + 0.5 * Math.sin((y / data.h) * 9 + t * ((Math.PI * 2) / 10) * 3 + rnd[i] * 0.8);
            a *= 0.55 + 0.45 * wave;
            // depth parallax toward cursor (12px max)
            const depth = 0.3 + rnd[i] * 0.7;
            px += par.x * -12 * depth;
            py += par.y * -12 * depth;
            // cursor lens
            const md = Math.hypot(px - mouse.x, py - mouse.y);
            if (md < 140) {
              const k = 1 - md / 140;
              r *= 1 + k * 1.1;
              a = Math.min(1, a + k * 0.4);
            }
          } else if (mode === "wave") {
            const phase = t * ((Math.PI * 2) / 14);
            const f = 0.5 + 0.5 * Math.sin(x * 0.012 + y * 0.018 + phase) * Math.cos(y * 0.01 - phase * 0.6);
            r *= 0.6 + f * 0.9;
            a *= 0.6 + f * 0.6;
            const md = Math.hypot(px - mouse.x, py - mouse.y);
            if (md < 120) r *= 1 + (1 - md / 120) * 0.8;
          }
          if (a <= 0.01 || r <= 0.05) continue;
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${Math.min(a, 1)})`;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // static modes can stop once settled & no cursor/time-based effects matter
      if (reduce) cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      if (!visible || e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      par.tx = (mouse.tx - r.width / 2) / r.width;
      par.ty = (mouse.ty - r.height / 2) / r.height;
      if (mouse.x < -999) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    const onLeave = () => {
      mouse.tx = mouse.ty = -9999;
      mouse.x = mouse.y = -9999;
      par.tx = par.ty = 0;
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { rootMargin: "100px" },
    );
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    load(`/data/${name}-${theme}.json`).then((json) => {
      if (disposed) return;
      data = json;
      n = json.d.length / (json.k === "r" ? 4 : 5);
      rgb = json.pal.map(hexToRgb);
      rnd = new Float32Array(n);
      for (let i = 0; i < n; i++) rnd[i] = Math.random();
      resize();
      raf = requestAnimationFrame(draw);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [name, mode, fit, align, theme]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} style={opacity === undefined ? undefined : { opacity }} />;
}
