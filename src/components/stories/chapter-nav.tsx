"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { EASE } from "@/components/fx/reveal";
import { useLenis } from "@/components/smooth-scroll";

export type ChapterItem = { id: string; title: string };

/** A story chapter. The id is what ChapterNav scroll-spies and jumps to. */
export function Chapter({ id, className = "", children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-16 ${className}`}>
      {children}
    </section>
  );
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Tracks the chapter in view, and whether the reader is inside the chapters at all (not the prologue or footer). */
function useChapters(chapters: ChapterItem[]) {
  const [active, setActive] = useState(0);
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(els.indexOf(e.target as HTMLElement))),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        setInside(els[0].getBoundingClientRect().top < vh * 0.6 && els[els.length - 1].getBoundingClientRect().bottom > vh * 0.4);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [chapters]);

  return { active, inside };
}

/**
 * Chapter index for long-form stories.
 * Desktop (xl+): ticks in the left gutter; hover or focus opens the full list.
 * Below xl: a bottom pill with a progress ring that opens a chapter sheet.
 */
export function ChapterNav({ chapters }: { chapters: ChapterItem[] }) {
  const { active, inside } = useChapters(chapters);
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -64 });
    else el.scrollIntoView({ behavior: "smooth" });
    setSheet(false);
  };

  // Close the sheet on outside tap / Escape.
  useEffect(() => {
    if (!sheet) return;
    const onDown = (e: PointerEvent) => !sheetRef.current?.contains(e.target as Node) && setSheet(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [sheet]);

  const { scrollYProgress } = useScroll();
  const ring = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const dash = useTransform(ring, (v) => 69.1 * (1 - v));

  return (
    <>
      {/* Desktop: gutter ticks */}
      <motion.nav
        aria-label="Chapters"
        initial={false}
        animate={{ opacity: inside ? 1 : 0, x: inside ? 0 : -8 }}
        transition={{ duration: 0.3, ease: EASE }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
        className={`fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 xl:block ${inside ? "" : "pointer-events-none"}`}
      >
        <ol className={`flex flex-col gap-0.5 rounded-panel border p-2.5 transition-[background-color,border-color,box-shadow] duration-200 ${open ? "border-line bg-panel shadow-[0_12px_32px_rgb(40_44_34/0.10)]" : "border-transparent"}`}>
          {chapters.map((c, i) => {
            const on = i === active;
            const read = i < active;
            return (
              <li key={c.id}>
                <button
                  onClick={() => jump(c.id)}
                  aria-current={on ? "step" : undefined}
                  tabIndex={inside ? 0 : -1}
                  className={`flex w-full items-center gap-2.5 rounded-control px-2.5 py-1.5 text-left transition-colors ${open && on ? "bg-hover" : ""} ${open ? "hover:bg-hover" : ""}`}
                >
                  <span className={`h-0.5 shrink-0 rounded-full transition-[width,background-color] duration-300 ${on ? "w-6 bg-accent" : read ? "w-3 bg-fg" : "w-3 bg-[var(--border)]"}`} />
                  <span className={`font-mono text-[11px] transition-colors ${on ? "text-accent" : read ? "text-muted" : "text-muted/60"}`}>{pad2(i + 1)}</span>
                  <span
                    className={`overflow-hidden text-[13px] whitespace-nowrap transition-[max-width,opacity] duration-300 ${on ? "font-[570] text-fg" : "text-muted"} ${
                      open ? "max-w-[160px] opacity-100" : on ? "max-w-0 opacity-0 2xl:max-w-[160px] 2xl:opacity-100" : "max-w-0 opacity-0"
                    }`}
                  >
                    {c.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </motion.nav>

      {/* Below xl: bottom pill + sheet */}
      <AnimatePresence>
        {inside && (
          <motion.div
            ref={sheetRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-3 xl:hidden"
          >
            <AnimatePresence>
              {sheet && (
                <motion.ol
                  id="chapter-sheet"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="flex w-full max-w-[360px] flex-col gap-0.5 rounded-panel border border-line bg-panel p-2 shadow-[0_16px_40px_rgb(40_44_34/0.16)]"
                >
                  {chapters.map((c, i) => (
                    <li key={c.id}>
                      <button
                        onClick={() => jump(c.id)}
                        aria-current={i === active ? "step" : undefined}
                        className={`flex w-full gap-3 rounded-control px-3 py-2.5 text-left ${i === active ? "bg-hover" : ""}`}
                      >
                        <span className={`font-mono text-[12px] leading-5 ${i === active ? "text-accent" : "text-muted"}`}>{pad2(i + 1)}</span>
                        <span className={`text-[15px] leading-5 ${i === active ? "font-[570] text-fg" : "text-muted"}`}>{c.title}</span>
                      </button>
                    </li>
                  ))}
                </motion.ol>
              )}
            </AnimatePresence>
            <button
              onClick={() => setSheet((s) => !s)}
              aria-expanded={sheet}
              aria-controls="chapter-sheet"
              className="flex items-center gap-2.5 rounded-full bg-fg py-2 pr-4 pl-2 shadow-[0_8px_24px_rgb(40_44_34/0.2)] active:scale-[0.97]"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
                <circle cx="14" cy="14" r="11" fill="none" stroke="color-mix(in oklab, var(--main) 30%, transparent)" strokeWidth="2.5" />
                <motion.circle cx="14" cy="14" r="11" fill="none" stroke="var(--accent-soft)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="69.1" style={{ strokeDashoffset: dash }} transform="rotate(-90 14 14)" />
              </svg>
              <span className="font-mono text-[12px] text-accent-soft">
                {pad2(active + 1)}/{pad2(chapters.length)}
              </span>
              <span className="text-[14px] font-[570] text-main">{chapters[active]?.title}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
