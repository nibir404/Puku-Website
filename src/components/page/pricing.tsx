"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { EASE, Reveal, SplitText, Stagger } from "@/components/fx/reveal";
import { Button } from "@/components/ui/button";

type Cycle = "monthly" | "yearly";
type Cur = "USD" | "BDT";
type Audience = "individual" | "teams";

const PLANS = [
  // Paid plans go straight to onboarding until checkout exists; then point these at checkout and its success URL at /welcome?plan=…
  { name: "Free", tag: "For trying Puku on a side project.", usd: 0, bdt: 0, unit: "forever", cta: "Download", href: "/download", usage: "Limited agent requests", group: "INCLUDES", list: ["Editor, CLI and Chat", "50 agent requests / day", "Quick chat mode", "Community support"] },
  { name: "Pro", tag: "For daily, focused work.", usd: 20, bdt: 2400, unit: "/ month", cta: "Start Pro", href: "/welcome?plan=pro", usage: "10× Free usage", group: "EVERYTHING IN FREE, PLUS", list: ["500 agent requests / day", "Research + Deep modes", "Background runs", "Puku App preview"] },
  { name: "Team", tag: "For teams sharing one codebase.", usd: 40, bdt: 4800, unit: "/ seat / month", cta: "Start a team", href: "/welcome?plan=team", usage: "Pooled across seats", group: "EVERYTHING IN PRO, PLUS", list: ["Puku Bot in Slack + GitHub", "Puku Cloud agents", "Feluda code review", "Shared memory + skills", "Admin + usage dashboard"] },
  { name: "Enterprise", tag: "For security and scale needs.", usd: -1, bdt: -1, unit: "", cta: "Talk to us", href: "/contact", usage: "Custom volume", group: "EVERYTHING IN TEAM, PLUS", list: ["Higher Cloud + Feluda limits", "SSO / SAML, SCIM", "Audit log + retention", "Self-hosted sandboxes", "Invoicing + dedicated support"] },
];

function Seg<T extends string>({ value, options, onChange, id, mono }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; id: string; mono?: boolean }) {
  return (
    <div className="flex gap-0.5 rounded-control border border-line bg-panel p-1">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} aria-pressed={value === o.v} className={`relative rounded-control px-3 py-1.5 leading-4 whitespace-nowrap sm:px-3.5 transition-colors ${mono ? "font-mono text-[12px]" : "text-[13px]"} ${value === o.v ? (mono ? "text-fg" : "text-main") : "text-muted hover:text-fg"}`}>
          {value === o.v && <motion.span layoutId={id} className={`absolute inset-0 rounded-control ${mono ? "bg-hover" : "bg-fg"}`} transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
          <span className="relative">{o.l}</span>
        </button>
      ))}
    </div>
  );
}

/* Mobile: horizontal snap carousels, like swiping through cards in an app. From sm up they become grids. */

// Bleeds to the screen edge so the next card peeks in; the padding matches .container-x.
const SCROLLER = "-mx-[clamp(16px,5.56vw,80px)] snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-[clamp(16px,5.56vw,80px)] scroll-px-[clamp(16px,5.56vw,80px)] no-scrollbar sm:mx-0 sm:overflow-visible sm:px-0";

function useCarousel(count: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Each card's centre, measured in the scroller's own scroll coordinates.
  const centres = () => {
    const el = ref.current;
    if (!el) return [];
    const box = el.getBoundingClientRect();
    return Array.from(el.querySelectorAll<HTMLElement>("[data-snap]")).map((it) => {
      const r = it.getBoundingClientRect();
      return r.left - box.left + el.scrollLeft + r.width / 2;
    });
  };
  const go = useCallback((i: number, smooth = true) => {
    const el = ref.current;
    const c = centres()[i];
    if (!el || c === undefined || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: c - el.clientWidth / 2, behavior: smooth ? "smooth" : "auto" });
    setActive(i);
  }, []);
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    const cs = centres();
    const best = cs.reduce((b, c, i) => (Math.abs(c - mid) < Math.abs(cs[b] - mid) ? i : b), 0);
    setActive(Math.min(best, count - 1));
  };
  return { ref, active, go, onScroll };
}

function Dots({ count, active, go, labels }: { count: number; active: number; go: (i: number) => void; labels: string[] }) {
  return (
    <div className="flex justify-center gap-1.5 pt-4 sm:hidden" role="tablist">
      {Array.from({ length: count }, (_, i) => (
        <button key={i} role="tab" aria-selected={active === i} aria-label={labels[i]} onClick={() => go(i)} className="grid h-6 place-items-center px-0.5">
          <span className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${active === i ? "w-5 bg-fg" : "w-1.5 bg-selected"}`} />
        </button>
      ))}
    </div>
  );
}

const fmt = (n: number, cur: Cur) => (cur === "USD" ? `$${n}` : `৳${n.toLocaleString("en-US")}`);

export function Pricing() {
  const [audience, setAudience] = useState<Audience>("individual");
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [cur, setCur] = useState<Cur>("USD");
  // The featured card follows the audience: Pro for individuals, Team for teams.
  const featured = audience === "individual" ? "Pro" : "Team";
  const { ref, active, go, onScroll } = useCarousel(PLANS.length);
  const cardsRef = useRef<HTMLElement>(null);
  const [barOn, setBarOn] = useState(false);

  // Open the carousel on the featured plan, and jump to it when the audience changes.
  useEffect(() => {
    go(PLANS.findIndex((p) => p.name === featured), false);
  }, [featured, go]);

  // Mobile bottom bar: shows once the plan cards scroll away, hides near the end of the page.
  useEffect(() => {
    const check = () => {
      const r = cardsRef.current?.getBoundingClientRect();
      const nearEnd = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 900;
      setBarOn(!!r && r.bottom < 80 && !nearEnd);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const price = (p: (typeof PLANS)[number]) => {
    const raw = cur === "USD" ? p.usd : p.bdt;
    const val = raw <= 0 ? raw : cycle === "yearly" ? Math.round(raw * 0.8) : raw;
    return { raw, val };
  };
  const current = PLANS[active];

  return (
    <>
      <section className="container-x flex flex-col items-center gap-4 pt-[clamp(112px,10vw,144px)] pb-12 text-center">
        <Reveal y={8}>
          <div className="eyebrow tracking-[0.08em]">PRICING</div>
        </Reveal>
        <SplitText as="h1" immediate delay={0.15} text="Pricing" className="max-w-[760px] text-[clamp(40px,4.17vw,60px)] leading-[1.07] font-[570] tracking-[-0.035em] text-fg" />
        <Reveal delay={0.4}>
          <p className="max-w-[560px] text-[18px] leading-[27px] text-muted">One subscription for Editor, CLI, Chat and App. Start free, upgrade when you hit the limits.</p>
        </Reveal>
        <Reveal delay={0.5} className="flex w-full flex-col items-center gap-3 pt-4 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
          <Seg id="audience" value={audience} onChange={setAudience} options={[{ v: "individual", l: "Individual" }, { v: "teams", l: "Teams" }]} />
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Seg id="cycle" value={cycle} onChange={setCycle} options={[{ v: "monthly", l: "Monthly" }, { v: "yearly", l: "Yearly · −20%" }]} />
            <Seg id="cur" mono value={cur} onChange={setCur} options={[{ v: "USD", l: "USD" }, { v: "BDT", l: "BDT ৳" }]} />
          </div>
        </Reveal>
      </section>

      <section ref={cardsRef} className="container-x pb-16 sm:pb-24">
        <div ref={ref} onScroll={onScroll} className={SCROLLER}>
        <Stagger className="flex w-max gap-3 sm:grid sm:w-auto sm:grid-cols-2 sm:gap-4 xl:grid-cols-4" itemClassName="flex w-[min(84vw,340px)] shrink-0 snap-center snap-always sm:w-auto" y={16} stagger={0.08}>
          {PLANS.map((p) => {
            const { raw, val } = price(p);
            const isFeatured = p.name === featured;
            return (
              <div
                key={p.name}
                data-snap
                className={`group/plan relative flex w-full flex-col gap-6 overflow-hidden rounded-panel border bg-panel p-5 transition-[transform,box-shadow,border-color] sm:p-7 duration-300 active:scale-[0.99] sm:hover:-translate-y-1 ${
                  isFeatured ? "border-fg shadow-[0_24px_60px_-34px_color-mix(in_oklab,var(--accent)_70%,transparent)]" : "border-line hover:border-selected"
                }`}
              >
                {isFeatured && <span aria-hidden className="pointer-events-none absolute -top-28 -right-28 size-64 rounded-full bg-accent opacity-[0.08] blur-3xl transition-opacity duration-500 group-hover/plan:opacity-[0.16]" />}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-[16px] leading-5 font-[570] text-fg">{p.name}</span>
                    {isFeatured && <span className="font-mono text-[11px] leading-[14px] text-accent">{audience === "individual" ? "MOST CHOSEN" : "BEST FOR TEAMS"}</span>}
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
                      className="text-[40px] leading-[54px] font-[570] tracking-[-0.02em] text-fg sm:text-[44px]"
                    >
                      {raw < 0 ? "Custom" : fmt(val, cur)}
                    </motion.span>
                  </AnimatePresence>
                  <span className="min-w-0 text-[14px] leading-[18px] text-muted">
                    {p.unit}
                    {p.name === "Pro" && cur === "USD" && ` · ৳${(cycle === "yearly" ? 1920 : 2400).toLocaleString("en-US")}`}
                    {cycle === "yearly" && raw > 0 && <span className="block text-[11px] text-success">billed yearly</span>}
                  </span>
                </div>
                <Button href={p.href} variant={isFeatured ? "primary" : "secondary"} className="w-full" wrapClassName="w-full" size="md" magnetic={false}>
                  {p.cta}
                </Button>
                <div className="flex flex-col gap-5 border-t border-line pt-5">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted">USAGE</span>
                    <span className="text-[14px] leading-5 font-[570] text-fg">{p.usage}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted">{p.group}</span>
                    <ul className="flex flex-col font-mono text-[13px] leading-6 text-muted">
                      {p.list.map((l, i) => (
                        <motion.li key={l} initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05 }}>
                          <span className="text-success">✓</span> {l}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </Stagger>
        </div>
        <Dots count={PLANS.length} active={active} go={go} labels={PLANS.map((p) => p.name)} />
        <Reveal delay={0.2}>
          <p className="pt-6 text-center text-[13px] leading-5 text-muted">Prices exclude taxes. Cancel any time before renewal. Usage beyond plan limits is billed at cost.</p>
        </Reveal>
      </section>

      <AnimatePresence>
        {barOn && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[color-mix(in_oklab,var(--panel)_88%,transparent)] px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px] leading-[18px] text-muted">{current.name} plan</span>
                <span className="truncate text-[17px] leading-[22px] font-[570] text-fg">
                  {price(current).raw < 0 ? "Custom" : fmt(price(current).val, cur)}
                  <span className="text-[13px] font-normal text-muted"> {current.unit}</span>
                </span>
              </div>
              <Button href={current.href} variant="primary" size="md" magnetic={false}>
                {current.cta}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Team products: Puku Bot, Puku Cloud and Feluda, each with a small live-looking preview. */

const STAR = "M60 8 C72 8 75 31 85 36 C95 41 112 48 112 60 C112 72 95 79 85 84 C75 89 72 112 60 112 C48 112 45 89 35 84 C25 79 8 72 8 60 C8 48 25 41 35 36 C45 31 48 8 60 8 Z";

// Puku crew stars, copied from the Puku Bot character sheet.
function Star({ kind, size, glance = false }: { kind: "membrane" | "cathode" | "ember"; size: number; glance?: boolean }) {
  const id = `star-${kind}-${size}`;
  const eyeX = glance ? [52, 68] : [48, 64];
  const rotate = { membrane: -12, cathode: 8, ember: -6 }[kind];
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden className="shrink-0" style={{ rotate: `${rotate}deg` }}>
      <defs>
        {kind === "membrane" && (
          <radialGradient id={id} cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#e4e5ff" />
            <stop offset="100%" stopColor="#8e92f2" />
          </radialGradient>
        )}
        {kind === "cathode" && (
          <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2.4" fill="#94c7a0" />
            <rect y="2.4" width="4" height="1.6" fill="#6fa47c" />
          </pattern>
        )}
        {kind === "ember" && (
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3c9a4" />
            <stop offset="55%" stopColor="#e3a77c" />
            <stop offset="56%" stopColor="#c98458" />
            <stop offset="100%" stopColor="#b8734a" />
          </linearGradient>
        )}
      </defs>
      <path d={STAR} fill={`url(#${id})`} />
      {eyeX.map((x) =>
        kind === "cathode" ? (
          <rect key={x} x={x} y="56" width="8" height="15" rx="4" fill="none" stroke="#14261A" strokeWidth="2.5" />
        ) : (
          <rect key={x} x={x} y="56" width="8" height="15" rx="4" fill={kind === "ember" ? "#3a2010" : "#242449"} />
        ),
      )}
    </svg>
  );
}

// Feluda investigation symbol, from the Feluda identity file.
function FeludaMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden className="shrink-0 text-fg">
      <path d="M4 56 38 22H82L116 56 94 78 112 96H90L72 78 94 56 76 38H44L26 56 44 74H58V90H38Z" fill="currentColor" />
      <path d="M46 44H78V54H58V60H72V70H58V78H46Z" fill="currentColor" />
    </svg>
  );
}

function BotPreview() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-start gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-control bg-selected text-[11px] font-[570] text-fg">AR</span>
        <div className="flex flex-col gap-0.5 text-[13px] leading-[18px]">
          <span className="font-[570] text-muted">Arif · #eng</span>
          <span className="text-fg">
            <span className="text-accent">@puku</span> fix the flaky login test
          </span>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <Star kind="membrane" size={28} />
        <div className="flex min-w-0 flex-col gap-1.5 text-[13px] leading-[18px]">
          <span className="font-[570] text-muted">Puku Bot</span>
          <span className="text-fg">Fixed a race in the session mock. PR is up.</span>
          <span className="flex items-center gap-2 max-w-full self-start rounded-control border border-line bg-panel px-2.5 py-1.5 font-mono text-[12px] leading-4 whitespace-nowrap text-fg">
            <span className="size-1.5 shrink-0 rounded-full bg-success" />
            <span className="truncate">#482 · checks passed</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const RUNS = [
  { kind: "membrane", task: "migrate api to v2", progress: 0.68 },
  { kind: "cathode", task: "write e2e tests", progress: 0.36 },
  { kind: "ember", task: "bump deps", progress: 1 },
] as const;

function CloudPreview() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 pb-1 font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted">
        <span>3 AGENTS RUNNING</span>
        <span>LAPTOP CLOSED</span>
      </div>
      {RUNS.map((r, i) => (
        <div key={r.task} className="flex items-center gap-2.5 rounded-control border border-line bg-panel px-2.5 py-2">
          <Star kind={r.kind} size={22} glance={r.progress < 1} />
          <span className="min-w-0 flex-1 truncate font-mono text-[12px] leading-4 text-fg">{r.task}</span>
          {r.progress < 1 ? (
            <span className="h-1 w-10 shrink-0 sm:w-14 overflow-hidden rounded-full bg-selected">
              <motion.span
                className="block h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                whileInView={{ width: `${r.progress * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: EASE }}
              />
            </span>
          ) : (
            <span className="shrink-0 font-mono text-[11px] leading-[14px] text-success">done ✓</span>
          )}
        </div>
      ))}
    </div>
  );
}

function FeludaPreview() {
  return (
    <div className="flex flex-col overflow-hidden rounded-control border border-line bg-panel">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <FeludaMark size={18} />
        <span className="min-w-0 flex-1 truncate text-[13px] leading-[18px] font-[570] text-fg">Feluda reviewed #482</span>
        <span className="shrink-0 font-mono text-[11px] leading-[14px] text-danger">1 security</span>
      </div>
      <div className="flex flex-col bg-main py-1.5 font-mono text-[12px] leading-[18px]">
        <span className="truncate px-3 py-0.5 whitespace-pre text-muted">41  const token = req.query.t</span>
        <span className="bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] truncate px-3 py-0.5 whitespace-pre text-danger">{"42  db.raw(`…${token}`)"}</span>
      </div>
      <p className="px-3 py-2.5 text-[13px] leading-[19px] text-fg">Unescaped input reaches SQL. Use a bound parameter.</p>
    </div>
  );
}

const PRODUCTS = [
  { name: "Puku Bot", body: "Mention @puku in Slack or a GitHub issue. It takes the task, opens a PR and replies in the thread.", preview: <BotPreview /> },
  { name: "Puku Cloud", body: "Run agents in isolated cloud sandboxes, many at once. Close your laptop and the work keeps going.", preview: <CloudPreview /> },
  { name: "Feluda", body: "An AI reviewer on every pull request. It catches bugs and security issues before a human has to.", preview: <FeludaPreview /> },
];

export function TeamProducts() {
  const prod = useCarousel(PRODUCTS.length);
  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="container-x flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="flex flex-col gap-3">
            <Reveal y={8}>
              <div className="eyebrow tracking-[0.08em]">TEAM &amp; ENTERPRISE</div>
            </Reveal>
            <Reveal>
              <h2 className="text-[clamp(32px,2.78vw,40px)] leading-[1.2] font-[570] tracking-[-0.02em] text-fg">Puku, beyond your editor.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-[420px] text-[16px] leading-6 text-muted">Three products that work where your team already works. Included in every Team seat, with no add-on fees.</p>
          </Reveal>
        </div>
        <div ref={prod.ref} onScroll={prod.onScroll} className={SCROLLER}>
        <Stagger className="flex w-max gap-3 sm:grid sm:w-auto sm:grid-cols-1 sm:gap-4 lg:grid-cols-3" itemClassName="flex w-[min(84vw,340px)] shrink-0 snap-center snap-always sm:w-auto" y={16} stagger={0.08}>
          {PRODUCTS.map((p) => (
            <div key={p.name} data-snap className="flex w-full flex-col overflow-hidden rounded-panel border border-line bg-panel transition-[transform,border-color] duration-300 sm:hover:-translate-y-1 sm:hover:border-selected">
              <div className="flex flex-col justify-center border-b border-line bg-sidebar p-5 sm:p-6 lg:min-h-[248px]">{p.preview}</div>
              <div className="flex flex-col gap-2 px-5 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7">
                <h3 className="text-[20px] leading-[26px] font-[570] text-fg">{p.name}</h3>
                <p className="text-[14px] leading-[22px] text-muted">{p.body}</p>
              </div>
            </div>
          ))}
        </Stagger>
        </div>
        <Dots count={PRODUCTS.length} active={prod.active} go={prod.go} labels={PRODUCTS.map((p) => p.name)} />
      </div>
    </section>
  );
}

type Row = [string, string, string, string, string];

/** `summary` decides what a collapsed group shows per plan: how many rows are included, or its first row's value. */
const GROUPS: { title: string; tag?: string; summary: "count" | "first"; rows: Row[] }[] = [
  {
    title: "Usage",
    summary: "first",
    rows: [
      ["Agent requests", "50 / day", "500 / day", "pooled", "custom"],
      ["Usage vs. Free", "1×", "10×", "pooled", "custom"],
    ],
  },
  {
    title: "Puku features",
    summary: "count",
    rows: [
      ["Chat modes", "Quick", "Quick · Research · Deep", "all", "all"],
      ["Background runs", "—", "✓", "✓", "✓"],
      ["Shared memory and skills", "—", "—", "✓", "✓"],
      ["Puku App", "—", "preview", "✓", "✓"],
    ],
  },
  {
    title: "Team products",
    tag: "Team & Enterprise",
    summary: "count",
    rows: [
      ["Puku Bot", "—", "—", "Slack + GitHub", "+ custom integrations"],
      ["Puku Cloud", "—", "—", "pooled hours", "custom + self-hosted"],
      ["Feluda", "—", "—", "✓", "✓ + custom rules"],
    ],
  },
  {
    title: "Team management",
    summary: "count",
    rows: [
      ["Centralized billing", "—", "—", "✓", "✓"],
      ["SSO, SCIM, audit log", "—", "—", "SSO", "✓"],
      ["Usage analytics", "—", "—", "✓", "✓"],
      ["Invoice billing", "—", "—", "—", "✓"],
    ],
  },
  {
    title: "Support",
    summary: "first",
    rows: [
      ["Support", "Discord", "email", "priority", "dedicated"],
      ["Priority model access", "—", "✓", "✓", "✓"],
    ],
  },
];

const HEADS = PLANS.map((p) => ({ name: p.name, price: p.usd < 0 ? "Custom" : p.usd === 0 ? "$0 forever" : `$${p.usd} ${p.unit}`, cta: p.cta, href: p.href }));
/** Plan i adds something over plan i-1 in this row. */
const isNew = (r: Row, i: number) => i > 0 && r[i + 1] !== "—" && r[i + 1] !== r[i];
const summarize = (g: (typeof GROUPS)[number], i: number) => {
  if (g.summary === "first") return g.rows[0][i + 1];
  const n = g.rows.filter((r) => r[i + 1] !== "—").length;
  return n ? `${n} of ${g.rows.length}` : "—";
};

function Cell({ v, focused, fresh, delay = 0 }: { v: string; focused: boolean; fresh: boolean; delay?: number }) {
  const check = v.startsWith("✓");
  const rest = check ? v.slice(1).trim() : v;
  return (
    <span className="flex min-w-0 items-center gap-2 px-4">
      <AnimatePresence initial={false}>
        {fresh && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28, delay }}
            title="New in this plan"
            className="grid size-4 shrink-0 place-items-center rounded-full bg-accent text-[11px] leading-none font-[570] text-accent-ink"
          >
            +
          </motion.span>
        )}
      </AnimatePresence>
      {v === "—" ? (
        <span aria-label="Not included" className="block h-[1.5px] w-2.5 rounded-full bg-[var(--border)]" />
      ) : check ? (
        <span className="flex items-center gap-2">
          <span aria-label="Included" className={`grid size-[18px] shrink-0 place-items-center rounded-full transition-[background-color] duration-300 ${focused ? "bg-success" : "bg-[color-mix(in_oklab,var(--success)_55%,transparent)]"}`}>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <motion.path d="M2 5.2 4.1 7.2 8 3" stroke="var(--panel)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 + delay }} />
            </svg>
          </span>
          {rest && <span className={`font-mono text-[13px] leading-4 ${focused ? "text-fg" : "text-muted"}`}>{rest}</span>}
        </span>
      ) : (
        <span className={`font-mono text-[13px] leading-4 transition-colors duration-300 ${focused ? "text-fg" : "text-muted"}`}>{v}</span>
      )}
    </span>
  );
}

const GRID = "grid grid-cols-[2fr_repeat(4,1fr)] items-center";

export function Compare() {
  const [focus, setFocus] = useState(1);
  const [open, setOpen] = useState<boolean[]>(() => GROUPS.map((_, i) => i < 2));
  const allOpen = open.every(Boolean);
  const toggle = (gi: number) => setOpen((o) => o.map((v, i) => (i === gi ? !v : v)));

  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-4 pb-6 md:flex-row md:items-end md:pb-10">
          <Reveal className="flex flex-col gap-2.5">
            <h2 className="text-[clamp(28px,2.22vw,32px)] leading-[1.25] font-[570] tracking-[-0.02em] text-fg">Compare features across plans</h2>
            <p className="text-[16px] leading-6 text-muted">Pick a plan to see what it adds over the one before.</p>
          </Reveal>
          <Reveal delay={0.1} className="flex items-center gap-4 text-[13px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-success">
                <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden>
                  <path d="M2 5.2 4.1 7.2 8 3" stroke="var(--panel)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Included
            </span>
            <span className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-accent text-[11px] leading-none font-[570] text-accent-ink">+</span>
              New in this plan
            </span>
          </Reveal>
        </div>

        {/* Plan picker: sticky segmented control on mobile, sticky plan header on desktop */}
        <div className="sticky top-[64px] z-20 -mx-1 bg-main px-1 py-2 md:hidden">
          <div role="tablist" aria-label="Focus a plan" className="flex gap-0.5 rounded-control border border-line bg-panel p-1">
            {HEADS.map((h, i) => (
              <button key={h.name} role="tab" aria-selected={focus === i} onClick={() => setFocus(i)} className={`relative flex-1 rounded-control py-2 text-[13px] leading-4 transition-colors ${focus === i ? "text-main" : "text-muted"}`}>
                {focus === i && <motion.span layoutId="compare-pick" className="absolute inset-0 rounded-control bg-fg" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                <span className="relative">{h.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: the focused plan's column as a list */}
        <div className="md:hidden">
          {GROUPS.map((g) => (
            <div key={g.title} className="pt-6">
              <div className="flex items-center gap-2 border-b border-line pb-2.5">
                <span className="text-[15px] leading-5 font-[570] text-fg">{g.title}</span>
                {g.tag && <span className="rounded-control bg-hover px-[7px] py-0.5 text-[11px] text-muted">{g.tag}</span>}
              </div>
              {g.rows.map((r) => (
                <div key={r[0]} className="flex items-center justify-between gap-4 border-b border-line py-3">
                  <span className="text-[15px] leading-5 text-fg">{r[0]}</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={`${r[0]}-${focus}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="-mr-4 shrink-0">
                      <Cell v={r[focus + 1]} focused fresh={isNew(r, focus)} />
                    </motion.span>
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Desktop: full table with a focus band that slides between plans */}
        <div className="relative hidden md:block">
          <div aria-hidden className={`${GRID} pointer-events-none absolute inset-0`}>
            <motion.div
              className="h-full rounded-panel border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]"
              style={{ gridColumn: focus + 2, gridRow: 1 }}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
          </div>

          <div role="tablist" aria-label="Focus a plan" className={`${GRID} sticky top-[64px] z-20 border-b border-fg bg-[color-mix(in_oklab,var(--main)_92%,transparent)] backdrop-blur-[8px]`}>
            <span className="self-end py-4 font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted">FEATURE</span>
            {HEADS.map((h, i) => {
              const on = focus === i;
              return (
                <div key={h.name} className="flex flex-col gap-2 px-4 py-4">
                  <button role="tab" aria-selected={on} onClick={() => setFocus(i)} className="group/h flex flex-col items-start gap-1 text-left">
                    <span className="flex items-center gap-2">
                      <span className={`text-[15px] leading-5 font-[570] transition-colors ${on ? "text-fg" : "text-muted group-hover/h:text-fg"}`}>{h.name}</span>
                      {on && <motion.span layoutId="focus-tag" className="font-mono text-[10px] tracking-[0.06em] text-accent">FOCUSED</motion.span>}
                    </span>
                    <span className={`text-[13px] leading-4 transition-colors ${on ? "text-fg" : "text-muted"}`}>{h.price}</span>
                  </button>
                  {on ? (
                    <motion.a layoutId="focus-cta" href={h.href} className="flex h-[30px] items-center justify-center rounded-control bg-fg text-[13px] font-[570] text-panel transition-transform active:scale-[0.97]">
                      {h.cta}
                    </motion.a>
                  ) : (
                    <a href={h.href} className="flex h-[30px] items-center text-[13px] text-muted transition-colors hover:text-fg">
                      {h.cta} →
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {GROUPS.map((g, gi) => (
            <div key={g.title} className="relative">
              <button onClick={() => toggle(gi)} aria-expanded={open[gi]} className={`${GRID} group/g w-full border-b border-line pt-7 pb-3 text-left`}>
                <span className="flex items-center gap-2.5">
                  <motion.svg animate={{ rotate: open[gi] ? 0 : -90 }} transition={{ duration: 0.25 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted transition-colors group-hover/g:text-fg" aria-hidden>
                    <path d="m6 9 6 6 6-6" />
                  </motion.svg>
                  <span className="text-[16px] leading-5 font-[570] text-fg">{g.title}</span>
                  <span className="font-mono text-[12px] text-muted">{g.rows.length}</span>
                  {g.tag && <span className="rounded-control bg-hover px-[7px] py-0.5 text-[12px] text-muted">{g.tag}</span>}
                </span>
                {HEADS.map((_, i) => (
                  <AnimatePresence key={i} initial={false}>
                    {!open[gi] && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`px-4 font-mono text-[12px] ${focus === i ? "text-fg" : "text-muted"}`}>
                        {summarize(g, i)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                ))}
              </button>
              <AnimatePresence initial={false}>
                {open[gi] && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                    {g.rows.map((r, ri) => (
                      <motion.div
                        key={r[0]}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ri * 0.04 }}
                        className={`${GRID} min-h-14 border-b border-line transition-colors hover:bg-[color-mix(in_oklab,var(--hover)_45%,transparent)]`}
                      >
                        <span className="text-[15px] leading-5 text-fg">{r[0]}</span>
                        {HEADS.map((_, i) => (
                          <Cell key={i} v={r[i + 1]} focused={focus === i} fresh={focus === i && isNew(r, i)} delay={ri * 0.03} />
                        ))}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

        </div>
        <div className="hidden justify-center pt-6 md:flex">
          <button onClick={() => setOpen(GROUPS.map(() => !allOpen))} className="text-[14px] text-accent transition-opacity hover:opacity-80">
            {allOpen ? "Collapse groups" : "Expand all groups"}
          </button>
        </div>
      </div>
    </section>
  );
}
