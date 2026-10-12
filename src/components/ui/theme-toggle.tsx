"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Moon, Sun } from "./icons";

/** Light/dark toggle — icon rotates 90° and cross-fades; page colors cross-fade 450ms. */
export function useThemeSwitch() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const apply = (next: string) => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    const go = () => setTheme(next);
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("theme-transition");
      doc.startViewTransition(go);
    } else {
      go();
      window.setTimeout(() => root.classList.remove("theme-transition"), 500);
    }
  };
  return { mounted, resolved: mounted ? resolvedTheme : undefined, theme, apply };
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { mounted, resolved, apply } = useThemeSwitch();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => apply(isDark ? "light" : "dark")}
      className={`group/tt relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-control border border-line text-fg transition-[background-color,color,border-color,transform] duration-200 hover:bg-hover hover:text-accent active:scale-95 ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="grid place-items-center"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
