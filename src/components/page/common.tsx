"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PixelCanvas } from "@/components/fx/pixel-canvas";
import { EASE, Reveal, SplitText, Stagger } from "@/components/fx/reveal";

/* Short hero with the dotted stage (Pricing, App, Coming soon, Changelog…) */
export function PageHero({
  eyebrow,
  chip,
  title,
  sub,
  children,
  stageHeight = "clamp(440px,34.7vw,500px)",
  medium = false,
  align = "center",
}: {
  eyebrow?: string;
  chip?: { tag: string; text: string };
  title: string;
  sub?: string;
  children?: React.ReactNode;
  stageHeight?: string;
  medium?: boolean;
  align?: "center" | "left";
}) {
  return (
    <section id="top" className="relative pt-16">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative overflow-hidden rounded-[clamp(20px,1.94vw,28px)] border border-line bg-sidebar"
          style={{ minHeight: stageHeight }}
        >
          <div className="absolute inset-x-0 top-[30%] h-[1000px] opacity-[0.22] dark:opacity-[0.3]">
            <PixelCanvas name="ascii-hero" mode="field" fit="cover" align="top" className="size-full" />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to bottom, transparent, var(--sidebar))" }} />
          <div
            className={`relative flex flex-col gap-[18px] px-5 pt-[clamp(64px,6.67vw,96px)] pb-[clamp(48px,5.56vw,80px)] sm:px-10 ${
              align === "center" ? "items-center text-center" : "items-start"
            }`}
          >
            {chip && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, ease: EASE }} className="flex h-[30px] items-center gap-2 rounded-control border border-line bg-panel px-3">
                <span className="font-mono text-[12px] text-accent">{chip.tag}</span>
                <span className="text-[13px] text-fg">{chip.text}</span>
              </motion.div>
            )}
            {eyebrow && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="eyebrow tracking-[0.08em]">
                {eyebrow}
              </motion.div>
            )}
            <SplitText
              as="h1"
              immediate
              delay={0.2}
              text={title}
              className={`max-w-[1000px] text-fg ${
                medium ? "text-[clamp(40px,4.44vw,64px)] leading-[1.06] font-[570] tracking-[-0.035em]" : "text-[clamp(44px,6.67vw,96px)] leading-[1] tracking-[-0.045em]"
              }`}
            />
            {sub && (
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, ease: EASE }} className="max-w-[760px] text-[clamp(17px,1.39vw,20px)] leading-[1.5] text-muted">
                {sub}
              </motion.p>
            )}
            {children && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, ease: EASE }} className={`flex w-full flex-col gap-4 pt-2 ${align === "center" ? "items-center" : ""}`}>
                {children}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* Email capture with validation + success state */
export function Waitlist({ cta = "Join the waitlist", note }: { cta?: string; note?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "loading" | "done">("idle");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState("error");
    setState("loading");
    setTimeout(() => setState("done"), 900);
  };
  return (
    <div className="flex w-full max-w-[480px] flex-col items-center gap-3">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-control border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-[color-mix(in_oklab,var(--success)_8%,transparent)] px-4 text-[15px] text-fg"
          >
            <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 14 }} className="grid size-6 place-items-center rounded-full bg-success text-[13px] text-main">
              ✓
            </motion.span>
            You&apos;re on the list. We&apos;ll email <b className="font-[570]">{email}</b>.
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            animate={state === "error" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`flex h-[52px] w-full items-center gap-2 rounded-control border bg-panel py-1.5 pr-1.5 pl-[18px] transition-[border-color,box-shadow] focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_10%,transparent)] ${
              state === "error" ? "border-danger" : "border-line focus-within:border-selected"
            }`}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => (setEmail(e.target.value), state === "error" && setState("idle"))}
              placeholder="you@company.com"
              aria-label="Email"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
            />
            <button type="submit" disabled={state === "loading"} className="flex h-11 shrink-0 items-center gap-2 rounded-control bg-fg px-5 text-[14px] font-[570] text-panel transition-transform active:scale-[0.97] max-xs:px-3">
              {state === "loading" && <span className="size-3.5 animate-spin rounded-full border-2 border-panel border-t-transparent" />}
              {cta}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <span className={`text-[13px] leading-4 ${state === "error" ? "text-danger" : "text-muted"}`}>{state === "error" ? "That email doesn't look right — try again." : note}</span>
    </div>
  );
}

/* Accordion FAQ */
export function FAQ({ eyebrow = "QUESTIONS", title, items, extra }: { eyebrow?: string; title: string; items: { q: string; a: string }[]; extra?: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-x py-[clamp(72px,8.3vw,120px)]">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
        <Reveal className="flex w-full shrink-0 flex-col gap-3 lg:w-[360px]">
          <div className="eyebrow tracking-[0.08em]">{eyebrow}</div>
          <h2 className="text-[clamp(32px,3.06vw,44px)] leading-[1.136] font-[570] tracking-[-0.025em] text-fg">{title}</h2>
          {extra && <div className="pt-2">{extra}</div>}
        </Reveal>
        <div className="flex grow flex-col border-t border-line">
          {items.map((it, i) => (
            <motion.div
              key={it.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ease: EASE }}
              className="border-b border-line"
            >
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="group/faq flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className="text-[17px] leading-[22px] font-[570] text-fg transition-colors group-hover/faq:text-accent">{it.q}</span>
                <span className="relative grid size-[18px] shrink-0 place-items-center text-fg">
                  <span className="absolute h-[1.75px] w-3.5 rounded-full bg-current" />
                  <span className={`absolute h-3.5 w-[1.75px] rounded-full bg-current transition-transform duration-300 ${open === i ? "scale-y-0" : ""}`} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                    <p className="max-w-[640px] pb-6 text-[15px] leading-[23px] text-muted">{it.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Roadmap / status rows */
export function StatusRows({ eyebrow, title, rows }: { eyebrow: string; title: string; rows: { tag: string; tone: "success" | "warning" | "muted"; text: string; meta: string }[] }) {
  const tone = { success: "text-success", warning: "text-warning", muted: "text-muted" };
  return (
    <section className="container-x py-[clamp(72px,8.3vw,120px)]">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
        <Reveal className="flex w-full shrink-0 flex-col gap-3 lg:w-[360px]">
          <div className="eyebrow tracking-[0.08em]">{eyebrow}</div>
          <h2 className="text-[clamp(32px,3.06vw,44px)] leading-[1.136] font-[570] tracking-[-0.025em] text-fg">{title}</h2>
        </Reveal>
        <div className="flex grow flex-col border-b border-line">
          {rows.map((r, i) => (
            <motion.div
              key={r.tag}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, ease: EASE, duration: 0.6 }}
              className="group/row flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-line py-[18px]"
            >
              <span className={`flex w-[120px] shrink-0 items-center gap-2 font-mono text-[13px] ${tone[r.tone]}`}>
                {r.tone === "success" && <span className="size-1.5 animate-pulse rounded-full bg-current" />}
                {r.tag}
              </span>
              <span className="grow text-[18px] leading-[22px] text-fg transition-transform duration-300 group-hover/row:translate-x-1">{r.text}</span>
              <span className="text-[14px] leading-[18px] text-muted">{r.meta}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Icon cards row */
export function IconCards({ items, className = "" }: { items: { icon: React.ReactNode; title: string; body: string }[]; className?: string }) {
  return (
    <Stagger className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`} itemClassName="flex" y={16}>
      {items.map((c) => (
        <div key={c.title} className="group/ic flex w-full flex-col gap-2.5 rounded-panel border border-line bg-panel p-8 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent lg:p-10">
          <span className="text-fg transition-[color,transform] duration-500 group-hover/ic:scale-110 group-hover/ic:text-accent">{c.icon}</span>
          <span className="text-[17px] leading-[22px] font-[570] text-fg">{c.title}</span>
          <span className="text-[14px] leading-[21px] text-muted">{c.body}</span>
        </div>
      ))}
    </Stagger>
  );
}
