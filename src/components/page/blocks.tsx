"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE, Reveal, SplitText, Stagger } from "@/components/fx/reveal";

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Reveal y={8}>
      <div className={`eyebrow ${className}`}>{children}</div>
    </Reveal>
  );
}

export function Heading({ text, className = "", medium = false }: { text: string; className?: string; medium?: boolean }) {
  return (
    <SplitText
      text={text}
      className={`tracking-[-0.03em] text-fg ${medium ? "text-[clamp(32px,3.06vw,44px)] leading-[1.136] font-[570]" : "text-[clamp(34px,3.33vw,48px)] leading-[1.083]"} ${className}`}
    />
  );
}

export function Section({ children, className = "", border = true }: { children: React.ReactNode; className?: string; border?: boolean }) {
  return (
    <section className={`${border ? "border-t border-line" : ""} py-[clamp(72px,8.3vw,120px)] ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

/* Two-column statement row */
export function Statement({ lead, body }: { lead: string; body: string }) {
  return (
    <Reveal className="flex flex-col gap-4 border-t border-line pt-10 md:flex-row md:gap-20">
      <p className="w-full shrink-0 text-[clamp(19px,1.53vw,22px)] leading-8 text-fg md:w-[400px]">{lead}</p>
      <p className="max-w-[760px] text-[clamp(19px,1.53vw,22px)] leading-8 text-muted">{body}</p>
    </Reveal>
  );
}

/* Row of small features */
export function FeatureRow({ items, cols = 4 }: { items: { title: string; body: string }[]; cols?: 3 | 4 }) {
  return (
    <Stagger
      className={`grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      itemClassName="flex"
      stagger={0.09}
    >
      {items.map((f) => (
        <div key={f.title} className="flex flex-col gap-2">
          <span className="text-[18px] leading-6 font-[570] tracking-[-0.01em] text-fg">{f.title}</span>
          <span className="text-[15px] leading-[22px] text-muted">{f.body}</span>
        </div>
      ))}
    </Stagger>
  );
}

/* Keyboard shortcut list — rows light up when the visitor presses the combo */
const norm = (e: KeyboardEvent) => {
  const k: string[] = [];
  if (e.metaKey) k.push("⌘");
  if (e.ctrlKey) k.push("⌃");
  const key = e.key === "Tab" ? "⇥" : e.key === "Enter" ? "↵" : e.key.length === 1 ? e.key.toUpperCase() : e.key;
  if (!["Meta", "Control"].includes(e.key)) k.push(key);
  return k.join(" ");
};

export function ShortcutList({ items }: { items: { label: string; keys: string }[] }) {
  const [hit, setHit] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const combo = norm(e);
      const m = items.find((i) => i.keys.replace("`", "`".toUpperCase()) === combo);
      if (m) {
        const r = ref.current?.getBoundingClientRect();
        if (r && r.top < innerHeight && r.bottom > 0) e.preventDefault();
        setHit(m.keys);
        setTimeout(() => setHit(null), 900);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [items]);
  return (
    <div ref={ref} className="flex w-full flex-col border-t border-line">
      {items.map((s, i) => (
        <motion.button
          type="button"
          key={s.label}
          onClick={() => (setHit(s.keys), setTimeout(() => setHit(null), 900))}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
          className={`group/key flex items-center justify-between border-b border-line py-[18px] text-left transition-colors ${hit === s.keys ? "bg-[color-mix(in_oklab,var(--accent)_7%,transparent)]" : ""}`}
        >
          <span className="text-[17px] leading-6 text-fg transition-transform duration-300 group-hover/key:translate-x-1">{s.label}</span>
          <span className="flex gap-1">
            {s.keys.split(" ").map((k) => (
              <motion.kbd
                key={k}
                animate={hit === s.keys ? { y: [0, 2, 0], scale: [1, 0.94, 1] } : {}}
                transition={{ duration: 0.25 }}
                className={`min-w-7 rounded-control border px-2 py-1 text-center font-mono text-[13px] leading-4 shadow-[0_1px_0_var(--border)] transition-colors ${
                  hit === s.keys ? "border-accent bg-accent text-accent-ink" : "border-line bg-panel text-fg group-hover/key:border-selected"
                }`}
              >
                {k}
              </motion.kbd>
            ))}
          </span>
        </motion.button>
      ))}
      <p className="pt-3 font-mono text-[11px] text-muted">Try it — press a combo on your keyboard.</p>
    </div>
  );
}

/* Next-edit completion: ghost line types in; ⇥ or click accepts */
export function NextEditCard() {
  const ghost = "    if (!(await verify(password, user.hash))) return unauthorized()";
  const [typed, setTyped] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!seen || accepted || typed >= ghost.length) return;
    const t = setTimeout(() => setTyped((n) => n + 1), 40);
    return () => clearTimeout(t);
  }, [seen, typed, accepted, ghost.length]);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !seen || accepted) return;
      const r = ref.current?.getBoundingClientRect();
      if (r && r.top < innerHeight && r.bottom > 0) {
        e.preventDefault();
        setAccepted(true);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [seen, accepted]);

  const lines = [
    "  export async function login(req: Request) {",
    "    const { email, password } = await req.json()",
    "+   await rateLimit(req.ip, { max: 10 })",
    "    const user = await db.user.find({ email })",
    "    if (!user) return unauthorized()",
  ];
  return (
    <div ref={ref} className="flex min-h-[420px] flex-col justify-between gap-8 rounded-panel border border-line bg-panel p-8 lg:basis-0 lg:grow-[1.3]">
      <div className="overflow-x-auto font-mono text-[13px] leading-[21px] whitespace-pre text-muted" data-lenis-prevent>
        {lines.map((l) => (
          <div key={l} className={l.startsWith("+") ? "text-success" : ""}>
            {l}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <span className={accepted ? "text-fg" : "text-muted/60"}>
            {accepted ? ghost : ghost.slice(0, typed)}
            {!accepted && typed < ghost.length && <span className="ml-px inline-block h-4 w-[7px] translate-y-[3px] animate-[blink_1s_steps(1)_infinite] bg-accent" />}
          </span>
          <AnimatePresence>
            {!accepted && typed >= ghost.length && (
              <motion.button
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setAccepted(true)}
                className="rounded-[4px] border border-line bg-hover px-1.5 text-[11px] text-fg hover:border-accent"
              >
                ⇥ to accept
              </motion.button>
            )}
            {accepted && (
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-[11px] text-success">
                ✓ accepted
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {accepted && (
          <button onClick={() => (setAccepted(false), setTyped(0))} className="mt-2 text-[11px] text-accent hover:underline">
            ↺ replay
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[22px] leading-7 font-[570] tracking-[-0.02em] text-fg">Next-edit completion</span>
        <span className="max-w-[440px] text-[15px] leading-[22px] text-muted">
          Predicts the edit you&apos;ll make next, not just the next word. Press ⇥ to accept, keep typing to ignore.
        </span>
      </div>
    </div>
  );
}

/* @-mention context picker */
export function MentionCard() {
  const opts = [
    { k: "@ auth.tsx", d: "app/renderer" },
    { k: "@ auth.test.ts", d: "app/renderer" },
    { k: "@ PUKU.md", d: "project memory" },
  ];
  const [sel, setSel] = useState(0);
  const [chips, setChips] = useState(["@auth.tsx", "$session-skill"]);
  return (
    <div className="flex min-h-[420px] flex-col justify-between gap-8 rounded-panel border border-line bg-panel p-8 lg:basis-0 lg:grow">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 rounded-control border border-line bg-panel px-3 py-2.5 text-[14px] text-fg">
          Refactor
          <AnimatePresence>
            {chips.slice(0, 1).map((c) => (
              <motion.span layout key={c} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-[4px] bg-hover px-1.5 py-0.5 font-mono text-[12px] text-accent">
                {c}
              </motion.span>
            ))}
          </AnimatePresence>
          using
          <span className="rounded-[4px] bg-hover px-1.5 py-0.5 font-mono text-[12px] text-accent">{chips[1]}</span>
          <span className="h-4 w-px animate-[blink_1s_steps(1)_infinite] bg-accent" />
        </div>
        <div className="flex flex-col overflow-hidden rounded-control border border-line bg-panel" onMouseLeave={() => setSel(0)}>
          {opts.map((o, i) => (
            <button
              key={o.k}
              onMouseEnter={() => setSel(i)}
              onClick={() => setChips((c) => [o.k.replace("@ ", "@"), c[1]])}
              className={`flex justify-between px-3 py-2 text-left font-mono text-[12px] transition-colors ${sel === i ? "bg-hover text-fg" : "text-muted"}`}
            >
              <span>
                {o.k} <span className="text-muted">{o.d}</span>
              </span>
              {sel === i && <span className="text-[10px] text-muted">↵</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[22px] leading-7 font-[570] text-fg">Context you can point at</span>
        <span className="text-[15px] leading-[22px] text-muted">@ files and symbols, $ skills, / commands. The agent only reads what it needs.</span>
      </div>
    </div>
  );
}
