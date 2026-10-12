"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EASE, Reveal, SplitText, Stagger } from "@/components/fx/reveal";
import { Button } from "@/components/ui/button";

type Cycle = "monthly" | "yearly";
type Cur = "USD" | "BDT";

const PLANS = [
  { name: "Free", tag: "For trying Puku on a side project.", usd: 0, bdt: 0, unit: "forever", cta: "Download", href: "/download", list: ["Editor, CLI, Chat", "50 agent requests / day", "Quick chat mode", "Community support"] },
  { name: "Pro", tag: "For daily, focused work.", usd: 20, bdt: 2400, unit: "/ month", cta: "Start Pro", href: "/download", featured: true, list: ["Everything in Free", "10× higher limits", "Research + Deep modes", "Background runs", "Puku App preview"] },
  { name: "Team", tag: "For teams sharing one codebase.", usd: 40, bdt: 4800, unit: "/ seat / month", cta: "Start a team", href: "/contact", list: ["Everything in Pro", "Shared memory + skills", "Org-wide permissions", "Admin + usage dashboard"] },
  { name: "Enterprise", tag: "For security and scale needs.", usd: -1, bdt: -1, unit: "", cta: "Talk to us", href: "/contact", list: ["Everything in Team", "SSO / SAML, SCIM", "Audit log + retention", "Self-hosted sandboxes", "Dedicated support"] },
];

function Seg<T extends string>({ value, options, onChange, id, mono }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; id: string; mono?: boolean }) {
  return (
    <div className="flex gap-0.5 rounded-control border border-line bg-panel p-1">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} className={`relative rounded-control px-3.5 py-1.5 leading-4 transition-colors ${mono ? "font-mono text-[12px]" : "text-[13px]"} ${value === o.v ? (mono ? "text-fg" : "text-main") : "text-muted hover:text-fg"}`}>
          {value === o.v && <motion.span layoutId={id} className={`absolute inset-0 rounded-control ${mono ? "bg-hover" : "bg-fg"}`} transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
          <span className="relative">{o.l}</span>
        </button>
      ))}
    </div>
  );
}

const fmt = (n: number, cur: Cur) => (cur === "USD" ? `$${n}` : `৳${n.toLocaleString("en-US")}`);

export function Pricing() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [cur, setCur] = useState<Cur>("USD");
  return (
    <>
      <section className="container-x flex flex-col items-center gap-4 pt-[clamp(112px,10vw,144px)] pb-12 text-center">
        <Reveal y={8}>
          <div className="eyebrow tracking-[0.08em]">PRICING</div>
        </Reveal>
        <SplitText as="h1" immediate delay={0.15} text="One plan. Every Puku surface." className="max-w-[760px] text-[clamp(40px,4.17vw,60px)] leading-[1.07] font-[570] tracking-[-0.035em] text-fg" />
        <Reveal delay={0.4}>
          <p className="max-w-[560px] text-[18px] leading-[27px] text-muted">Editor, CLI, Chat and App share one subscription and one memory. Start free, upgrade when you hit the limits.</p>
        </Reveal>
        <Reveal delay={0.5} className="flex flex-wrap justify-center gap-3 pt-4">
          <Seg id="cycle" value={cycle} onChange={setCycle} options={[{ v: "monthly", l: "Monthly" }, { v: "yearly", l: "Yearly · save 20%" }]} />
          <Seg id="cur" mono value={cur} onChange={setCur} options={[{ v: "USD", l: "USD" }, { v: "BDT", l: "BDT ৳" }]} />
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" itemClassName="flex" y={16} stagger={0.08}>
          {PLANS.map((p) => {
            const raw = cur === "USD" ? p.usd : p.bdt;
            const val = raw <= 0 ? raw : cycle === "yearly" ? Math.round(raw * 0.8) : raw;
            return (
              <div
                key={p.name}
                className={`group/plan relative flex w-full flex-col gap-6 overflow-hidden rounded-panel border bg-panel p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 ${
                  p.featured ? "border-fg shadow-[0_24px_60px_-34px_color-mix(in_oklab,var(--accent)_70%,transparent)]" : "border-line hover:border-selected"
                }`}
              >
                {p.featured && <span aria-hidden className="pointer-events-none absolute -top-28 -right-28 size-64 rounded-full bg-accent opacity-[0.08] blur-3xl transition-opacity duration-500 group-hover/plan:opacity-[0.16]" />}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-[16px] leading-5 font-[570] text-fg">{p.name}</span>
                    {p.featured && <span className="font-mono text-[11px] leading-[14px] text-accent">MOST CHOSEN</span>}
                  </div>
                  <span className="text-[14px] leading-[18px] text-muted">{p.tag}</span>
                </div>
                <div className="flex h-[54px] items-baseline gap-1.5 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={`${val}${cur}`}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="text-[44px] leading-[54px] font-[570] tracking-[-0.02em] text-fg"
                    >
                      {raw < 0 ? "Custom" : fmt(val, cur)}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[14px] leading-[18px] text-muted">
                    {p.unit}
                    {p.name === "Pro" && cur === "USD" && ` · ৳${(cycle === "yearly" ? 1920 : 2400).toLocaleString("en-US")}`}
                    {cycle === "yearly" && raw > 0 && <span className="block text-[11px] text-success">billed yearly</span>}
                  </span>
                </div>
                <Button href={p.href} variant={p.featured ? "primary" : "secondary"} className="w-full" wrapClassName="w-full" size="md" magnetic={false}>
                  {p.cta}
                </Button>
                <ul className="flex flex-col font-mono text-[13px] leading-[26px] text-muted">
                  {p.list.map((l, i) => (
                    <motion.li key={l} initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05 }}>
                      <span className="text-success">✓</span> {l}
                    </motion.li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Stagger>
      </section>
    </>
  );
}

const ROWS: [string, string, string, string, string][] = [
  ["Agent requests", "50 / day", "500 / day", "pooled", "custom"],
  ["Chat modes", "Quick", "Quick · Research · Deep", "all", "all"],
  ["Background runs", "—", "✓", "✓", "✓"],
  ["Shared memory and skills", "—", "—", "✓", "✓"],
  ["SSO, SCIM, audit log", "—", "—", "SSO", "✓"],
  ["Support", "Discord", "email", "priority", "dedicated"],
];

export function Compare() {
  const [col, setCol] = useState<number | null>(null);
  const heads = ["Free", "Pro", "Team", "Enterprise"];
  return (
    <section className="border-t border-line py-24">
      <div className="container-x">
        <Reveal>
          <h2 className="pb-8 text-[32px] leading-10 font-[570] tracking-[-0.02em] text-fg">Compare plans</h2>
        </Reveal>
        <div className="-mx-4 overflow-x-auto px-4" data-lenis-prevent onMouseLeave={() => setCol(null)}>
          <div className="min-w-[720px]">
            <div className="flex border-b border-fg py-3.5">
              <span className="flex-[2] font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted">FEATURE</span>
              {heads.map((h, i) => (
                <span key={h} onMouseEnter={() => setCol(i)} className={`flex-1 text-[14px] leading-[18px] font-[570] transition-colors ${col === i ? "text-accent" : "text-fg"}`}>
                  {h}
                </span>
              ))}
            </div>
            {ROWS.map((r, ri) => (
              <motion.div
                key={r[0]}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ri * 0.04 }}
                className="group/cr flex border-b border-line py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--hover)_60%,transparent)]"
              >
                <span className="flex-[2] text-[15px] leading-[18px] text-fg">{r[0]}</span>
                {r.slice(1).map((c, i) => (
                  <span
                    key={i}
                    onMouseEnter={() => setCol(i)}
                    className={`flex-1 font-mono text-[13px] leading-4 transition-colors ${c === "—" || i === 0 ? "text-muted" : "text-fg"} ${col === i ? "text-accent!" : ""}`}
                  >
                    {c}
                  </span>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
